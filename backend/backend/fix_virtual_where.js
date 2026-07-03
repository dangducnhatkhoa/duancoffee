const fs = require('fs');

const filepath = 'c:/Users/ASUS/Downloads/XBid - Full Code/dong_ho_server_spring_2026/dong_ho_server_spring_2026/controllers/productController.js';
let content = fs.readFileSync(filepath, 'utf8');

// Remove where: { is_primary: true } from image includes
content = content.replace(/,?\s*where:\s*\{\s*is_primary:\s*true\s*\}/g, '');

// Remove where: { is_default: true } from variant includes
content = content.replace(/,?\s*where:\s*\{\s*is_default:\s*true\s*\}/g, '');

fs.writeFileSync(filepath, content, 'utf8');
console.log('Done! Removed is_primary and is_default where clauses.');
