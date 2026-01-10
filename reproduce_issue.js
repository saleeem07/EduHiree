// using global fetch
const fs = require('fs');
const util = require('util');

const API_URL = 'http://localhost:5001/api/auth';
const LOG_FILE = 'reproduce_log_5001.txt';

function log(message) {
    const line = `${new Date().toISOString()} - ${message}\n`;
    console.log(message);
    fs.appendFileSync(LOG_FILE, line);
}

async function reproduce() {
    try {
        log('Starting reproduction...');

        // 1. Register a user
        const email = `test${Date.now()}@example.com`;
        log(`Registering user: ${email}`);
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: 'password123',
                firstName: 'Test',
                lastName: 'User'
            })
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
        const token = regData.token;
        log(`Registered. Token: ${token.substring(0, 10)}...`);

        // 2. Add Internship
        log('Adding internship...');
        const updateRes = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                internships: [{
                    title: 'Intern',
                    company: 'Tech Corp',
                    location: 'Remote',
                    startDate: '2024-01',
                    endDate: '2024-06',
                    description: 'Did stuff'
                }]
            })
            // Sending only internships might trigger the logic we want to test
        });

        if (!updateRes.ok) {
            const text = await updateRes.text();
            log(`FAILED TO SAVE. Status: ${updateRes.status}`);
            log(`Response text: ${text}`);
        } else {
            const updateData = await updateRes.json();
            log(`Response body: ${JSON.stringify(updateData, null, 2)}`);
            log('SUCCESS: Profile saved.');
        }

    } catch (error) {
        log(`Error: ${error.message}`);
        log(error.stack);
    }
}

reproduce();
