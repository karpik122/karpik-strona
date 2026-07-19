import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSSShuffle } from 'css-shuffle';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const candidateDirs = [rootDir, path.join(rootDir, 'src')].filter((dir) => fs.existsSync(dir));

const sourceDir = candidateDirs.find((dir) => {
  return fs.existsSync(path.join(dir, 'index.html')) ||
    fs.existsSync(path.join(dir, 'css')) ||
    fs.existsSync(path.join(dir, 'images'));
});

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

if (sourceDir) {
  const indexPath = path.join(sourceDir, 'index.html');
  const cssPath = path.join(sourceDir, 'css');
  const imagesPath = path.join(sourceDir, 'images');

  if (fs.existsSync(indexPath)) {
    fs.cpSync(indexPath, path.join(distDir, 'index.html'));
  }

  if (fs.existsSync(cssPath)) {
    fs.cpSync(cssPath, path.join(distDir, 'css'), { recursive: true });
  }

  if (fs.existsSync(imagesPath)) {
    fs.cpSync(imagesPath, path.join(distDir, 'images'), { recursive: true });
  }
}

if (fs.existsSync(path.join(distDir, 'index.html')) || fs.existsSync(path.join(distDir, 'css'))) {
  const shuffler = new CSSShuffle();
  await shuffler.obfuscate(distDir);
  shuffler.saveMappingJSON(path.join(distDir, 'mapping.json'));
  shuffler.printStatsTable();
  console.log(`Build complete. Obfuscated site ready in ${distDir}`);
} else {
  console.log(`No site source found; keeping ${distDir} as-is.`);
}
