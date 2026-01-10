// const fetch = require('node-fetch'); // Native fetch is available in Node 18+

const API_URL = 'http://localhost:5000/api/auth';

async function run() {
    try {
        // 1. Register/Login
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';

        console.log('Registering user:', email);
        let res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, firstName: 'Test', lastName: 'User' })
        });

        let data = await res.json();
        let token = data.token;

        if (!token) {
            // Try login if exists
            console.log('User exists, logging in...');
            res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            data = await res.json();
            token = data.token;
        }

        if (!token) {
            console.error('Failed to get token');
            return;
        }

        console.log('Got token, updating skills...');

        // 2. Update Profile with Skills
        const skillsPayload = {
            skills: {
                programming: ['JavaScript', 'Python'],
                frameworks: ['React', 'Express'],
                databases: ['MongoDB'],
                tools: ['Git']
            }
        };

        res = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(skillsPayload)
        });

        const updateData = await res.json();
        console.log('Update Response Status:', res.status);
        // console.log('Update Response Body:', JSON.stringify(updateData, null, 2));

        // 3. Verify Persistence
        console.log('Fetching user profile to verify...');
        res = await fetch(`${API_URL}/me`, {
            headers: { 'x-auth-token': token }
        });

        const userData = await res.json();
        console.log('Fetched User Skills:', JSON.stringify(userData.profile?.skills, null, 2));

        if (userData.profile?.skills?.programming?.includes('JavaScript')) {
            console.log('SUCCESS: Skills persisted!');
        } else {
            console.error('FAILURE: Skills DID NOT persist.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

run();
