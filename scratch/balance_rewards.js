import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function balanceRewards() {
  console.log('🚀 Bắt đầu đa dạng hóa phần thưởng và cách tính điểm cho 110 bài học...');

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title');

  if (error) {
    console.error('❌ Lỗi tải bài học:', error);
    return;
  }

  for (const lesson of lessons) {
    let xp = 150;
    let gem = 10;
    let difficulty = 2;

    const titleLower = lesson.title.toLowerCase();

    if (titleLower.includes('ôn tập')) {
      xp = 350;
      gem = 30;
      difficulty = 4;
    } else if (titleLower.includes('kiểm tra') || titleLower.includes('finale')) {
      xp = 600;
      gem = 50;
      difficulty = 5;
    } else if (titleLower.includes('bài 1') || titleLower.includes('khởi đầu')) {
      xp = 100;
      gem = 5;
      difficulty = 1;
    }

    console.log(`🎁 Cập nhật thưởng: ${lesson.title} -> ${xp} XP, ${gem} Gems`);

    const { error: updateError } = await supabase
      .from('lessons')
      .update({ 
        game: {
          type: 'quiz-rush',
          difficulty: difficulty,
          rewardXp: xp,
          rewardGem: gem,
          rewardItemId: xp > 300 ? 'item_rare_crystal' : 'item_basic_flask'
        }
      })
      .eq('id', lesson.id);

    if (updateError) {
      console.warn(`⚠️ Lỗi cập nhật thưởng bài ${lesson.id}:`, updateError.message);
    }
  }

  console.log('\n🏁 Hoàn tất đa dạng hóa phần thưởng!');
}

balanceRewards();
