const fs = require('fs');
const path = require('path');

const DIRS_TO_SCAN = ['./admin', './store', './api'];
const FILES_TO_SCAN = ['./start.bat', './stop.bat'];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.tsx', '.ts', '.html', '.md', '.bat', '.json'].includes(ext)) return;
  if (filePath.includes('package-lock.json')) return;

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace word 'Aura' with 'Lizome'
    content = content.replace(/\bAura\b/g, 'Lizome');
    // Replace word 'AURA' with 'LIZOME'
    content = content.replace(/\bAURA\b/g, 'LIZOME');
    // Replace lowercase 'aura' with 'lizome' (only full words)
    content = content.replace(/\baura\b/g, 'lizome');

    // Also replace the old Command icon in Sidebar.tsx and Login.tsx with our custom SVG image
    if (filePath.endsWith('Sidebar.tsx')) {
        content = content.replace(
            /<Command className="h-8 w-8 text-indigo-600"\s*\/>/g, 
            `<img src="/lizome-icon.svg" className="h-8" alt="LIZOME" />`
        );
        content = content.replace(
            /<Command className="h-6 w-6 text-indigo-600"\s*\/>/g, 
            `<img src="/lizome-icon.svg" className="h-6" alt="LIZOME" />`
        );
    }

    if (filePath.endsWith('Login.tsx') || filePath.endsWith('page.tsx')) {
        content = content.replace(
            /<Command className="[^"]*"\s*\/>/g, 
            `<img src="/lizome-icon.svg" className="h-10" alt="LIZOME" />`
        );
        content = content.replace(
            /<Command size={[\w]+} className="[^"]*"\s*\/>/g, 
            `<img src="/lizome-icon.svg" className="h-10" alt="LIZOME" />`
        );
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  } catch (e) {
    console.error('Failed processing', filePath, e);
  }
}

// Run
DIRS_TO_SCAN.forEach(processDir);
FILES_TO_SCAN.forEach(processFile);

console.log('Rebranding complete.');
