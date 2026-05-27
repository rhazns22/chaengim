const fs = require('fs');
const path = require('path');

const dirs = [
  'src/assets/logo',
  'src/assets/icons',
  'src/assets/categories'
];

dirs.forEach(dir => fs.mkdirSync(path.join(__dirname, dir), { recursive: true }));

// 1x1 transparent PNG base64
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const buffer = Buffer.from(pngBase64, 'base64');

const files = [
  'src/assets/logo/logo.png',
  'src/assets/icons/hero-calendar-gift-check.png',
  'src/assets/icons/benefit-edu.png',
  'src/assets/icons/benefit-finance.png',
  'src/assets/icons/benefit-startup.png',
  'src/assets/icons/benefit-home.png',
];

files.forEach(file => {
  fs.writeFileSync(path.join(__dirname, file), buffer);
});
console.log('Created dummy image files.');
