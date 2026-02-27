import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

async function test() {
    // Simulate what the admin controller might be doing if it was logging in
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'soyeon96120@gmail.com',
        password: 'dummy' // we don't have the password, we use JWT
    });
}
test();
