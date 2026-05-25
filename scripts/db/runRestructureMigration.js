import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { class8Data } from '../../src/data/curriculum/class8.js';
import { class9Data } from '../../src/data/curriculum/class9.js';
import { class10Data } from '../../src/data/curriculum/class10.js';
import { class11Data } from '../../src/data/curriculum/class11.js';
import { class12Data } from '../../src/data/curriculum/class12.js';
import { createRestBackup } from './backupSupabaseRest.js';

dotenv.config({ path: ['.env.local', '.env'] });

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const MIGRATION_PATH = path.join(ROOT, 'supabase', '20260525_restructure_schema.sql');

const allCurriculumLessons = [
  ...class8Data.ketnoi,
  ...class9Data.ketnoi,
  ...class10Data.ketnoi,
  ...class11Data.ketnoi,
  ...class12Data.ketnoi,
];

const curriculumById = new Map(
  allCurriculumLessons
    .filter((lesson) => lesson && (lesson.id || lesson.lessonId))
    .map((lesson) => [lesson.id || lesson.lessonId, lesson])
);

const getSupabaseCredentials = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL and service role/anon key.');
  }

  return { url, key };
};

const getDatabaseUrl = () => {
  const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (databaseUrl) return databaseUrl;

  const password = process.env.SUPABASE_DB_PASSWORD;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const projectRef = supabaseUrl ? new URL(supabaseUrl).hostname.split('.')[0] : null;

  if (password && projectRef) {
    return `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`;
  }

  throw new Error([
    'Missing database connection string. Cannot run live DDL migration.',
    'Add one of these to .env.local:',
    '  SUPABASE_DB_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres',
    '  DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres',
    'Or add SUPABASE_DB_PASSWORD=<database password> and the script will build the direct Supabase URL from SUPABASE_URL.'
  ].join('\n'));
};

const parseJson = (value) => {
  if (typeof value !== 'string') return { ok: true, value };
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch {
    return { ok: false, value };
  }
};

const findLessonTable = async (supabase) => {
  for (const table of ['lessons', 'lesson']) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (!error) return table;
  }
  throw new Error('Neither lessons nor lesson table is available.');
};

const repairLessonTheoryModules = async (supabase) => {
  const table = await findLessonTable(supabase);
  const { data, error } = await supabase.from(table).select('id,theory_modules').range(0, 999);
  if (error) throw error;

  const invalidRows = (data || []).filter((row) => !parseJson(row.theory_modules).ok);
  if (invalidRows.length === 0) {
    console.log('No invalid lesson theory_modules rows found.');
    return;
  }

  console.log(`Repairing ${invalidRows.length} invalid theory_modules rows in ${table}.`);
  for (const row of invalidRows) {
    const localLesson = curriculumById.get(row.id);
    if (!localLesson) {
      throw new Error(`No local curriculum source found for lesson ${row.id}.`);
    }

    const nextValue = typeof row.theory_modules === 'string'
      ? JSON.stringify(localLesson.theoryModules || [])
      : (localLesson.theoryModules || []);

    const { error: updateError } = await supabase
      .from(table)
      .update({ theory_modules: nextValue })
      .eq('id', row.id);

    if (updateError) throw updateError;
  }
};

const runSqlMigration = async (databaseUrl) => {
  const sql = await fs.readFile(MIGRATION_PATH, 'utf8');
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
};

const main = async () => {
  const databaseUrl = getDatabaseUrl();
  const { url, key } = getSupabaseCredentials();
  const supabase = createClient(url, key);

  await createRestBackup();
  await repairLessonTheoryModules(supabase);
  await runSqlMigration(databaseUrl);
  console.log('Database restructure migration completed.');
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
