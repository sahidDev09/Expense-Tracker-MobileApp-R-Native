/**
 * Post-build script to fix Vercel deployment font issues.
 * 
 * Vercel ignores any directory named "node_modules", even inside dist/assets/.
 * This script moves all font files from dist/assets/node_modules/... to dist/assets/fonts/
 * and updates all HTML and JS references accordingly.
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const SOURCE_DIR = path.join(DIST_DIR, 'assets', 'node_modules');
const TARGET_DIR = path.join(DIST_DIR, 'assets', 'fonts');

function findFiles(dir, ext) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findFiles(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

// 1. Find all font files in dist/assets/node_modules
const fontFiles = findFiles(SOURCE_DIR, '.ttf');
if (fontFiles.length === 0) {
  console.log('No font files found in dist/assets/node_modules/. Skipping.');
  process.exit(0);
}

// 2. Create target directory
fs.mkdirSync(TARGET_DIR, { recursive: true });

// 3. Copy font files to new location and build replacement map
const replacements = {};
for (const fontFile of fontFiles) {
  const fileName = path.basename(fontFile);
  const targetPath = path.join(TARGET_DIR, fileName);
  fs.copyFileSync(fontFile, targetPath);

  // Build the old URL path and new URL path
  const oldRelative = '/' + path.relative(DIST_DIR, fontFile);
  const newRelative = '/' + path.relative(DIST_DIR, targetPath);
  replacements[oldRelative] = newRelative;
  console.log(`  Moved: ${oldRelative} -> ${newRelative}`);
}

// 4. Update all HTML and JS files to use new paths
const htmlFiles = findFiles(DIST_DIR, '.html');
const jsFiles = findFiles(path.join(DIST_DIR, '_expo'), '.js');
const allFiles = [...htmlFiles, ...jsFiles];

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let modified = false;
  for (const [oldPath, newPath] of Object.entries(replacements)) {
    if (content.includes(oldPath)) {
      content = content.split(oldPath).join(newPath);
      modified = true;
    }
  }
  if (modified) {
    fs.writeFileSync(file, content);
    console.log(`  Updated references in: ${path.relative(DIST_DIR, file)}`);
  }
}

// 5. Remove the old node_modules directory from dist/assets
fs.rmSync(SOURCE_DIR, { recursive: true, force: true });
console.log('  Removed dist/assets/node_modules/');

console.log(`\nDone! Moved ${fontFiles.length} font files to dist/assets/fonts/`);
