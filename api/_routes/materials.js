import express from 'express';
import { supabase } from '../lib/supabase.js';
import { auth } from '../_middleware/auth.js';

const router = express.Router();

const MAX_TEXT_LENGTH = {
  title: 160,
  category: 120,
  description: 1200,
  fileUrl: 2048,
  fileType: 24,
};

const ALLOWED_FILE_TYPES = new Set([
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'mp4',
  'mov',
  'zip',
]);

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeMaterial = (material) => {
  if (!material) return material;
  return {
    ...material,
    title: material.tieu_de ?? material.title,
    description: material.mo_ta ?? material.description,
    category: material.danh_muc ?? material.category,
    view_count: material.luot_xem ?? material.view_count ?? 0,
    download_count: material.luot_tai ?? material.download_count ?? 0,
    created_by_user_id: material.nguoi_tao_id ?? material.created_by_user_id ?? null,
    tieu_de: undefined,
    mo_ta: undefined,
    danh_muc: undefined,
    luot_xem: undefined,
    luot_tai: undefined,
    nguoi_tao_id: undefined,
  };
};

const normalizeMaterialFeedback = (feedback) => {
  if (!feedback) return feedback;
  return {
    ...feedback,
    content: feedback.noi_dung ?? feedback.content,
    rating: feedback.danh_gia ?? feedback.rating,
    reply_content: feedback.noi_dung_tra_loi ?? feedback.reply_content,
    reply_created_at: feedback.tra_loi_luc ?? feedback.reply_created_at,
    user_id: feedback.nguoi_dung_id ?? feedback.user_id,
    reply_user_id: feedback.nguoi_tra_loi_id ?? feedback.reply_user_id,
    users: feedback.nguoi_dung ?? feedback.users,
    noi_dung: undefined,
    danh_gia: undefined,
    noi_dung_tra_loi: undefined,
    tra_loi_luc: undefined,
    nguoi_dung_id: undefined,
    nguoi_tra_loi_id: undefined,
    nguoi_dung: undefined,
  };
};

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const normalizeFileType = (value) => normalizeText(value).replace(/^\./, '').toLowerCase();

const validateMaterialPayload = (body) => {
  const title = normalizeText(body.title);
  const category = normalizeText(body.category);
  const description = normalizeText(body.description);
  const fileUrl = normalizeText(body.file_url || body.fileUrl);
  const fileType = normalizeFileType(body.file_type || body.fileType);
  const errors = {};

  if (!title) errors.title = 'Tiêu đề là bắt buộc';
  else if (title.length > MAX_TEXT_LENGTH.title) errors.title = `Tiêu đề tối đa ${MAX_TEXT_LENGTH.title} ký tự`;

  if (!category) errors.category = 'Danh mục là bắt buộc';
  else if (category.length > MAX_TEXT_LENGTH.category) errors.category = `Danh mục tối đa ${MAX_TEXT_LENGTH.category} ký tự`;

  if (description.length > MAX_TEXT_LENGTH.description) {
    errors.description = `Mô tả tối đa ${MAX_TEXT_LENGTH.description} ký tự`;
  }

  if (!fileUrl) errors.file_url = 'Tệp học liệu là bắt buộc';
  else if (fileUrl.length > MAX_TEXT_LENGTH.fileUrl || !isValidHttpUrl(fileUrl)) {
    errors.file_url = 'Đường dẫn tệp không hợp lệ';
  }

  if (!fileType) errors.file_type = 'Định dạng tệp là bắt buộc';
  else if (fileType.length > MAX_TEXT_LENGTH.fileType || !ALLOWED_FILE_TYPES.has(fileType)) {
    errors.file_type = 'Định dạng tệp không được hỗ trợ';
  }

    return {
    values: {
      tieu_de: title,
      danh_muc: category,
      mo_ta: description || null,
      file_url: fileUrl,
      file_type: fileType,
    },
    errors,
  };
};

// 1. Get List of Materials with Filters
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase
      .from('hoc_lieu')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('danh_muc', category);
    }
    if (search) {
      query = query.ilike('tieu_de', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json((data || []).map(normalizeMaterial));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải danh sách tài liệu', error: err.message });
  }
});

