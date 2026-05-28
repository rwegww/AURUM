import { supabase } from '../lib/supabase.js';

const mapFeedback = (f) => f && ({
  ...f,
  message: f.noi_dung ?? f.message,
  is_approved: f.da_duyet ?? f.is_approved,
  isApproved: f.da_duyet ?? f.isApproved,
  metadata: f.thong_tin_bo_sung ?? f.metadata,
  userId: f.nguoi_dung_id ?? f.userId,
  createdAt: f.created_at,
  imageUrl: f.image_url,
});

export const Feedback = {
  async create(phan_hoiData) {
    const { data, error } = await supabase
      .from('phan_hoi')
      .insert([{
        nguoi_dung_id: phan_hoiData.userId,
        username: phan_hoiData.username,
        noi_dung: phan_hoiData.message,
        type: phan_hoiData.type || 'suggestion',
        status: phan_hoiData.status || 'unread',
        image_url: phan_hoiData.imageUrl || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return mapFeedback(data);
  },

  async findAll() {
    const { data, error } = await supabase
      .from('phan_hoi')
      .select('*, nguoi_dung(username)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    // Map internal nguoi_dung object to match what populate would provide if needed
    return data.map(f => ({
      ...mapFeedback(f),
      userId: { username: f.nguoi_dung?.username }
    }));
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('phan_hoi')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return mapFeedback(data);
  },

  async countUnread() {
    const { count, error } = await supabase
      .from('phan_hoi')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'unread');
    
    if (error) throw error;
    return count;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('phan_hoi')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapFeedback(data);
  },

  async approve(id) {
    const { data, error } = await supabase
      .from('phan_hoi')
      .update({ da_duyet: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapFeedback(data);
  },

  async getTypeDistribution() {
    const { data, error } = await supabase
      .from('phan_hoi')
      .select('type');
    if (error) throw error;
    
    const distribution = { bug: 0, suggestion: 0, praise: 0 };
    data.forEach(f => {
      if (distribution[f.type] !== undefined) {
        distribution[f.type]++;
      } else {
        distribution[f.type] = 1;
      }
    });
    
    return [
      { name: 'Báo lỗi', value: distribution.bug || 0, color: '#ef4444' },
      { name: 'Góp ý', value: distribution.suggestion || 0, color: '#3b82f6' },
      { name: 'Khen ngợi', value: distribution.praise || 0, color: '#22c55e' }
    ];
  },

  async getApprovedPraises() {
    const { data, error } = await supabase
      .from('phan_hoi')
      .select('username, noi_dung, thong_tin_bo_sung, created_at, nguoi_dung(role)')
      .eq('type', 'praise')
      .eq('da_duyet', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(f => ({
      name: f.username || 'Anonymous',
      role: f.nguoi_dung?.role || 'Học sinh',
      content: f.thong_tin_bo_sung?.content_vi || f.thong_tin_bo_sung?.content_en || f.noi_dung,
      rating: f.thong_tin_bo_sung?.rating || 5
    }));
  }
};

export default Feedback;
