import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Supabase Configuration
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const SOURCE_DIR = 'd:\\Downloads\\drive-download-20260410T043209Z-3-001';
const CLOUDINARY_FOLDER = 'chemistry-odyssey/library';

async function migrate() {
  console.log('🚀 Starting Material Migration...');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    return;
  }

  // Check if materials table exists
  const { error: tableError } = await supabase.from('materials').select('id').limit(1);
  if (tableError && tableError.code === 'PGRST116') {
     // Table doesn't exist or is empty
  } else if (tableError) {
    console.error('❌ Error checking materials table. Please make sure to run the SQL setup first.');
    console.error(tableError);
    return;
  }

  const subdirs = fs.readdirSync(SOURCE_DIR);

  for (const subdir of subdirs) {
    const fullPath = path.join(SOURCE_DIR, subdir);
    if (fs.statSync(fullPath).isDirectory()) {
      console.log(`\n📁 Processing Category: ${subdir}`);
      await processDirectory(fullPath, subdir);
    }
  }

  console.log('\n✅ Migration Complete!');
}

async function processDirectory(dirPath, category) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Could recurse further if needed, but for now assuming 1 level of categories
      await processDirectory(filePath, category);
      continue;
    }

    // Skip system files
    if (file.startsWith('.')) continue;

    console.log(`   Uploading: ${file}...`);

    try {
      // 1. Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: `${CLOUDINARY_FOLDER}/${category}`,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true
      });

      // 2. Save to Supabase
      const { data, error } = await supabase.from('materials').insert([{
        title: path.parse(file).name,
        description: `Tài liệu từ phần ${category}`,
        file_url: uploadResult.secure_url,
        file_type: path.extname(file).slice(1).toLowerCase(),
        category: category,
        author_id: null, // Default to null for now
        created_at: new Date()
      }]).select();

      if (error) {
        console.error(`   ❌ Supabase Error for ${file}:`, error.message);
      } else {
        console.log(`   ✨ Successfully migrated: ${file}`);
      }
    } catch (err) {
      console.error(`   ❌ Failed to upload ${file}:`, err.message);
    }
  }
}

migrate().catch(err => console.error('FATAL ERROR:', err));
