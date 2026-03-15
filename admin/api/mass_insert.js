require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgbtecyaubttcxtxtciy.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const structure = {
    "Voyage": [
        "Sahara",
        "Lac Baikal",
        "Lofotens",
        "Dubai",
        "Grandes Marées",
        "Normandie",
        "Bretagne",
        "Ville de Nuit",
        "Alsace Vosges",
        "Kenya",
        "Camargue",
        "Lavande de Provence"
    ],
    "Archi Fine Art": [
        "Rotterdam",
        "Basel",
        "La Defense",
        "Luxembourg",
        "Francfort",
        "Voeklingen",
        "Autres"
    ],
    "Portrait": [
        "Maternité",
        "Mode",
        "Prohibition",
        "Western"
    ],
    "Danse": [
        "Pole Dance",
        "Fee de la Doller",
        "Burrus",
        "Cave",
        "Ombres"
    ],
    "Creative": [
        "Culinaire",
        "Light Painting",
        "Collisions Gouttes",
        "Fleurs"
    ]
};

async function createHierarchy() {
    console.log("Démarrage de l'insertion en masse de la hiérarchie...");
    
    // Get existing titles to avoid inserting duplicates if rerun
    const { data: existingSeries } = await db.from('series').select('title');
    const existingTitles = existingSeries ? existingSeries.map(s => s.title.toLowerCase()) : [];

    const toInsert = [];

    for (const [category, seriesList] of Object.entries(structure)) {
        for (const seriesName of seriesList) {
            if (!existingTitles.includes(seriesName.toLowerCase()) && seriesName.toLowerCase() !== "baikal" && seriesName.toLowerCase() !== "norvège lofoten") {
                const slug = seriesName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                
                toInsert.push({
                    title: seriesName,
                    slug: slug,
                    cat: category,
                    cover: '', // empty to fallback to solid dark later in UI
                    desc: `Collection photographique : ${seriesName} (${category})`,
                    images_count: 0
                });
            }
        }
    }

    if (toInsert.length > 0) {
        console.log(`Insertion de ${toInsert.length} nouvelles séries...`);
        const { error } = await db.from('series').insert(toInsert);
        if (error) {
            console.error("Erreur lors de l'insertion :", error);
        } else {
            console.log("Succès : Toutes les séries ont été créées avec succès !");
        }
    } else {
        console.log("Toutes les séries existent déjà. Aucune action requise.");
    }
}

createHierarchy();
