const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};

const replacements = [
  { from: /rounded-t-sheet/g, to: 'rounded-t-[44px]' },
  { from: /rounded-sheet/g, to: 'rounded-[44px]' },
  { from: /rounded-pill/g, to: 'rounded-full' },
  { from: /rounded-xl/g, to: 'rounded-[24px]' },
  { from: /rounded-lg/g, to: 'rounded-[20px]' },
  { from: /rounded-t-dock/g, to: 'rounded-t-[32px]' },
  { from: /rounded-dock/g, to: 'rounded-[32px]' },
  { from: /rounded-md/g, to: 'rounded-[16px]' },
];

walkDir(path.join(__dirname, 'src'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    replaceInFile(filePath, replacements);
  }
});

// Remove borderRadius from tailwind.config.js just to be clean
let twConfig = fs.readFileSync(path.join(__dirname, 'tailwind.config.js'), 'utf-8');
twConfig = twConfig.replace(/borderRadius:\s*\{[\s\S]*?\},/g, '');
fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), twConfig);

console.log('Arbitrary radius script done.');
