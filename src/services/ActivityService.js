import { supabase } from '@/lib/supabase';

const HISTORY_KEY = 'aurum_user_activity_history';
const MAX_HISTORY_ITEMS = 50;

class ActivityService {
  /**
   * Log a new activity
   * @param {Object} activity - { type, label, description, link, icon }
   */
  async log(activity) {
    try {
      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const newActivity = {
        ...activity,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };

      // 2. Save to LocalStorage (Immediate feedback/offline)
      const localHistory = this.getLocalHistory();
      const updatedLocal = [newActivity, ...localHistory].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedLocal));

      // 3. Save to Database (if logged in)
      if (userId) {
        const { error } = await supabase
          .from('user_activities')
          .insert([{
            user_id: userId,
            type: activity.type,
            label: activity.label,
            description: activity.description,
            icon: activity.icon,
            link: activity.link
          }]);
        
        if (error) console.warn('DB Log Error:', error.message);
      }
      
      // Dispatch custom event for UI reactivity
      window.dispatchEvent(new CustomEvent('aurum_activity_logged', { detail: newActivity }));
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  /**
   * Get activity history (prefers DB, falls back to Local)
   */
  async getHistory() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(MAX_HISTORY_ITEMS);

        if (!error && data) {
          // Transform DB format to app format
          return data.map(item => ({
            id: item.id,
            timestamp: item.created_at,
            type: item.type,
            label: item.label,
            description: item.description,
            icon: item.icon,
            link: item.link
          }));
        }
      }
      
      return this.getLocalHistory();
    } catch (error) {
      console.error('Failed to get activity history:', error);
      return this.getLocalHistory();
    }
  }

  getLocalHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Clear history
   */
  async clear() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      localStorage.removeItem(HISTORY_KEY);

      if (userId) {
        await supabase
          .from('user_activities')
          .delete()
          .eq('user_id', userId);
      }

      window.dispatchEvent(new CustomEvent('aurum_activity_cleared'));
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  /**
   * Helper to format time ago
   */
  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  }
}

export const activityService = new ActivityService();
export default activityService;
