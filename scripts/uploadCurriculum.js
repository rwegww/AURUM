import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CURRICULUM_PATH = path.join(__dirname, '../dist/assets/curriculum');

async function uploadFile(filePath, publicId) {
  return new Promise((resolve, reject) => {
    console.log(`📤 Đang tải lên: ${filePath} (ID: ${publicId})`);
    cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      public_id: publicId,
      folder: 'chemistry-odyssey/curriculum',
      overwrite: true
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

async function startMigration() {
  console.log('🚀 Bắt đầu quá trình di chuyển video lên Cloudinary...');

  if (!fs.existsSync(CURRICULUM_PATH)) {
    console.error('❌ Thư mục dist/assets/curriculum không tồn tại!');
    return;
  }

  const grades = fs.readdirSync(CURRICULUM_PATH).filter(f => f.startsWith('class'));

  for (const gradeFolder of grades) {
    const grade = gradeFolder.replace('class', '');
    const folderPath = path.join(CURRICULUM_PATH, gradeFolder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.mp4'));

    console.log(`\n📂 Xử lý Khối ${grade} (${files.length} video)`);

    // 1. Tải danh sách bài học của khối này để tránh lỗi truy vấn cột 'order' (từ khóa dự phòng)
    const { data: allGradeLessons, error: fetchError } = await supabase
      .from('lesson')
      .select('id, title, order')
      .eq('class_id', grade);

    if (fetchError) {
      console.error(`❌ Lỗi tải bài học khối ${grade}:`, fetchError.message);
      continue;
    }

    for (const fileName of files) {
      // Filename format: 8-1.mp4, 10-12.mp4
      const order = parseInt(fileName.split('-')[1].replace('.mp4', ''));
      const filePath = path.join(folderPath, fileName);
      const publicId = fileName.replace('.mp4', '');

      try {
        // 1. Upload to Cloudinary
        const uploadResult = await uploadFile(filePath, publicId);
        const videoUrl = uploadResult.secure_url;
        console.log(`✅ Thành công: ${videoUrl}`);

        // 2. Tìm bài học tương ứng trong danh sách đã tải
        const lesson = allGradeLessons.find(l => l.order === order);

        if (lesson) {
          console.log(`📝 Cập nhật bài học: ${lesson.title} (ID: ${lesson.id})`);

          // 3. Update lesson in Supabase
          const { error: updateError } = await supabase
            .from('lesson')
            .update({ intro_video_url: videoUrl })
            .eq('id', lesson.id);

          if (updateError) {
             console.warn(`⚠️ Lỗi cập nhật DB cho bài ${lesson.title}:`, updateError.message);
             console.log('💡 Có thể cột "intro_video_url" chưa tồn tại trong bảng lessons.');
          } else {
             console.log(`✨ Đã cập nhật database cho ${lesson.title}`);
          }
        } else {
          console.warn(`⚠️ Không tìm thấy bài học phù hợp cho video ${fileName} (Grade ${grade}, Order ${order})`);
        }

      } catch (err) {
        console.error(`❌ Lỗi khi xử lý ${fileName}:`, err.message);
      }
    }
  }

  console.log('\n🏁 Quá trình di chuyển hoàn tất!');
}

startMigration();