// 2. Teacher uploads a new material into the public library
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Chỉ giáo viên mới được upload học liệu vào thư viện' });
    }

    const { values, errors } = validateMaterialPayload(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Dữ liệu học liệu không hợp lệ', errors });
    }

    const { data, error } = await supabase
      .from('hoc_lieu')
      .insert([{ ...values, nguoi_tao_id: req.user.id }])
      .select('*')
      .single();

    if (error) throw error;
    return res.status(201).json(normalizeMaterial(data));
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi lưu học liệu vào thư viện', error: err.message });
  }
});

// 3. Get Single Material & Increment View Count
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch material
    const { data, error } = await supabase
      .from('hoc_lieu')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Increment view count (fire and forget)
    supabase.rpc('increment_material_view', { material_id: id }).then();

    res.json(normalizeMaterial(data));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải chi tiết tài liệu', error: err.message });
  }
});

// 4. Track Material Download Count
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: material, error: fetchError } = await supabase
      .from('hoc_lieu')
      .select('luot_tai')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const nextCount = Number(material?.luot_tai || 0) + 1;
    const { data, error } = await supabase
      .from('hoc_lieu')
      .update({ luot_tai: nextCount })
      .eq('id', id)
      .select('luot_tai')
      .single();

    if (error) throw error;
    res.json({ download_count: data.luot_tai });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật lượt tải tài liệu', error: err.message });
  }
});

// 5. Post Feedback for a Material
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const { id: hoc_lieu_id } = req.params;
    const { content, rating } = req.body;

    const normalizedRating = Number(rating);
    if (!content || !Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return res.status(400).json({ message: 'Thiếu nội dung hoặc đánh giá' });
    }

    const { data, error } = await supabase
      .from('phan_hoi_hoc_lieu')
      .insert([{
        hoc_lieu_id,
        nguoi_dung_id: req.user.id,
        noi_dung: content,
        danh_gia: normalizedRating
      }])
      .select();

    if (error) throw error;
    res.status(201).json(normalizeMaterialFeedback(data[0]));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi phản hồi', error: err.message });
  }
});

// 6. Get Feedback for a Material
router.get('/:id/feedback', async (req, res) => {
  try {
    const { id: hoc_lieu_id } = req.params;
    
    // 1. Fetch phan_hois first
    let { data: phan_hois, error } = await supabase
      .from('phan_hoi_hoc_lieu')
      .select('*')
      .eq('hoc_lieu_id', hoc_lieu_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!phan_hois || phan_hois.length === 0) return res.json([]);

    // 2. Get unique user IDs
    const userIds = [...new Set(phan_hois.map(f => f.nguoi_dung_id))].filter(Boolean);
    const replyUserIds = [...new Set(phan_hois.map(f => f.nguoi_tra_loi_id))].filter(Boolean);
    const allUserIds = [...new Set([...userIds, ...replyUserIds])];

    if (allUserIds.length > 0) {
      // 3. Fetch usernames for these IDs
      const { data: nguoi_dung, error: userError } = await supabase
        .from('nguoi_dung')
        .select('id, username')
        .in('id', allUserIds);

      if (!userError && nguoi_dung) {
        const userMap = nguoi_dung.reduce((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});

        // 4. Manually join the data
        phan_hois = phan_hois.map(f => ({
          ...f,
          nguoi_dung: userMap[f.nguoi_dung_id] || null,
          reply_user: f.nguoi_tra_loi_id ? (userMap[f.nguoi_tra_loi_id] || null) : null
        }));
      }
    }
    
    return res.json(phan_hois.map(normalizeMaterialFeedback));
  } catch (err) {
    console.error('Lỗi tải phản hồi:', err);
    res.status(500).json({ message: 'Lỗi tải phản hồi', error: err.message });
  }
});

// 7. Reply to a Feedback
router.post('/:id/feedback/:feedbackId/reply', auth, async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { reply_content } = req.body;

    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Chỉ admin hoặc giáo viên mới có quyền trả lời.' });
    }

    if (!reply_content) {
      return res.status(400).json({ message: 'Thiếu nội dung trả lời.' });
    }

    const { data, error } = await supabase
      .from('phan_hoi_hoc_lieu')
      .update({
        noi_dung_tra_loi: reply_content,
        nguoi_tra_loi_id: req.user.id,
        tra_loi_luc: new Date().toISOString()
      })
      .eq('id', feedbackId)
      .select();

    if (error) throw error;
    res.json(normalizeMaterialFeedback(data[0]));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi phản hồi', error: err.message });
  }
});

export default router;

