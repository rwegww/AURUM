const HISTORY_KEY = 'aurum_user_activity_history';
const MAX_HISTORY_ITEMS = 50;

const getSupabase = async () => {
  const { supabase } = await import('@/lib/supabase');
  return supabase;
};

class ActivityService {
  /**
   * Log a new activity
   * @param {Object} activity - { type, label, description, link, icon }
   */
  async log(activity) {
    try {
      const newActivity = {
        ...activity,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };

      // 1. Save to LocalStorage (Immediate feedback/offline)
      const localHistory = this.getLocalHistory();
      const updatedLocal = [newActivity, ...localHistory].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedLocal));

      // 2. Save to Database (if logged in)
      const token = localStorage.getItem('token');
      const authType = localStorage.getItem('authType');
      
      if (token && authType === 'custom') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/user/activities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action_type: activity.type,
            description: activity.description,
            metadata: {
              label: activity.label,
              icon: activity.icon,
              link: activity.link
            }
          })
        });
        if (!res.ok) {
           console.warn('DB Log Error: Failed to save activity to backend');
        }
      } else if (authType === 'supabase') {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { error } = await supabase.from('user_activities').insert([{
            user_id: session.user.id,
            action_type: activity.type,
            description: activity.description,
            metadata: {
              label: activity.label,
              icon: activity.icon,
              link: activity.link
            }
          }]);
          if (error && error.code !== '42501') console.warn('DB Log Error:', error.message);
        }
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
      const token = localStorage.getItem('token');
      const authType = localStorage.getItem('authType');

      if (token && authType === 'custom') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/user/activities`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          return data.map(item => ({
            id: item.id,
            timestamp: item.created_at,
            type: item.action_type || item.type,
            label: item.metadata?.label || item.label || '',
            description: item.description,
            icon: item.metadata?.icon || item.icon || '',
            link: item.metadata?.link || item.link || ''
          }));
        }
      } else if (authType === 'supabase') {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('user_activities')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(MAX_HISTORY_ITEMS);

          if (!error && data) {
            return data.map(item => ({
              id: item.id,
              timestamp: item.created_at,
              type: item.action_type || item.type,
              label: item.metadata?.label || item.label || '',
              description: item.description,
              icon: item.metadata?.icon || item.icon || '',
              link: item.metadata?.link || item.link || ''
            }));
          }
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
      localStorage.removeItem(HISTORY_KEY);

      const token = localStorage.getItem('token');
      const authType = localStorage.getItem('authType');

      if (token && authType === 'custom') {
        await fetch(`${import.meta.env.VITE_API_URL || '/api'}/user/activities`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else if (authType === 'supabase') {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await supabase.from('user_activities').delete().eq('user_id', session.user.id);
        }
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
