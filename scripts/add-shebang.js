const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/index.js');
let content = fs.readFileSync(indexPath, 'utf-8');

// Add shebang if not present
if (!content.startsWith('#!/usr/bin/env node')) {
  content = '#!/usr/bin/env node\n' + content;
  fs.writeFileSync(indexPath, content, 'utf-8');
  console.log('Shebang added to dist/index.js');
}
