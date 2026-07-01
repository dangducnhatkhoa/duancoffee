const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/ASUS/Downloads/XBid - Full Code/bid_angular/bid_angular/src';

const replacements = [
  { from: /đồng hồ/g, to: 'cà phê' },
  { from: /Đồng hồ/g, to: 'Cà phê' },
  { from: /Đồng Hồ/g, to: 'Cà Phê' },
  { from: /ĐỒNG HỒ/g, to: 'CÀ PHÊ' },
  { from: /Heirloom Auctions/g, to: 'King Coffee' },
  { from: /heirloomauctions\.com/g, to: 'kingcoffee.com' }
];

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    var filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && (filepath.endsWith('.html') || filepath.endsWith('.ts'))) {
      callback(filepath);
    }
  });
}

let modifiedCount = 0;

walkSync(directory, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let newContent = content;
  
  for (const { from, to } of replacements) {
    newContent = newContent.replace(from, to);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`Modified: ${filepath}`);
    modifiedCount++;
  }
});

console.log(`Done! Modified ${modifiedCount} files.`);
