
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const SUPABASE_URL = 'https://okcluqebpngzmusjgjut.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rY2x1cWVicG5nem11c2pnanV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyMTk4ODQsImV4cCI6MjA0NTc5NTg4NH0.BeiwE38BvJS-hlam5cVx_REpdDmch_FGuUBrI7yznGk';  // Zde použij svůj anon klíč

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('demo').select('*');
        if (error) throw error;

        console.log("Připojení k Supabase úspěšné:", data);
    } catch (err) {
        console.error("Chyba při připojení k Supabase:", err.message);
    }
};


const loginUser = async (username, password) => {
    try {
        const { data, error } = await supabase
            .from('User')
            .select('id, username, email, password_hash')
            .eq('username', username)
            .single();

        if (error || !data) {
            throw new Error('Špatný username nebo heslo');
        }

        const isPasswordValid = await bcrypt.compare(password, data.password_hash);

        if (!isPasswordValid) {
            throw new Error('Špatný username nebo heslo');
        }

        console.log("Uživatel úspěšně přihlášen:", data);
        return { id: data.id, username: data.username, email: data.email };
    } catch (err) {
        console.error("Chyba při přihlášení:", err.message);
        return { error: err.message };
    }
};



testConnection();

module.exports = { supabase, loginUser };
