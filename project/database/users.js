const { getSupabase } = require('./init');

/**
 * User database operations
 */
const userDb = {
  /**
   * Register a new user
   * @param {Number} chatId - Telegram chat ID
   * @param {String} username - Telegram username
   * @returns {Promise<Object>} Result of the operation
   */
  registerUser: async (chatId, username) => {
    const supabase = getSupabase();
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('chat_id', chatId)
      .single();
    
    if (existingUser) {
      return { success: false, message: 'User already registered', user: existingUser };
    }
    
    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          chat_id: chatId,
          username: username || '',
          registered_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Database error', error };
    }
    
    return { success: true, message: 'User registered successfully', user: data[0] };
  },

  /**
   * Check if a user is registered
   * @param {Number} chatId - Telegram chat ID
   * @returns {Promise<Boolean>} True if user exists
   */
  isUserRegistered: async (chatId) => {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('chat_id', chatId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  },

  /**
   * Get all registered users
   * @returns {Promise<Array>} List of all users
   */
  getAllUsers: async () => {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('registered_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return data;
  },

  /**
   * Get total user count
   * @returns {Promise<Number>} Total number of registered users
   */
  getUserCount: async () => {
    const supabase = getSupabase();
    
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error counting users:', error);
      return 0;
    }
    
    return count;
  }
};

module.exports = { userDb };