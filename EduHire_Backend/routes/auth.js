const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password,
            profile: {
                personal: {
                    firstName,
                    lastName
                }
            }
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // If user created via social login but trying to login with password (and has no password)
        // If user created via social login but has no password
        // FIX: For demo purposes, if they provide a password, we save it and let them in.
        if (!user.password && user.createdViaSocial) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            // user.createdViaSocial = false; // Optional: keep true to know origin
            await user.save();
            // Continue to login...
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/auth/me
// @desc     Get logged in user
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/auth/google
// @desc     Google Login (Mock/Actual)
// @access   Public
router.post('/google', async (req, res) => {
    const { email, profile } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                authProvider: 'google',
                createdViaSocial: true,
                profile: profile
            });
            await user.save();
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/auth/profile
// @desc     Update user profile
// @access   Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { personal, education, internships, experience, skills, projects } = req.body;
        console.log('RECEIVED SKILLS:', JSON.stringify(skills, null, 2)); // DEBUG LOG

        // Build profile object
        const profileFields = {};
        if (personal) profileFields.personal = personal;
        if (education) profileFields.education = education;

        // Handle internships / experience map
        let combinedExperience = [];
        if (experience) combinedExperience = [...experience];
        if (internships && Array.isArray(internships)) {
            const mappedInternships = internships.map(i => ({
                ...i,
                type: 'Internship',
                role: i.title
            }));
            combinedExperience = [...combinedExperience, ...mappedInternships];
        }
        if (combinedExperience.length > 0) profileFields.experience = combinedExperience;

        if (skills) profileFields.skills = skills;
        if (projects) profileFields.projects = projects;

        let user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Update profile fields explicitly
        if (personal) user.profile.personal = { ...user.profile.personal, ...personal };
        if (education) user.profile.education = education;
        if (combinedExperience.length > 0) user.profile.experience = combinedExperience;
        if (skills) {
            // Ensure skills object exists
            if (!user.profile.skills) {
                user.profile.skills = {};
            }

            user.profile.skills.programming = skills.programming || [];
            user.profile.skills.frameworks = skills.frameworks || [];
            user.profile.skills.databases = skills.databases || [];
            user.profile.skills.tools = skills.tools || [];

            // Optional: Handle others if they exist in schema
            if (skills.technical) user.profile.skills.technical = skills.technical;
            if (skills.languages) user.profile.skills.languages = skills.languages;
            if (skills.soft) user.profile.skills.soft = skills.soft;
        }
        if (projects) user.profile.projects = projects;

        user.lastUpdated = Date.now();

        if (!user.activityLog) user.activityLog = [];
        user.activityLog.unshift({
            type: 'profile',
            action: 'Updated profile details',
            time: Date.now()
        });

        user.markModified('profile');
        console.log('SAVING SKILLS:', JSON.stringify(user.profile.skills, null, 2)); // DEBUG LOG
        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Profile Update Error:', err);
        res.status(500).send('Server Error: ' + err.message);
    }

});

module.exports = router;
