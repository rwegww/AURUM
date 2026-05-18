import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: ['.env.local', '.env'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const BACKUP_ROOT = path.join(ROOT, '.cache');
const PAGE_SIZE = 1000;

const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

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

const fetchOpenApi = async (url, key) => {
  const response = await fetch(`${url}/rest/v1/`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Supabase OpenAPI schema (${response.status}).`);
  }

  return response.json();
};

export const createRestBackup = async ({ onlyTables } = {}) => {
  const { url, key } = getCredentials();
  const schema = await fetchOpenApi(url, key);
  const definitions = schema.definitions || schema.components?.schemas || {};
  const tableNames = Object.keys(definitions)
    .filter((name) => !name.endsWith('_insert') && !name.endsWith('_update'))
    .filter((name) => !onlyTables || onlyTables.includes(name))
    .sort();

  const backupDir = path.join(BACKUP_ROOT, `db-backup-${timestamp()}`);
  await fs.mkdir(backupDir, { recursive: true });
  await fs.writeFile(path.join(backupDir, 'schema-openapi.json'), JSON.stringify(schema, null, 2));

  const supabase = createClient(url, key);
  const manifest = {
    generatedAt: new Date().toISOString(),
    backupDir,
    tables: []
  };

  for (const table of tableNames) {
    const rows = [];
    let from = 0;

    while (true) {
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .range(from, to);

      if (error) {
        throw new Error(`Failed to back up ${table}: ${error.message}`);
      }

      rows.push(...(data || []));
      if (!data || data.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }

    await fs.writeFile(path.join(backupDir, `${table}.json`), JSON.stringify(rows, null, 2));
    manifest.tables.push({ table, rows: rows.length });
    console.log(`Backed up ${table}: ${rows.length} rows`);
  }

  await fs.writeFile(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Backup written to ${backupDir}`);
  return manifest;
};

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  createRestBackup().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
