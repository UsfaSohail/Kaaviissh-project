import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch gold rate from goldprice.org Pakistan page
    const response = await fetch('https://data-asg.goldprice.org/dbXRates/PKR', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    let goldRate = 0;
    let silverRate = 0;

    if (response.ok) {
      const data = await response.json();
      // data.items[0].xauPrice = gold price per troy ounce in PKR
      // data.items[0].xagPrice = silver price per troy ounce in PKR
      if (data?.items?.[0]) {
        const goldPerOz = data.items[0].xauPrice || 0;
        const silverPerOz = data.items[0].xagPrice || 0;
        // Convert from troy ounce to gram (1 troy oz = 31.1035g)
        goldRate = Math.round(goldPerOz / 31.1035);
        silverRate = Math.round(silverPerOz / 31.1035);
      }
    }

    console.log(`Fetched rates - Gold: ${goldRate}/g, Silver: ${silverRate}/g`);

    if (goldRate > 0 && silverRate > 0) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Get existing record
      const { data: existing } = await supabase
        .from('zakat_rates')
        .select('id, is_admin_override')
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Only update if not admin override
        if (!existing.is_admin_override) {
          await supabase.from('zakat_rates').update({
            gold_rate_per_gram: goldRate,
            silver_rate_per_gram: silverRate,
            last_updated: new Date().toISOString(),
          }).eq('id', existing.id);
          console.log('Rates updated in DB');
        } else {
          console.log('Admin override active, skipping update');
        }
      } else {
        // Insert new record
        await supabase.from('zakat_rates').insert({
          gold_rate_per_gram: goldRate,
          silver_rate_per_gram: silverRate,
        });
        console.log('New rates record created');
      }
    }

    return new Response(JSON.stringify({ success: true, goldRate, silverRate }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});