require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testFilter() {
  const { data, error } = await supabase.from('qr_scans').select('*, campaigns!inner(*)');
  console.log("ALL SCANS COUNT:", data ? data.length : 0);

  const { data: bData, error: bError } = await supabase.from('brands').select('*');
  if (bData && bData.length > 0) {
      for (const b of bData) {
          const { data: scanData } = await supabase.from('qr_scans').select('*, campaigns!inner(brand_id)').eq('campaigns.brand_id', b.id);
          console.log(`Brand ${b.name} (${b.id}) SCANS COUNT:`, scanData ? scanData.length : 0);
      }
  }
}

testFilter();
