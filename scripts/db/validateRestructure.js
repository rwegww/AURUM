import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const getCredentials = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL and service role/anon key.');
  }

  return { url: url.replace(/\/$/, ''), key };
};

const request = async (path, { method = 'GET', prefer } = {}) => {
  const { url, key } = getCredentials();
  return fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(prefer ? { Prefer: prefer } : {})
    }
  });
};

const countRows = async (table) => {
  const response = await request(`/rest/v1/${table}?select=*`, {
    method: 'HEAD',
    prefer: 'count=exact'
  });
  if (!response.ok) return { ok: false, status: response.status, count: null };
  const range = response.headers.get('content-range') || '';
  return {
    ok: true,
    status: response.status,
    count: range.includes('/') ? Number(range.split('/').pop()) : null
  };
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const failIfMigrationHasNotRun = (definitions) => {
  if (!definitions.lessons && definitions.lesson) {
    throw new Error([
      'Migration has not run yet: public.lesson still exists and public.lessons is missing.',
      'Run `npm run db:migrate:restructure` first after adding SUPABASE_DB_URL, DATABASE_URL, or SUPABASE_DB_PASSWORD to .env.local.'
    ].join('\n'));
  }
};

const main = async () => {
  const schemaResponse = await request('/rest/v1/');
  assert(schemaResponse.ok, `OpenAPI schema fetch failed: ${schemaResponse.status}`);
  const schema = await schemaResponse.json();
  const definitions = schema.definitions || schema.components?.schemas || {};
  const paths = Object.keys(schema.paths || {});

  failIfMigrationHasNotRun(definitions);

  assert(definitions.lessons, 'Expected public.lessons to exist.');
  assert(!definitions.lesson, 'Expected public.lesson to be removed/renamed.');
  assert(definitions.user_progress, 'Expected public.user_progress to exist.');
  assert(!definitions.testimonials, 'Expected public.testimonials to be dropped.');
  assert(!definitions.user_devices, 'Expected public.user_devices to be dropped.');
  assert(!definitions.user_unlocked_lessons, 'Expected public.user_unlocked_lessons to be dropped.');
  assert(!definitions.user_unlocked_chemicals, 'Expected public.user_unlocked_chemicals to be dropped.');
  assert(!definitions.users?.properties?.balancing_progress, 'Expected users.balancing_progress to be dropped.');
  assert(!definitions.users?.properties?.last_streak_reset_at, 'Expected users.last_streak_reset_at to be dropped.');
  assert(!definitions.grade_levels?.properties?.description, 'Expected grade_levels.description to be dropped.');
  assert(!definitions.lab_reactions?.properties?.lesson_id, 'Expected lab_reactions.lesson_id to be dropped.');
  assert(!definitions.materials?.properties?.author_id, 'Expected materials.author_id to be dropped.');
  assert(definitions.feedback?.properties?.metadata, 'Expected feedback.metadata to exist.');
  assert(definitions.lessons?.properties?.theory_modules?.format === 'jsonb', 'Expected lessons.theory_modules to be jsonb.');

  const lessons = await countRows('lessons');
  assert(lessons.ok && lessons.count === 110, `Expected lessons count 110, got ${lessons.count}.`);

  const progress = await countRows('user_progress');
  assert(progress.ok && progress.count > 0, 'Expected migrated user_progress rows.');

  assert(paths.includes('/rpc/increment_likes'), 'Expected increment_likes RPC to be exposed.');
  assert(paths.includes('/rpc/increment_material_view'), 'Expected increment_material_view RPC to be exposed.');

  console.log('Database restructure validation passed.');
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
