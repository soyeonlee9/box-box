const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.md')) {
        callback(path.join(dirPath));
      }
    }
  });
}

function normalizeAndFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Normalize content to NFC to safely apply replace
  let normalized = content.normalize('NFC');
  if (normalized.includes('캔페인') || normalized.includes('켄페인') || normalized.includes('캠페인') /* just to see if it even reads it */) {
    if (normalized.includes('캔페인') || normalized.includes('켄페인')) {
        let fixed = normalized.replace(/캔페인/g, '캠페인').replace(/켄페인/g, '캠페인');
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log(`Fixed typo in ${filePath}`);
    }
  }
}

walkDir('/Users/isoyeon/Documents/box_box', normalizeAndFix);
console.log('Finished fixing typos.');
