// On importe la fonction pour créer un client Supabase
const { createClient } = require('@supabase/supabase-js');

// On récupère l'URL et la clé depuis le fichier .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// On crée la connexion à Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// On exporte la connexion pour l'utiliser dans d'autres fichiers
module.exports = supabase;
