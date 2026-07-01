const mysql = require('mysql2/promise');

const categories = [
  { name: 'Cà phê hòa tan', slug: 'ca-phe-hoa-tan' },
  { name: 'Cà phê rang xay', slug: 'ca-phe-rang-xay' },
  { name: 'Cà phê hạt', slug: 'ca-phe-hat' },
  { name: 'Cà phê túi lọc', slug: 'ca-phe-tui-loc' }
];

const brands = [
  { name: 'Trung Nguyên', slug: 'trung-nguyen', logo: 'trung_nguyen.jpg' },
  { name: 'King Coffee', slug: 'king-coffee', logo: 'king_coffee.jpg' },
  { name: 'Nescafe', slug: 'nescafe', logo: 'nescafe.jpg' },
  { name: 'Vinacafe', slug: 'vinacafe', logo: 'vinacafe.jpg' },
  { name: 'Highlands', slug: 'highlands', logo: 'highlands.jpg' },
  { name: 'Phúc Long', slug: 'phuc-long', logo: 'phuc_long.jpg' }
];

// Helper to get random item from array
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate random products
const products = [];
for (let i = 1; i <= 60; i++) {
  const brand = getRandomItem(brands);
  const category = getRandomItem(categories);
  const price = Math.floor(Math.random() * 45 + 5) * 10000; // 50k to 500k
  const views = Math.floor(Math.random() * 1000);
  
  products.push({
    name: `${category.name} ${brand.name} Đặc Biệt Số ${i}`,
    slug: `${category.slug}-${brand.slug}-dac-biet-so-${i}`,
    price: price,
    description: `Khám phá hương vị đậm đà, khó quên từ ${category.name.toLowerCase()} của thương hiệu ${brand.name}. Được tuyển chọn từ những hạt cà phê thượng hạng nhất, sản phẩm mang đến trải nghiệm cà phê chuẩn vị cho mỗi ngày làm việc hứng khởi. Trọng lượng đóng gói đạt chuẩn, đảm bảo hương vị tươi mới trong từng giọt cà phê.`,
    image: `coffee_${i}.jpg`
  });
}

async function seedDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'duan2026'
    });
    
    console.log('Clearing old data...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE san_pham');
    await connection.query('TRUNCATE TABLE danh_muc');
    await connection.query('TRUNCATE TABLE thuong_hieu');
    await connection.query('TRUNCATE TABLE hinh_anh');
    await connection.query('TRUNCATE TABLE bien_the');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Inserting categories...');
    for (const cat of categories) {
      await connection.query(
        'INSERT INTO danh_muc (ten_danh_muc, slug, hinh_anh, mo_ta) VALUES (?, ?, ?, ?)',
        [cat.name, cat.slug, 'cat_placeholder.jpg', 'Danh mục ' + cat.name]
      );
    }
    
    console.log('Inserting brands...');
    for (const brand of brands) {
      await connection.query(
        'INSERT INTO thuong_hieu (ten_thuong_hieu, slug, logo, quoc_gia) VALUES (?, ?, ?, ?)',
        [brand.name, brand.slug, brand.logo, 'Việt Nam']
      );
    }
    
    // Get inserted categories and brands to get their IDs
    const [dbCategories] = await connection.query('SELECT id, ten_danh_muc FROM danh_muc');
    const [dbBrands] = await connection.query('SELECT id, ten_thuong_hieu FROM thuong_hieu');
    
    console.log('Inserting products...');
    for (const product of products) {
      // Find matching category ID and brand ID
      const catId = dbCategories.find(c => product.name.includes(c.ten_danh_muc))?.id || 1;
      const brandId = dbBrands.find(b => product.name.includes(b.ten_thuong_hieu))?.id || 1;
      
      const [result] = await connection.query(
        'INSERT INTO san_pham (id_danh_muc, id_thuong_hieu, ten_san_pham, gia_goc, hinh_anh, slug, mo_ta, luot_xem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [catId, brandId, product.name, product.price, product.image, product.slug, product.description, views = Math.floor(Math.random() * 1000)]
      );
      
      const productId = result.insertId;
      
      // Insert one default variant for the product
      await connection.query(
        'INSERT INTO bien_the (id_san_pham, ten_mau, gia, so_luong_ton) VALUES (?, ?, ?, ?)',
        [productId, '500g', product.price, 100]
      );
      
      // Insert one product image
      await connection.query(
        'INSERT INTO hinh_anh (id_san_pham, hinh, thu_tu) VALUES (?, ?, ?)',
        [productId, product.image, 0]
      );
    }
    
    console.log('60 products inserted successfully!');
    await connection.end();
  } catch (error) {
    console.error('Seed error:', error);
  }
}

seedDatabase();
