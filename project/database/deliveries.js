const { getSupabase } = require('./init');

/**
 * Delivery database operations
 */
const deliveryDb = {
  /**
   * Record a token link delivery
   * @param {String} userId - User ID
   * @param {String} tokenLink - Token buy link
   * @returns {Promise<Object>} Result of the operation
   */
  recordDelivery: async (userId, tokenLink) => {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('deliveries')
      .insert([
        {
          user_id: userId,
          token_link: tokenLink,
          sent_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Error recording delivery:', error);
      return { success: false, error };
    }
    
    return { success: true, delivery: data[0] };
  },

  /**
   * Get delivery count
   * @returns {Promise<Number>} Number of deliveries made
   */
  getDeliveryCount: async () => {
    const supabase = getSupabase();
    
    const { count, error } = await supabase
      .from('deliveries')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error counting deliveries:', error);
      return 0;
    }
    
    return count;
  },

  /**
   * Check if distribution is in progress
   * This is determined by checking if there were any deliveries in the last hour
   * @returns {Promise<Boolean>} True if distribution is in progress
   */
  isDistributionInProgress: async () => {
    const supabase = getSupabase();
    
    // Get timestamp for 1 hour ago
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { count, error } = await supabase
      .from('deliveries')
      .select('*', { count: 'exact', head: true })
      .gte('sent_at', oneHourAgo.toISOString());
    
    if (error) {
      console.error('Error checking distribution status:', error);
      return false;
    }
    
    return count > 0;
  }
};

module.exports = { deliveryDb };