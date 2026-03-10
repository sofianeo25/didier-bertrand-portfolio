const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cgbtecyaubttcxtxtciy.supabase.co', 'sb_publishable_l30XmcbQTtlRv_cRuJT8Tg_LjiV4DWf');
async function run() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@didierbertrand.com',
    password: 'Didier2024!'
  });
  console.log(data, error);
}
run();
