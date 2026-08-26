import express from 'express';
import { supabase } from '../_lib/supabase.js';
import { auth, authenticateToken, extractBearerToken } from '../_middleware/auth.js';
import User from '../_models/User.js';


const router = express.Router();
const DEFAULT_MATERIAL_PAGE_SIZE = 24;
const DEFAULT_FEEDBACK_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 60;
const MATERIAL_LIST_COLUMNS = [
  'id',
  'tieu_de',
  'mo_ta',
  'danh_muc',
  'file_url',
  'file_type',
  'luot_xem',
  'luot_tai',
  'nguoi_tao_id',
  'created_at',
].join(',');
const MATERIAL_FEEDBACK_COLUMNS = [
  'id',
  'hoc_lieu_id',
  'nguoi_dung_id',
  'noi_dung',
  'danh_gia',
  'noi_dung_tra_loi',
  'nguoi_tra_loi_id',
  'tra_loi_luc',
  'created_at',
].join(',');

const MAX_TEXT_LENGTH = {
  title: 160,
  category: 120,
  description: 1200,
  fileUrl: 2048,
  fileType: 24,
  feedback: 1500,
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

const parsePagination = (query, defaultLimit) => {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? defaultLimit : Number(query.limit);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
    const error = new Error(`page phải từ 1 và limit phải từ 1 đến ${MAX_PAGE_SIZE}.`);
    error.status = 400;
    throw error;
  }

  const from = (page - 1) * limit;
  return { page, limit, from, to: from + limit - 1 };
};

const setPageHeaders = (res, { count, page, limit }) => {
  const total = Number(count) || 0;
  res.set('X-Total-Count', String(total));
  res.set('X-Has-More', page * limit < total ? 'true' : 'false');
};

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
    const { category, categoryContains, search } = req.query;
    const pagination = parsePagination(req.query, DEFAULT_MATERIAL_PAGE_SIZE);
    const normalizedCategory = normalizeText(category);
    const normalizedCategoryContains = normalizeText(categoryContains);
    const normalizedSearch = normalizeText(search);

    if (normalizedCategory.length > MAX_TEXT_LENGTH.category || normalizedCategoryContains.length > MAX_TEXT_LENGTH.category) {
      return res.status(400).json({ message: 'Danh mục tìm kiếm không hợp lệ.' });
    }
    if (normalizedSearch.length > MAX_TEXT_LENGTH.title) {
      return res.status(400).json({ message: `Từ khóa tìm kiếm tối đa ${MAX_TEXT_LENGTH.title} ký tự.` });
    }

    let query = supabase
      .from('hoc_lieu')
      .select(MATERIAL_LIST_COLUMNS, { count: 'exact' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    if (normalizedCategory) {
      query = query.eq('danh_muc', normalizedCategory);
    }
    if (normalizedCategoryContains) {
      query = query.ilike('danh_muc', `%${normalizedCategoryContains}%`);
    }
    if (normalizedSearch) {
      query = query.ilike('tieu_de', `%${normalizedSearch}%`);
    }

    const { data, error, count } = await query.range(pagination.from, pagination.to);
    if (error) throw error;

    setPageHeaders(res, { count, page: pagination.page, limit: pagination.limit });
    res.json((data || []).map(normalizeMaterial));
  } catch (err) {
    res.status(err.status || 500).json({ message: err.status ? err.message : 'Lỗi tải danh sách tài liệu', error: err.message });
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

// Delete a material owned by the current teacher. Admins may remove any material.
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ giáo viên hoặc quản trị viên mới được xóa học liệu.' });
    }

    let query = supabase
      .from('hoc_lieu')
      .delete()
      .eq('id', req.params.id);

    if (req.user.role === 'teacher') {
      query = query.eq('nguoi_tao_id', req.user.id);
    }

    const { data, error } = await query.select('id').maybeSingle();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Không tìm thấy học liệu hoặc bạn không có quyền xóa.' });
    }

    return res.json({ message: 'Đã xóa học liệu.', id: data.id });
  } catch (err) {
    return res.status(500).json({ message: 'Không thể xóa học liệu lúc này.', error: err.message });
  }
});

