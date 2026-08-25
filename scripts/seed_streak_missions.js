import { supabase } from '../api/_lib/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function addStreakMissions() {
  const nhiem_vu = [
    { tieu_de: 'Thắp lửa hôm nay', mo_ta: 'Online đủ 10 phút hoặc hoàn thành 1 bài học để thắp chuỗi.', loai_hanh_dong: 'streak_light', so_luong_muc_tieu: 1, thuong_xp: 50, type: 'daily', bieu_tuong: '🔥' },
    { tieu_de: 'Giữ lửa (3 ngày)', mo_ta: 'Duy trì chuỗi học tập trong 3 ngày liên tiếp.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 3, thuong_xp: 300, type: 'achievement', bieu_tuong: '🕯️' },
    { tieu_de: 'Kiên trì (7 ngày)', mo_ta: 'Duy trì chuỗi học tập trong 7 ngày liên tiếp.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 7, thuong_xp: 700, type: 'achievement', bieu_tuong: '🔥' },
    { tieu_de: 'Bền bỉ (14 ngày)', mo_ta: 'Duy trì chuỗi học tập trong 14 ngày liên tiếp.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 14, thuong_xp: 1500, type: 'achievement', bieu_tuong: '☄️' },
    { tieu_de: 'Đam mê (30 ngày)', mo_ta: 'Duy trì chuỗi học tập trong 30 ngày liên tiếp.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 30, thuong_xp: 4000, type: 'achievement', bieu_tuong: '☀️' },
    { tieu_de: 'Bất diệt (90 ngày)', mo_ta: 'Duy trì chuỗi học tập trong 90 ngày liên tiếp.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 90, thuong_xp: 12000, type: 'achievement', bieu_tuong: '👑' }
  ];

  for (const m of nhiem_vu) {
    const { data: existing } = await supabase.from('nhiem_vu').select('id').eq('tieu_de', m.tieu_de).maybeSingle();
    if (existing) {
      console.log(`Mission already exists: ${m.tieu_de}`);
      continue;
    }
    
    const { error } = await supabase.from('nhiem_vu').insert(m);
    if (error) console.error(`Error adding mission ${m.tieu_de}:`, error);
    else console.log(`Mission added: ${m.tieu_de}`);
  }
}

addStreakMissions();


