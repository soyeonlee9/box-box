require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function run() {
    const { data: bData } = await supabase.from('brands').select('*');
    if (!bData) {
        console.log("No brands found.");
        return;
    }
    for (const b of bData) {
        let query = supabase.from('qr_scans').select('*, campaigns!inner(brand_id)').eq('campaigns.brand_id', b.id);
        const { data: scanData } = await query;
        console.log(`Brand ${b.name}: ${scanData ? scanData.length : 0} scans`);
    }
}
run();
