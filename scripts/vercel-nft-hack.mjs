// next build && node scripts/vercel-nft-hack.mjs

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globby as glob } from 'globby';

const projectBase = fileURLToPath(new URL('..', import.meta.url));
const buildDir = path.join(projectBase, '.next');

// Find all .nft.json files
const paths = await glob(
  '**/*.nft.json',
  { cwd: buildDir, onlyFiles: true, gitignore: true, absolute: true },
);

// Add the necessary paths to the .nft.json files we found
paths.forEach(async (nftFilePath) => {
  const data = JSON.parse(await fs.readFile(nftFilePath));
  // Determine relative path to the file we want to include
  const nftFileDir = path.dirname(nftFilePath);
  const newEntry = path.relative(nftFileDir, path.resolve("var/task/node_modules/tesseract.js-core/tesseract-core.wasm.js"));
  // Add the file and write our changes
  data.files.push(newEntry);
  await fs.writeFile(nftFilePath, JSON.stringify(data));
});
