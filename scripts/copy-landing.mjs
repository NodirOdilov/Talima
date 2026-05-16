import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'landing');
const publicDir = resolve(root, 'public');
const dest = resolve(root, 'dist');

await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });

// Иконки и manifest для лендинга (корень dist/)
const brandFiles = [
  'favicon.svg',
  'logo.svg',
  'icon-512.png',
  'icon-192.png',
  'apple-touch-icon.png',
  'site.webmanifest',
];
for (const file of brandFiles) {
  await cp(resolve(publicDir, file), resolve(dest, file));
}

console.log(`✓ Landing + brand assets copied → ${dest}`);
