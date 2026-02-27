import jwt from 'jsonwebtoken';
import fetch from 'node-fetch'; // May need to install or use native fetch

const secret = process.env.JWT_SECRET || '+4BjR/RwUgTEu2rc6DxIrpUpHNVZadGdaEFQHcyYP4xqRlZ41zCMRr/RI/7IAVW7L7ZFnXJQp2YhD3Wjg7EkIA==';
const token = jwt.sign(
    { id: '30895aaf-b027-43b4-a953-963f38259d85', email: 'soyeon96120@gmail.com', name: '이소연', role: 'super_admin', brand_id: '1aad9476-ffb2-4c64-9af8-eddf627b49be' },
    secret
);

async function run() {
    const res = await fetch('http://localhost:5001/api/admin/brands', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
}
run();
