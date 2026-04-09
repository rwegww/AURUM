import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

/**
 * @route GET /api/elements
 * @desc Lấy danh sách toàn bộ 118 nguyên tố hóa học
 */
router.get('/', async (req, res) => {
  try {
    const { data: elements, error } = await supabase
      .from('periodic_elements')
      .select('*')
      .order('atomic_number', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      elements
    });
  } catch (error) {
    console.error('Lỗi tải Bảng tuần hoàn:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route POST /api/elements/seed
 * @desc (Admin Only) Đẩy dữ liệu tĩnh lên Database lần đầu tiên
 */
router.post('/seed', async (req, res) => {
  try {
    const { elementsData } = req.body;
    
    // Yêu cầu token hoặc Middleware kiểm tra Role là Admin ở hệ thống thực tế
    if (!elementsData || elementsData.length === 0) {
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu elementsData' });
    }

    const { data, error } = await supabase
      .from('periodic_elements')
      .upsert(elementsData, { onConflict: 'atomic_number' })
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: `Đã nạp thành công ${data.length} nguyên tố vào CSDL`,
    });
  } catch (error) {
    console.error('Lỗi nạp dữ liệu Bảng tuần hoàn:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