// 3. Get Single Material & Increment View Count
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { increment } = req.query;

    // Fetch material
    const { data, error } = await supabase
      .from('hoc_lieu')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu này.' });
    }

    // Increment atomically and return the current count so the UI is not stale.
    if (increment !== 'false') {
      const { data: nextViewCount, error: viewError } = await supabase
        .rpc('increment_material_view', { material_id: id });
      if (viewError) {
        console.warn('Không thể cập nhật lượt xem học liệu:', viewError.message);
      } else if (Number.isFinite(Number(nextViewCount))) {
        data.luot_xem = Number(nextViewCount);
      }
    }

    // Try optional authentication to track crafting quest progress
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        extractBearerToken(req);
        const { user } = await authenticateToken(token);
        await User.incrementCraftingTaskProgress(user.id, 'interact_library', id);
      } catch (authErr) {
        console.warn('⚠️ [Materials] Optional auth tracking failed:', authErr.message);
      }
    }

    res.json(normalizeMaterial(data));
  } catch (err) {
    res.status(500).json({ message: 'Không thể tải chi tiết tài liệu.', error: err.message });
  }
});

// 4. Track Material Download Count
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: nextCount, error } = await supabase
      .rpc('increment_material_download', { material_id: id });

    if (error) throw error;
    if (nextCount === null || nextCount === undefined) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu này.' });
    }
    res.json({ download_count: Number(nextCount) });
  } catch (err) {
    res.status(500).json({ message: 'Không thể cập nhật lượt tải tài liệu.', error: err.message });
  }
});

// 5. Post Feedback for a Material
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const { id: hoc_lieu_id } = req.params;
    const { content, rating } = req.body;
    const trimmedContent = normalizeText(content);

    const normalizedRating = Number(rating);
    if (!trimmedContent || !Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return res.status(400).json({ message: 'Vui lòng nhập nội dung phản hồi và chọn đánh giá từ 1 đến 5 sao.' });
    }

    if (trimmedContent.length > MAX_TEXT_LENGTH.feedback) {
      return res.status(400).json({ message: `Phản hồi tối đa ${MAX_TEXT_LENGTH.feedback} ký tự.` });
    }

    const { data: material, error: materialError } = await supabase
      .from('hoc_lieu')
      .select('id')
      .eq('id', hoc_lieu_id)
      .single();

    if (materialError && materialError.code !== 'PGRST116') throw materialError;
    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu này.' });
    }

    const { data, error } = await supabase
      .from('phan_hoi_hoc_lieu')
      .insert([{
        hoc_lieu_id,
        nguoi_dung_id: req.user.id,
        noi_dung: trimmedContent,
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
    const pagination = parsePagination(req.query, DEFAULT_FEEDBACK_PAGE_SIZE);
    
    // 1. Fetch phan_hois first
    let { data: phan_hois, error, count } = await supabase
      .from('phan_hoi_hoc_lieu')
      .select(MATERIAL_FEEDBACK_COLUMNS, { count: 'exact' })
      .eq('hoc_lieu_id', hoc_lieu_id)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(pagination.from, pagination.to);

    if (error) throw error;
    setPageHeaders(res, { count, page: pagination.page, limit: pagination.limit });
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
    res.status(err.status || 500).json({ message: err.status ? err.message : 'Không thể tải phản hồi lúc này.', error: err.message });
  }
});

// 7. Reply to a Feedback
router.post('/:id/feedback/:feedbackId/reply', auth, async (req, res) => {
  try {
    const { id: materialId, feedbackId } = req.params;
    const { reply_content } = req.body;
    const trimmedReply = normalizeText(reply_content);

    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Chỉ admin hoặc giáo viên mới có quyền trả lời.' });
    }

    if (!trimmedReply) {
      return res.status(400).json({ message: 'Vui lòng nhập nội dung trả lời.' });
    }

    if (trimmedReply.length > MAX_TEXT_LENGTH.feedback) {
      return res.status(400).json({ message: `Câu trả lời tối đa ${MAX_TEXT_LENGTH.feedback} ký tự.` });
    }

    const { data, error } = await supabase
      .from('phan_hoi_hoc_lieu')
      .update({
        noi_dung_tra_loi: trimmedReply,
        nguoi_tra_loi_id: req.user.id,
        tra_loi_luc: new Date().toISOString()
      })
      .eq('id', feedbackId)
      .eq('hoc_lieu_id', materialId)
      .select();

    if (error) throw error;
    if (!data?.[0]) return res.status(404).json({ message: 'Không tìm thấy phản hồi này.' });
    res.json(normalizeMaterialFeedback(data[0]));
  } catch (err) {
    res.status(500).json({ message: 'Không thể gửi câu trả lời lúc này.', error: err.message });
  }
});

export default router;
