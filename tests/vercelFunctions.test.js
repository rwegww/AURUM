import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const apiDirectory = fileURLToPath(new URL('../api', import.meta.url));

const collectFunctionEntries = (directory, relativeDirectory = 'api') => (
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) return [];

    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFunctionEntries(absolutePath, relativePath);
    return /\.(?:js|mjs|cjs|ts)$/i.test(entry.name) ? [relativePath] : [];
  })
);

describe('cấu trúc Vercel Functions', () => {
  it('chỉ tạo một serverless function cho Express API', () => {
    expect(collectFunctionEntries(apiDirectory)).toEqual(['api/index.js']);
  });
});
