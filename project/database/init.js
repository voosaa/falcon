const { createClient } = require('@supabase/supabase-js');
let supabase = null;

/**
 * Initialize the Supabase client
 * @returns {Object} Supabase client instance
 */
function initializeDatabase() {
  if (!supabase) {
    // Create Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Key not found in environment variables');
      throw new Error('Supabase configuration missing');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');
  }
  
  return supabase;
}

/**
 * Get the Supabase client instance
 * @returns {Object} Supabase client instance
 */
function getSupabase() {
  if (!supabase) {
    return initializeDatabase();
  }
  return supabase;
}

module.exports = {
  initializeDatabase,
  getSupabase
};