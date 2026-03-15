const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://cgbtecyaubttcxtxtciy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_l30XmcbQTtlRv_cRuJT8Tg_LjiV4DWf';
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigration() {
    console.log("Renaming Nature to Voyage...");
    const { error: err1 } = await db.from('series').update({ cat: 'Voyage' }).eq('cat', 'Nature');
    if (err1) return console.error("Error renaming:", err1);

    console.log("Checking if Baikal already exists...");
    const { data: exist } = await db.from('series').select('*').in('slug', ['baikal', 'sahara', 'norvege-lofoten']);
    
    if (!exist || exist.length === 0) {
        console.log("Inserting new dummy series: Baikal, Sahara, Norvege Lofoten...");
        const { error: err2 } = await db.from('series').insert([
            { title: 'Baïkal', slug: 'baikal', cat: 'Voyage', cover: '', desc: 'Série photographique au Lac Baïkal.', images_count: 0 },
            { title: 'Sahara', slug: 'sahara', cat: 'Voyage', cover: '', desc: 'Série photographique dans le Sahara.', images_count: 0 },
            { title: 'Norvège Lofoten', slug: 'norvege-lofoten', cat: 'Voyage', cover: '', desc: 'Série photographique aux îles Lofoten.', images_count: 0 }
        ]);
        if (err2) return console.error("Error inserting:", err2);
    } else {
        console.log("They already exist");
    }
    
    console.log("Migration complete!");
}
runMigration();
