import http from 'http';

const BASE_URL = 'http://localhost:4444/api';
const USER1_EMAIL = `user1_${Date.now()}@example.com`;
const USER2_EMAIL = `user2_${Date.now()}@example.com`;
const PASSWORD = 'password123';

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
        console.log('--- Verifying CreatedBy & User Isolation ---');

        // 1. Register User 1
        console.log('\n1. Registering User 1...');
        const reg1 = await request('/auth/register', 'POST', { email: USER1_EMAIL, password: PASSWORD });
        const token1 = reg1.body.token;
        const id1 = reg1.body.user.id;
        console.log('User 1 ID:', id1);

        // 2. Create Todo for User 1
        console.log('\n2. Creating Todo for User 1...');
        const create1 = await request('/todo', 'POST', { name: 'User 1 Todo' }, token1);
        console.log('Status:', create1.status);
        console.log('CreatedBy:', create1.body.data.createdBy);
        if (create1.body.data.createdBy === id1) {
            console.log('SUCCESS: createdBy matches User 1 ID');
        } else {
            console.log('FAILURE: createdBy mismatch');
        }

        // 3. Register User 2
        console.log('\n3. Registering User 2...');
        const reg2 = await request('/auth/register', 'POST', { email: USER2_EMAIL, password: PASSWORD });
        const token2 = reg2.body.token;
        console.log('User 2 Registered');

        // 4. Get Todos as User 2 (Should NOT see User 1's todo)
        console.log('\n4. Getting Todos as User 2...');
        const get2 = await request('/todo', 'GET', null, token2);
        console.log('Status:', get2.status);
        console.log('Count:', get2.body.data ? get2.body.data.length : 0);
        if (get2.body.data && get2.body.data.length === 0) {
            console.log('SUCCESS: User 2 sees 0 todos');
        } else {
            console.log('FAILURE: User 2 sees todos');
        }

        // 5. Get Todos as User 1 (Should see 1 todo)
        console.log('\n5. Getting Todos as User 1...');
        const get1 = await request('/todo', 'GET', null, token1);
        console.log('Count:', get1.body.data ? get1.body.data.length : 0);

    } catch (err) {
        console.error('Error:', err);
    }
};

run();
