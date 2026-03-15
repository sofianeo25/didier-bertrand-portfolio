---
name: manage-gallery
description: Permet au client d'ajouter de nouvelles photos à ses galeries de manière 100% autonome.
---

# Compétence : Gestion Automatisée de Galerie (manage-gallery)

Cette compétence permet à l'agent Antigravity d'ajouter de nouvelles photos au portfolio du photographe Didier Bertrand (catégories, sous-dossiers, upload et mise à jour de la base de données).

## Contexte
Le projet utilise Vercel pour le frontend et Supabase pour la base de données (`series`) et le stockage (`portfolio_images`). L'agent ne peut pas cliquer sur l'interface d'administration, il doit donc utiliser un script Node.js dédié situé dans `admin/api/manage_gallery.js`.

## Prérequis (TRÈS IMPORTANT)
Pour fonctionner, le script Node.js a besoin de la clé d'API secrète de Supabase (`SUPABASE_SERVICE_ROLE_KEY`).
1. Vérifiez si le fichier `admin/api/.env` existe et s'il contient `SUPABASE_SERVICE_ROLE_KEY`.
2. Si le fichier n'existe pas ou que la clé est manquante, **VOUS DEVEZ IMPÉRATIVEMENT DEMANDER AU CLIENT** de vous fournir sa clé `service_role` Supabase. Expliquez-lui qu'elle est nécessaire pour contourner la sécurité RLS.
3. Une fois fournie, créez ou mettez à jour le fichier `admin/api/.env` avec cette clé (utilisez `admin/api/.env.example` comme modèle).

## Instructions d'Exécution
Lorsque l'utilisateur vous demande d'ajouter une image (ex: *"Ajoute mon image paysage.jpg dans Voyage/Baikal"*), suivez EXACTEMENT ces étapes :

1. **Localisation du Fichier** : Trouvez le chemin absolu de l'image (système de fichiers local) fournie par l'utilisateur. S'il l'a juste uploadée dans le chat, cherchez-la dans le dossier de téléchargement d'Antigravity ou `/tmp`.
2. **Identification de la Cible** : Identifiez la Catégorie (ex: `Voyage`) et le Sous-dossier/Série (ex: `Baikal`) demandés par l'utilisateur. La casse est importante pour la catégorie.
3. **Exécution du Script** : Exécutez la commande suivante à l'aide de l'outil `run_command` :
   ```bash
   cd "admin/api"
   npm install dotenv @supabase/supabase-js
   node manage_gallery.js "/chemin/absolu/vers/image.jpg" "Categorie/Sous-Dossier"
   ```
   **Exemple concret :**
   ```bash
   node manage_gallery.js "/Users/didier/Desktop/foret_enneigee.jpg" "Voyage/Baikal"
   ```
4. **Validation** : Le script s'occupe de tout (création du dossier si inexistant, upload sur le storage, mise à jour de l'image de couverture, incrémentation du compteur). 
5. **Vérifiez la sortie (output)** de la commande pour vous assurer qu'il n'y a pas d'erreur.
6. **Confirmation** : Informez l'utilisateur que l'image a été ajoutée avec succès et qu'elle est visible sur son site en ligne !
