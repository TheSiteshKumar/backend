import http from 'http';

const BASE_URL = 'http://localhost:4444/api';
const EMAIL = `test_todo_${Date.now()}@example.com`;
const PASSWORD = 'password123';

let token = '';

const request = (path, method, body, authToken) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4444,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
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
        console.log('--- Verifying Todo Route Protection ---');

        // 1. Try to get todos without token (Should fail)
        console.log('\n1. Getting Todos (No Token)...');
        const noTokenRes = await request('/todo', 'GET');
        console.log('Status:', noTokenRes.status); // Should be 401

        // 2. Register/Login to get token
        console.log('\n2. Authenticating...');
        const regRes = await request('/auth/register', 'POST', { email: EMAIL, password: PASSWORD });
        if (regRes.body.token) {
            token = regRes.body.token;
            console.log('Token received');
        } else {
            // Try login if user exists
            const loginRes = await request('/auth/login', 'POST', { email: EMAIL, password: PASSWORD });
            token = loginRes.body.token;
            console.log('Token received (login)');
        }

        // 3. Create Todo (With Token)
        console.log('\n3. Creating Todo (With Token)...');
        const createRes = await request('/todo', 'POST', { name: 'Test Todo' }, token);
        console.log('Status:', createRes.status);
        console.log('Body:', createRes.body);

        // 4. Get Todos (With Token)
        console.log('\n4. Getting Todos (With Token)...');
        const getRes = await request('/todo', 'GET', null, token);
        console.log('Status:', getRes.status);
        console.log('Count:', getRes.body.data ? getRes.body.data.length : 0);

    } catch (err) {
        console.error('Error:', err);
    }
};

run();
