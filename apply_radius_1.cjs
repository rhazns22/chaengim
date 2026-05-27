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
  // Primary Button & general CTA
  { from: /rounded-btn/g, to: 'rounded-pill' },
  // Chips
  { from: /rounded-chip/g, to: 'rounded-pill' },
  { from: /rounded-full/g, to: 'rounded-pill' },
  // Cards
  { from: /rounded-card/g, to: 'rounded-xl' },
  // Icon Boxes
  { from: /w-20 h-20 bg-background rounded-3xl/g, to: 'w-20 h-20 bg-background rounded-xl' }, // Empty state
  { from: /w-14 h-14 bg-background rounded-2xl/g, to: 'w-14 h-14 bg-background rounded-lg' }, // Skeleton
  { from: /w-14 h-14 rounded-2xl/g, to: 'w-14 h-14 rounded-lg' }, // BenefitIcon
  { from: /w-12 h-12 rounded-xl/g, to: 'w-12 h-12 rounded-lg' }, // Board list icon
  { from: /w-20 h-20 mx-auto mb-4 rounded-2xl/g, to: 'w-20 h-20 mx-auto mb-4 rounded-lg' }, // Detail big icon
  { from: /w-16 h-16 bg-chipBg rounded-2xl/g, to: 'w-16 h-16 bg-chipBg rounded-lg' }, // MyPage avatar
  { from: /w-20 h-20 bg-primary\/10 rounded-2xl/g, to: 'w-20 h-20 bg-primary/10 rounded-lg' }, // RegisterComplete icon
  { from: /w-14 h-14 bg-danger\/10 text-danger rounded-2xl/g, to: 'w-14 h-14 bg-danger/10 text-danger rounded-lg' }, // Schedule item icon
  { from: /bg-white\/10 rounded-2xl/g, to: 'bg-white/10 rounded-lg' }, // Home quick stat boxes
  // Inputs
  { from: /rounded-xl px-4 text-\[15px\]/g, to: 'rounded-lg px-4 text-[15px]' }, // Auth inputs
  { from: /h-\[52px\] bg-white rounded-2xl/g, to: 'h-[52px] bg-white rounded-lg' }, // Search field
  // Social buttons
  { from: /h-14 bg-\[\#FEE500\] text-black font-bold text-\[15px\] rounded-xl/g, to: 'h-14 bg-[#FEE500] text-black font-bold text-[15px] rounded-xl' }, // Keep 24px (xl)
  { from: /h-14 bg-white border border-divider text-textMain font-bold text-\[15px\] rounded-xl/g, to: 'h-14 bg-white border border-divider text-textMain font-bold text-[15px] rounded-xl' }, // Keep 24px (xl)
  // Badges (small)
  { from: /rounded-md shrink-0/g, to: 'rounded-pill shrink-0' }, // Board status badge
  { from: /rounded-md/g, to: 'rounded-pill' }, // Other small badges
  // Specific Bottom Nav wrapper
  { from: /w-full max-w-\[430px\] bg-white border-t border-divider pb-safe z-40/g, to: 'w-full max-w-[430px] bg-white border-t border-divider rounded-t-dock pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]' },
  // Bottom Sheet
  { from: /w-full max-w-\[430px\] p-6 bg-white border-t border-divider pb-safe z-50/g, to: 'w-full max-w-[430px] p-6 bg-white border-t border-divider rounded-t-dock pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]' },
  // Toast
  { from: /rounded-2xl shadow-float/g, to: 'rounded-md shadow-float' },
];

walkDir(path.join(__dirname, 'src'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    replaceInFile(filePath, replacements);
  }
});
console.log('Radius script 1 done.');
