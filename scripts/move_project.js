// scripts/move_project.js
// Copies the project to a clean path (C:/ecommerce) excluding heavy directories.
const fs = require('fs');
const path = require('path');

// Resolve the current project root (may contain a back‑tick in the path).
const src = path.resolve(__dirname, '..'); // this script lives in ./scripts, so parent is project root
const dest = path.resolve('C:/ecommerce');

console.log('Source:', src);
console.log('Destination:', dest);

// Ensure destination exists
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Helper to decide which files/folders to skip
const EXCLUDE = new Set(['node_modules', '.next', '.vercel', '.git']);

function copyRecursiveSync(srcPath, destPath) {
  const stats = fs.statSync(srcPath);
  const baseName = path.basename(srcPath);
  if (EXCLUDE.has(baseName)) return; // skip excluded dirs/files
  if (stats.isDirectory()) {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
    }
    const entries = fs.readdirSync(srcPath);
    for (const entry of entries) {
      copyRecursiveSync(path.join(srcPath, entry), path.join(destPath, entry));
    }
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
}

copyRecursiveSync(src, dest);
console.log('✅ Project copied to', dest);
