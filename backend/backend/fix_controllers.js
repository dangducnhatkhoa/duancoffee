const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/ASUS/Downloads/XBid - Full Code/dong_ho_server_spring_2026/dong_ho_server_spring_2026/controllers';

const replacements = [
  { from: /,\s*deleted_at:\s*null/g, to: '' },
  { from: /deleted_at:\s*null\s*,?/g, to: '' }
];

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    var filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && filepath.endsWith('.js')) {
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
