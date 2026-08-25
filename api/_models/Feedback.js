import { supabase } from '../_lib/supabase.js';

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
        image_url: phan_hoiData.imageUrl || null,
        thong_tin_bo_sung: phan_hoiData.metadata || {},
      }])
      .select()
      .single();
    
    if (error) throw error;
    return mapFeedback(data);
  },

  async findAll({ limit, cursor, kind = 'all' } = {}) {
    let query = supabase
      .from('phan_hoi')
      .select('*, nguoi_dung(username)')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    if (kind === 'teachers') {
      query = query.eq('type', 'teacher_registration');
    } else if (kind === 'feedback') {
      query = query.neq('type', 'teacher_registration');
    }

    if (cursor) {
      query = query.or(
        `created_at.lt.${cursor.sort},and(created_at.eq.${cursor.sort},id.lt.${cursor.id})`
      );
    }
    if (Number.isInteger(limit) && limit > 0) query = query.limit(limit + 1);

    const { data, error } = await query;
    
    if (error) throw error;
    // Map internal nguoi_dung object to match what populate would provide if needed
    return (data || []).map(f => ({
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

  async findPendingTeacherRegistration({ username, email }) {
    const [byUsername, byEmail] = await Promise.all([
      supabase
        .from('phan_hoi')
        .select('id')
        .eq('type', 'teacher_registration')
        .eq('status', 'unread')
        .eq('username', username)
        .limit(1)
        .maybeSingle(),
      supabase
        .from('phan_hoi')
        .select('id')
        .eq('type', 'teacher_registration')
        .eq('status', 'unread')
        .eq('thong_tin_bo_sung->>email', email)
        .limit(1)
        .maybeSingle(),
    ]);

    if (byUsername.error) throw byUsername.error;
    if (byEmail.error) throw byEmail.error;
    return byUsername.data || byEmail.data || null;
  },

  async countUnread() {
    const { count, error } = await supabase
      .from('phan_hoi')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'unread');
    
    if (error) throw error;
    return count;
  },

  async countPendingTeacherRegistrations() {
    const { count, error } = await supabase
      .from('phan_hoi')
      .select('id', { count: 'exact', head: true })
      .eq('type', 'teacher_registration')
      .eq('status', 'unread');

    if (error) throw error;
    return count || 0;
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
    const types = ['bug', 'suggestion', 'praise'];
    const results = await Promise.all(types.map((type) => supabase
      .from('phan_hoi')
      .select('id', { count: 'exact', head: true })
      .eq('type', type)));

    const distribution = {};
    results.forEach((result, index) => {
      if (result.error) throw result.error;
      distribution[types[index]] = result.count || 0;
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
