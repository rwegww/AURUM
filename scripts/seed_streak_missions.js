import { supabase } from '../api/lib/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function addStreakMissions() {
  const nhiem_vu = [
    { tieu_de: 'Tháº¯p lá»­a hÃ´m nay', mo_ta: 'Online Ä‘á»§ 10 phÃºt hoáº·c hoÃ n thÃ nh 1 bÃ i há»c Ä‘á»ƒ tháº¯p chuá»—i.', loai_hanh_dong: 'streak_light', so_luong_muc_tieu: 1, thuong_xp: 50, type: 'daily', bieu_tuong: 'ðŸ”¥' },
    { tieu_de: 'Giá»¯ lá»­a (3 ngÃ y)', mo_ta: 'Duy trÃ¬ chuá»—i há»c táº­p trong 3 ngÃ y liÃªn tiáº¿p.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 3, thuong_xp: 300, type: 'achievement', bieu_tuong: 'ðŸ•¯ï¸' },
    { tieu_de: 'KiÃªn trÃ¬ (7 ngÃ y)', mo_ta: 'Duy trÃ¬ chuá»—i há»c táº­p trong 7 ngÃ y liÃªn tiáº¿p.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 7, thuong_xp: 700, type: 'achievement', bieu_tuong: 'ðŸ”¥' },
    { tieu_de: 'Bá»n bá»‰ (14 ngÃ y)', mo_ta: 'Duy trÃ¬ chuá»—i há»c táº­p trong 14 ngÃ y liÃªn tiáº¿p.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 14, thuong_xp: 1500, type: 'achievement', bieu_tuong: 'â˜„ï¸' },
    { tieu_de: 'Äam mÃª (30 ngÃ y)', mo_ta: 'Duy trÃ¬ chuá»—i há»c táº­p trong 30 ngÃ y liÃªn tiáº¿p.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 30, thuong_xp: 4000, type: 'achievement', bieu_tuong: 'â˜€ï¸' },
    { tieu_de: 'Báº¥t diá»‡t (90 ngÃ y)', mo_ta: 'Duy trÃ¬ chuá»—i há»c táº­p trong 90 ngÃ y liÃªn tiáº¿p.', loai_hanh_dong: 'streak', so_luong_muc_tieu: 90, thuong_xp: 12000, type: 'achievement', bieu_tuong: 'ðŸ‘‘' }
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


