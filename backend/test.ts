import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
);

async function test() {
    const { data, error } = await supabase
        .from('brands')
        .select('*');

    console.log("Error:", error);
    console.log("Data:", data);
}

test();
