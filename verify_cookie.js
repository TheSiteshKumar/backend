import http from 'http';

const BASE_URL = 'http://localhost:4444/api';
const EMAIL = `test_cookie_${Date.now()}@example.com`;
const PASSWORD = 'password123';

let cookie = '';

const request = (path, method, body, cookieHeader) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4444,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        body: JSON.parse(data),
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        body: data,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};

const run = async () => {
    try {
        console.log('--- Verifying Cookie Authentication ---');

        // 1. Register (Should set cookie)
        console.log('\n1. Registering...');
        const regRes = await request('/auth/register', 'POST', { email: EMAIL, password: PASSWORD });
        console.log('Status:', regRes.status);

        const setCookie = regRes.headers['set-cookie'];
        if (setCookie) {
            console.log('Set-Cookie Header Found:', setCookie);
            // Extract token cookie
            cookie = setCookie.find(c => c.startsWith('token='));
            console.log('Extracted Cookie:', cookie);
        } else {
            console.log('No Set-Cookie header found!');
        }

        // 2. Access Protected Route (With Cookie, No Bearer)
        console.log('\n2. Accessing Protected Route (Cookie)...');
        if (cookie) {
            const meRes = await request('/auth/me', 'GET', null, cookie);
            console.log('Status:', meRes.status); // Should be 200
            console.log('Body:', meRes.body);
        } else {
            console.log('Skipping step 2 (no cookie)');
        }

        // 3. Logout (Should clear cookie)
        console.log('\n3. Logging out...');
        const logoutRes = await request('/auth/logout', 'POST', null, cookie);
        console.log('Status:', logoutRes.status);
        console.log('Set-Cookie (Logout):', logoutRes.headers['set-cookie']);

    } catch (err) {
        console.error('Error:', err);
    }
};

run();
