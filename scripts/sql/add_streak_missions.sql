-- Add Streak Missions to missions table
INSERT INTO missions (id, title, description, action_type, target_count, xp_reward, type, icon)
VALUES 
  -- Daily Streak Mission
  (gen_random_uuid(), 'Thắp lửa hôm nay', 'Online đủ 10 phút hoặc hoàn thành 1 bài học để thắp chuỗi.', 'streak_light', 1, 50, 'daily', '🔥'),
  
  -- Streak Achievements
  (gen_random_uuid(), 'Giữ lửa (3 ngày)', 'Duy trì chuỗi học tập trong 3 ngày liên tiếp.', 'streak', 3, 300, 'achievement', '🕯️'),
  (gen_random_uuid(), 'Kiên trì (7 ngày)', 'Duy trì chuỗi học tập trong 7 ngày liên tiếp.', 'streak', 7, 700, 'achievement', '🔥'),
  (gen_random_uuid(), 'Bền bỉ (14 ngày)', 'Duy trì chuỗi học tập trong 14 ngày liên tiếp.', 'streak', 14, 1500, 'achievement', '☄️'),
  (gen_random_uuid(), 'Đam mê (30 ngày)', 'Duy trì chuỗi học tập trong 30 ngày liên tiếp.', 'streak', 30, 4000, 'achievement', '☀️'),
  (gen_random_uuid(), 'Bất diệt (90 ngày)', 'Duy trì chuỗi học tập trong 90 ngày liên tiếp.', 'streak', 90, 12000, 'achievement', '👑')
ON CONFLICT (title) DO NOTHING;
