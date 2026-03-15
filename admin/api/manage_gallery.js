require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgbtecyaubttcxtxtciy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("ERREUR: SUPABASE_SERVICE_ROLE_KEY manquant dans le fichier .env");
    process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function manageGallery() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("Usage: node manage_gallery.js <chemin_image> <categorie>/<sous-dossier>");
        console.log("Exemple: node manage_gallery.js ./forest.jpg Voyage/Baikal");
        process.exit(1);
    }

    const imagePath = args[0];
    const targetPath = args[1]; // e.g., "Voyage/Baikal"

    if (!fs.existsSync(imagePath)) {
        console.error(`Erreur: L'image ${imagePath} est introuvable.`);
        process.exit(1);
    }

    const [category, seriesName] = targetPath.split('/');
    if (!category || !seriesName) {
         console.error("Erreur: Le chemin cible doit être au format 'Categorie/Sous-dossier' (ex: Voyage/Baikal).");
         process.exit(1);
    }

    const slug = seriesName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');

    console.log(`[1/4] Vérification de la série "${seriesName}" dans la catégorie "${category}"...`);
    let { data: seriesList, error: fetchErr } = await db.from('series').select('*').eq('slug', slug);
    
    let seriesId;
    let currentCount = 0;

    if (fetchErr) {
        console.error("Erreur de récupération de la série:", fetchErr);
        process.exit(1);
    }

    if (!seriesList || seriesList.length === 0) {
        console.log(` -> La série n'existe pas. Création de "${seriesName}"...`);
        const { data: newSeries, error: insertErr } = await db.from('series').insert([{
            title: seriesName,
            slug: slug,
            cat: category,
            cover: '',
            desc: `Nouvelle collection ajoutée: ${seriesName}`,
            images_count: 0
        }]).select();

        if (insertErr) {
            console.error("Erreur de création de la série:", insertErr);
            process.exit(1);
        }
        seriesId = newSeries[0].id;
    } else {
        console.log(" -> La série existe déjà.");
        seriesId = seriesList[0].id;
        currentCount = seriesList[0].images_count || 0;
    }

    console.log(`[2/4] Upload de l'image vers Supabase Storage...`);
    const fileContent = fs.readFileSync(imagePath);
    const fileName = `${Date.now()}_${path.basename(imagePath)}`;
    const storagePath = `${slug}/${fileName}`;
    
    // Guess MIME type roughly
    const ext = path.extname(imagePath).toLowerCase();
    let mime = 'image/jpeg';
    if (ext === '.png') mime = 'image/png';
    else if (ext === '.webp') mime = 'image/webp';
    else if (ext === '.gif') mime = 'image/gif';

    const { data: uploadData, error: uploadErr } = await db.storage
        .from('portfolio_images')
        .upload(storagePath, fileContent, {
            contentType: mime,
            upsert: false
        });

    if (uploadErr) {
        console.error("Erreur d'upload Storage:", uploadErr);
        process.exit(1);
    }

    console.log(`[3/4] Récupération de l'URL publique de l'image...`);
    const { data: publicUrlData } = db.storage.from('portfolio_images').getPublicUrl(storagePath);
    const publicUrl = publicUrlData.publicUrl;

    console.log(`[4/4] Mise à jour des informations de la base de données...`);
    // update cover to new image, increment count
    const { error: updateErr } = await db.from('series').update({
        cover: publicUrl,
        images_count: currentCount + 1
    }).eq('id', seriesId);

    if (updateErr) {
        console.error("Erreur de mise à jour BD:", updateErr);
        process.exit(1);
    }

    console.log("\n==============================================");
    console.log("SUCCÈS: Image ajoutée avec succès au portfolio!");
    console.log("Catégorie :", category);
    console.log("Collection:", seriesName);
    console.log("Nouvelle Couverture :", publicUrl);
    console.log("==============================================\n");
}

manageGallery();
