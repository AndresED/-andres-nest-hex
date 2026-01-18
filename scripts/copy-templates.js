const fs = require('fs-extra');
const path = require('path');

const srcTemplates = path.join(__dirname, '../src/templates');
const distTemplates = path.join(__dirname, '../dist/templates');

fs.copySync(srcTemplates, distTemplates);
console.log('Templates copied successfully');
