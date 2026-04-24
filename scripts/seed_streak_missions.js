import { supabase } from '../api/lib/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function addStreakMissions() {
  const missions = [
    { title: 'Thắp lửa hôm nay', description: 'Online đủ 10 phút hoặc hoàn thành 1 bài học để thắp chuỗi.', action_type: 'streak_light', target_count: 1, xp_reward: 50, type: 'daily', icon: '🔥' },
    { title: 'Giữ lửa (3 ngày)', description: 'Duy trì chuỗi học tập trong 3 ngày liên tiếp.', action_type: 'streak', target_count: 3, xp_reward: 300, type: 'achievement', icon: '🕯️' },
    { title: 'Kiên trì (7 ngày)', description: 'Duy trì chuỗi học tập trong 7 ngày liên tiếp.', action_type: 'streak', target_count: 7, xp_reward: 700, type: 'achievement', icon: '🔥' },
    { title: 'Bền bỉ (14 ngày)', description: 'Duy trì chuỗi học tập trong 14 ngày liên tiếp.', action_type: 'streak', target_count: 14, xp_reward: 1500, type: 'achievement', icon: '☄️' },
    { title: 'Đam mê (30 ngày)', description: 'Duy trì chuỗi học tập trong 30 ngày liên tiếp.', action_type: 'streak', target_count: 30, xp_reward: 4000, type: 'achievement', icon: '☀️' },
    { title: 'Bất diệt (90 ngày)', description: 'Duy trì chuỗi học tập trong 90 ngày liên tiếp.', action_type: 'streak', target_count: 90, xp_reward: 12000, type: 'achievement', icon: '👑' }
  ];

  for (const m of missions) {
    const { data: existing } = await supabase.from('missions').select('id').eq('title', m.title).maybeSingle();
    if (existing) {
      console.log(`Mission already exists: ${m.title}`);
      continue;
    }
    
    const { error } = await supabase.from('missions').insert(m);
    if (error) console.error(`Error adding mission ${m.title}:`, error);
    else console.log(`Mission added: ${m.title}`);
  }
}

addStreakMissions();
