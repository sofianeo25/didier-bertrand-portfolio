require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgbtecyaubttcxtxtciy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runMigration() {
    console.log("Checking if exhibitions table exists...");
    
    // Using rpc to run raw SQL is not directly supported via supabase-js without an RPC function
    // So we will try to select from it to see if it exists
    const { error: checkError } = await db.from('exhibitions').select('count', { count: 'exact', head: true });
    
    if (checkError && checkError.code === 'PGRST116' || checkError && checkError.message.includes('relation "exhibitions" does not exist')) {
        console.log("Table 'exhibitions' does not exist. Please run the SQL in your Supabase SQL Editor:");
        console.log(`
        CREATE TABLE exhibitions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            year INTEGER NOT NULL,
            title TEXT NOT NULL,
            venue TEXT NOT NULL,
            location TEXT,
            poster_url TEXT,
            category TEXT,
            order_index INTEGER DEFAULT 0
        );
        ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow public read access on exhibitions" ON exhibitions FOR SELECT USING (true);
        CREATE POLICY "Allow full access for authenticated users on exhibitions" ON exhibitions FOR ALL USING (auth.role() = 'authenticated');
        `);
        return;
    }

    console.log("Table exists or was already created.");

    // Insert dummy data if empty
    const { data: countData } = await db.from('exhibitions').select('id', { count: 'exact', head: true });
    if (countData && countData.length === 0) {
        console.log("Inserting initial exhibitions data...");
        const demoData = [
            { year: 2026, title: 'Norvège — Les Lofotens', venue: 'Club Photo · La Focale', location: 'Soultz, Alsace', category: 'la-focale' },
            { year: 2026, title: 'La Danse', venue: 'Maison Jaune Riedisheim · Collectif', location: 'Riedisheim', category: 'autres' },
            { year: 2025, title: 'Sahara', venue: 'Club Photo · La Focale', location: 'Soultz, Alsace', category: 'la-focale' },
            { year: 2025, title: 'Sahara', venue: 'Exposition Fotohusli', location: 'Heimsbrunn', category: 'fotohusli' },
            { year: 2025, title: 'Sahara', venue: 'Festival Photo en Val d\'Argent', location: 'Sainte-Marie-aux-Mines', category: 'val-argent' },
        ];
        const { error: insertError } = await db.from('exhibitions').insert(demoData);
        if (insertError) console.error("Error inserting demo data:", insertError);
        else console.log("Demo data inserted successfully!");
    } else {
        console.log("Data already exists in exhibitions table.");
    }
}

runMigration();
