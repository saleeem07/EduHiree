const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Not required for social login users
    },
    authProvider: {
        type: String,
        default: 'local' // 'local', 'google', 'facebook'
    },
    createdViaSocial: {
        type: Boolean,
        default: false
    },
    profile: {
        personal: {
            firstName: String,
            lastName: String,
            avatar: String,
            headline: String,
            phone: String,
            location: String,
            githubUrl: String,
            linkedinUrl: String,
            portfolioUrl: String,
            about: String
        },
        education: [
            {
                institution: String,
                degree: String,
                field: String,
                location: String,
                gpa: String,
                startDate: String,
                endDate: String,
                description: String
            }
        ],
        experience: [
            {
                company: String,
                role: String,
                type: { type: String }, // 'Full-time', 'Internship'
                location: String,
                startDate: String,
                endDate: String,
                description: String
            }
        ],
        skills: {
            programming: [String],
            frameworks: [String],
            databases: [String],
            tools: [String],
            technical: [String],
            languages: [String],
            soft: [String]
        },
        projects: [
            {
                title: String,
                description: String,
                techStack: [String],
                link: String,
                githubLink: String
            }
        ],
        internships: [
            {
                company: String,
                role: String,
                startDate: String,
                endDate: String,
                description: String
            }
        ],
        achievements: [String],
        certifications: [
            {
                name: String,
                issuer: String,
                date: String,
                url: String
            }
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    dashboardStats: {
        profileViews: { type: Number, default: 0 },
        applications: { type: Number, default: 0 },
        interviews: { type: Number, default: 0 }
    },
    activityLog: [
        {
            type: { type: String }, // 'resume', 'project', 'internship', etc.
            action: { type: String },
            time: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('user', UserSchema);
