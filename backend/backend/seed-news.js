const db = require('./config/database');

async function seedNews() {
  try {
    await db.authenticate();
    
    const [categories] = await db.query("SELECT * FROM loai_bai_viet LIMIT 1");
    let categoryId = 1;
    if (categories.length === 0) {
      const [insertCat] = await db.query("INSERT INTO loai_bai_viet (ten_loai, an_hien) VALUES ('Tin tức chung', 1)");
      categoryId = insertCat.insertId;
    } else {
      categoryId = categories[0].id || 1;
    }

    const articles = [
      {
        id_loai_bai_viet: categoryId,
        tieu_de: 'Khám Phá Hương Vị Cà Phê Đặc Sản Tại King Coffee',
        slug: 'kham-pha-huong-vi-ca-phe-dac-san',
        noi_dung: '<p>Cà phê đặc sản không chỉ là một thức uống, mà còn là một trải nghiệm văn hóa. Tại King Coffee, chúng tôi luôn chọn lọc những hạt cà phê ngon nhất từ các vùng trồng nổi tiếng.</p><p>Qua từng giọt cà phê, bạn sẽ cảm nhận được sự tinh túy của đất trời, hương thơm nồng nàn và hậu vị đậm đà không thể nhầm lẫn.</p>',
        hinh: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
        an_hien: 1
      },
      {
        id_loai_bai_viet: categoryId,
        tieu_de: 'Bí Quyết Pha Cà Phê Phin Ngon Chuẩn Vị Việt',
        slug: 'bi-quyet-pha-ca-phe-phin-ngon',
        noi_dung: '<p>Pha cà phê phin là một nghệ thuật. Bạn cần chú ý đến nhiệt độ nước (khoảng 90-95 độ C) và thời gian ủ cà phê để chiết xuất được trọn vẹn hương vị.</p><p>Hãy bắt đầu ngày mới với một ly cà phê phin do chính tay bạn pha chế để tiếp thêm năng lượng tích cực.</p>',
        hinh: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
        an_hien: 1
      },
      {
        id_loai_bai_viet: categoryId,
        tieu_de: 'Tác Dụng Tuyệt Vời Của Cà Phê Đối Với Sức Khỏe',
        slug: 'tac-dung-tuyet-voi-cua-ca-phe',
        noi_dung: '<p>Ngoài khả năng giúp tỉnh táo, cà phê còn chứa nhiều chất chống oxy hóa. Uống cà phê với lượng vừa phải có thể giúp giảm nguy cơ mắc một số bệnh và cải thiện tâm trạng.</p><p>Hãy cùng tìm hiểu những lợi ích sức khỏe mà cà phê mang lại trong bài viết này.</p>',
        hinh: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800',
        an_hien: 1
      }
    ];

    for (const art of articles) {
      const [existing] = await db.query(`SELECT * FROM bai_viet WHERE slug = '${art.slug}'`);
      if (existing.length === 0) {
        await db.query(
          `INSERT INTO bai_viet (id_loai_bai_viet, tieu_de, slug, noi_dung, hinh, luot_xem, an_hien) 
           VALUES (${art.id_loai_bai_viet}, '${art.tieu_de}', '${art.slug}', '${art.noi_dung}', '${art.hinh}', 0, ${art.an_hien})`
        );
      }
    }

    console.log("Đã chèn dữ liệu bài viết mẫu thành công!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
seedNews();
