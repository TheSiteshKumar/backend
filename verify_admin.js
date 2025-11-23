import http from 'http';

const BASE_URL = 'http://localhost:4444/api';
const USER_EMAIL = `test_user_${Date.now()}@example.com`;
const ADMIN_EMAIL = `test_admin_${Date.now()}@example.com`;
const PASSWORD = 'password123';

let userToken = '';
let adminToken = '';

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
        console.log('--- Verifying Admin Route ---');

        // 1. Register User
        console.log('\n1. Registering User...');
        const userReg = await request('/auth/register', 'POST', { email: USER_EMAIL, password: PASSWORD });
        userToken = userReg.body.token;
        console.log('User Token received');

        // 2. Register Admin (Need to manually set role in DB or assume register creates 'user' and we update it, 
        //    but for now let's try to register with role if allowed, or just use the user token to fail)
        //    Since we can't easily create an admin via API without a specific route or backdoor, 
        //    we will test that a normal user CANNOT access the admin route.
        //    To test success, we would need to seed an admin user.

        //    Wait! The user added a role field to the model. Let's see if we can pass it in register.
        //    The auth service takes email and password. It doesn't seem to take role.
        //    So we can only test failure for now unless we modify auth service to accept role (which might be insecure).

        //    Let's try to access admin route with user token.
        console.log('\n2. Accessing Admin Route as User...');
        const failRes = await request('/todo/admin/all', 'GET', null, userToken);
        console.log('Status:', failRes.status); // Should be 403
        console.log('Message:', failRes.body.message);

        // 3. Register Admin
        console.log('\n3. Registering Admin...');
        const adminReg = await request('/auth/register', 'POST', { email: ADMIN_EMAIL, password: PASSWORD, role: 'admin' });
        adminToken = adminReg.body.token;
        console.log('Admin Token received');

        // 4. Access Admin Route as Admin
        console.log('\n4. Accessing Admin Route as Admin...');
        const successRes = await request('/todo/admin/all', 'GET', null, adminToken);
        console.log('Status:', successRes.status); // Should be 200
        console.log('Count:', successRes.body.data ? successRes.body.data.length : 0);

    } catch (err) {
        console.error('Error:', err);
    }
};

run();
