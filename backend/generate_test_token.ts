import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET || '';
const token = jwt.sign({ id: 'test-admin-id', email: 'admin@test.com', name: 'Admin' }, secret, {
    expiresIn: '1h'
});

console.log(token);
