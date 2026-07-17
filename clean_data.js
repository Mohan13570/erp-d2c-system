const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;
walk('admin/src/pages', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Zero out inline hardcoded dollar amounts like $540,200.00
    content = content.replace(/\$\d{1,3}(,\d{3})*(\.\d{2})?/g, '$0.00');

    // 2. Empty arrays assigned to variables (const data = [...]) -> const data = []
    content = content.replace(/=\s*\[\s*\{\s*[a-zA-Z0-9_'"\s:]+,\s*[a-zA-Z0-9_'"\s:,]*\}\s*\]/g, '= []');

    // 3. Any inline array mapping like {[ { name: 'Jan', rev: 4000 }, ... ]} -> {[]}
    content = content.replace(/\{\s*\[\s*\{\s*[a-zA-Z0-9_'"\s:]+,\s*[a-zA-Z0-9_'"\s:,]*\}\s*(,\s*\{\s*[a-zA-Z0-9_'"\s:]+,\s*[a-zA-Z0-9_'"\s:,]*\}\s*)*\]/g, '{[]');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      count++;
      console.log(`Cleaned: ${filePath}`);
    }
  }
});

console.log(`Aggressively cleaned ${count} files.`);
