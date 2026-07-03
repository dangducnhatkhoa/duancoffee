const db = require('./config/database');

async function seedNews() {
  try {
    await db.authenticate();

    // Tạo các loại bài viết nếu chưa có
    const categoryMap = {};
    const catList = [
      { ten_loai: 'Kiến Thức Cà Phê' },
      { ten_loai: 'Sức Khỏe' },
      { ten_loai: 'Cộng Đồng' },
      { ten_loai: 'Khuyến Mãi & Sự Kiện' },
    ];

    for (const cat of catList) {
      const [existing] = await db.query(`SELECT * FROM loai_bai_viet WHERE ten_loai = '${cat.ten_loai}' LIMIT 1`);
      if (existing.length === 0) {
        const [ins] = await db.query(`INSERT INTO loai_bai_viet (ten_loai, an_hien) VALUES ('${cat.ten_loai}', 1)`);
        categoryMap[cat.ten_loai] = ins.insertId;
      } else {
        categoryMap[cat.ten_loai] = existing[0].id;
      }
    }

    const articles = [
      // ===== KIẾN THỨC CÀ PHÊ =====
      {
        id_loai_bai_viet: categoryMap['Kiến Thức Cà Phê'],
        tieu_de: 'Bí Quyết Pha Cà Phê Phin Ngon Chuẩn Vị Truyền Thống',
        slug: 'bi-quyet-pha-ca-phe-phin-ngon-chuan-vi',
        noi_dung: `<p>Cà phê phin là linh hồn của văn hóa cà phê Việt Nam. Để pha được một ly cà phê phin đúng chuẩn, bạn cần chú ý đến từng chi tiết nhỏ trong quy trình.</p>
<h2>1. Chọn đúng loại cà phê</h2>
<p>Hãy chọn loại cà phê rang vừa đến đậm, xay thô vừa phải. Robusta cho vị đắng mạnh, Arabica cho hương thơm thanh thoát — hoặc kết hợp cả hai để tạo hương vị cân bằng.</p>
<h2>2. Nhiệt độ nước</h2>
<p>Nước pha phải đạt <strong>92–96°C</strong>. Không dùng nước đang sôi 100°C vì sẽ làm cháy cà phê, mất đi hương thơm tự nhiên. Tráng phin bằng nước nóng trước khi pha giúp cà phê nở đều và chiết xuất tốt hơn.</p>
<h2>3. Thứ tự thực hiện</h2>
<ul>
<li>Cho 20–25g cà phê vào phin, lắc nhẹ để bột phẳng đều</li>
<li>Đặt bộ lọc lên và nén nhẹ tay</li>
<li>Đổ khoảng 30ml nước nóng đầu, chờ 30 giây để cà phê "nở"</li>
<li>Tiếp tục đổ nước từ từ, đợi 4–5 phút để chiết xuất hoàn tất</li>
</ul>
<p>Kết quả là một ly cà phê phin với lớp crema nâu vàng đẹp mắt, hương thơm quyến rũ và vị đậm đà không thể nhầm lẫn!</p>`,
        hinh: 'https://images.unsplash.com/photo-1495474472202-4affb9442b08?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      },
      {
        id_loai_bai_viet: categoryMap['Kiến Thức Cà Phê'],
        tieu_de: 'Arabica Và Robusta – Sự Khác Biệt Mà Bạn Cần Biết',
        slug: 'arabica-va-robusta-su-khac-biet',
        noi_dung: `<p>Hai giống cà phê phổ biến nhất thế giới — Arabica và Robusta — mang đến những trải nghiệm hương vị hoàn toàn khác nhau. Hiểu rõ sự khác biệt giúp bạn chọn được ly cà phê phù hợp nhất.</p>
<h2>Arabica – Thanh Lịch & Thơm Dịu</h2>
<p>Arabica chiếm khoảng 60% sản lượng cà phê toàn cầu. Hạt Arabica thường mọc ở độ cao từ 600–2000m so với mực nước biển, khí hậu mát mẻ. Hương vị đặc trưng: <strong>chua nhẹ, ngọt hậu, thơm hoa trái</strong>. Hàm lượng caffeine thấp hơn Robusta.</p>
<h2>Robusta – Đậm Đà & Mạnh Mẽ</h2>
<p>Robusta phổ biến tại Việt Nam, Indonesia và châu Phi. Hạt Robusta dễ trồng hơn, kháng sâu bệnh tốt. Hương vị: <strong>đắng mạnh, đất, socola đắng</strong>, hàm lượng caffeine cao gần gấp đôi Arabica.</p>
<h2>Nên Chọn Loại Nào?</h2>
<p>Nếu bạn thích cà phê nhẹ nhàng, thơm trái cây — hãy chọn Arabica. Nếu bạn cần một ly cà phê đậm, mạnh để tỉnh táo — Robusta là lựa chọn lý tưởng. Còn nếu muốn cân bằng — hãy thử blend 60% Robusta + 40% Arabica kiểu Việt Nam!</p>`,
        hinh: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      },
      {
        id_loai_bai_viet: categoryMap['Kiến Thức Cà Phê'],
        tieu_de: 'Cold Brew Tại Nhà – Công Thức Đơn Giản Cho Mùa Hè',
        slug: 'cold-brew-tai-nha-cong-thuc-don-gian',
        noi_dung: `<p>Cold brew không cần máy móc đắt tiền — chỉ cần cà phê ngon, nước lạnh và kiên nhẫn. Đây là công thức cold brew tại nhà cực đơn giản mà Bean & Brew chia sẻ cho bạn!</p>
<h2>Nguyên Liệu (4 ly)</h2>
<ul>
<li>100g cà phê xay thô (Robusta hoặc blend)</li>
<li>700ml nước lọc lạnh</li>
<li>Bình thủy tinh hoặc hũ có nắp</li>
<li>Giấy lọc hoặc vải lọc</li>
</ul>
<h2>Thực Hiện</h2>
<ol>
<li>Trộn cà phê xay và nước lạnh theo tỉ lệ 1:7 trong bình thủy tinh</li>
<li>Khuấy nhẹ để thấm đều, đậy nắp kín</li>
<li>Cho vào tủ lạnh ủ <strong>12–24 giờ</strong></li>
<li>Lọc qua giấy lọc hoặc vải lọc 2 lần cho trong</li>
<li>Bảo quản ngăn mát, dùng trong 1 tuần</li>
</ol>
<p>Thành phẩm là cold brew concentrate đậm đà — pha thêm nước, sữa hoặc đá để thưởng thức. Uống lạnh buổi sáng mùa hè — tuyệt vời!</p>`,
        hinh: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      },

      // ===== SỨC KHỎE =====
      {
        id_loai_bai_viet: categoryMap['Sức Khỏe'],
        tieu_de: 'Uống 1 Ly Cà Phê Mỗi Ngày Mang Lại Lợi Ích Gì?',
        slug: 'uong-ca-phe-moi-ngay-loi-ich-suc-khoe',
        noi_dung: `<p>Cà phê không chỉ giúp bạn tỉnh táo buổi sáng — khoa học đã chứng minh uống cà phê vừa phải mang lại nhiều lợi ích sức khỏe đáng kể.</p>
<h2>1. Tăng Cường Năng Lượng & Tập Trung</h2>
<p>Caffeine trong cà phê ức chế adenosine — chất gây buồn ngủ — giúp bạn tỉnh táo, tập trung và nâng cao hiệu suất làm việc. Chỉ cần 1–2 ly/ngày là đủ.</p>
<h2>2. Giàu Chất Chống Oxy Hóa</h2>
<p>Cà phê là một trong những nguồn cung cấp chất chống oxy hóa lớn nhất trong chế độ ăn uống phương Tây. Các polyphenol giúp bảo vệ tế bào khỏi tổn thương và lão hóa.</p>
<h2>3. Hỗ Trợ Sức Khỏe Não Bộ</h2>
<p>Nghiên cứu cho thấy người uống cà phê đều đặn có nguy cơ mắc Alzheimer và Parkinson thấp hơn đến 30–60%.</p>
<h2>4. Tốt Cho Gan</h2>
<p>Uống 2–3 ly cà phê mỗi ngày giúp giảm nguy cơ xơ gan và ung thư gan đáng kể.</p>
<h2>Lưu Ý Quan Trọng</h2>
<p>Không uống quá 4 ly/ngày. Không uống cà phê lúc đói hoặc ngay trước khi ngủ. Phụ nữ mang thai nên tham khảo ý kiến bác sĩ.</p>`,
        hinh: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      },
      {
        id_loai_bai_viet: categoryMap['Sức Khỏe'],
        tieu_de: 'Thời Điểm Uống Cà Phê Tốt Nhất Trong Ngày',
        slug: 'thoi-diem-uong-ca-phe-tot-nhat-trong-ngay',
        noi_dung: `<p>Không phải lúc nào uống cà phê cũng tốt như nhau. Biết đúng thời điểm sẽ giúp bạn tận dụng tối đa tác dụng của caffeine và bảo vệ sức khỏe.</p>
<h2>⏰ Thời Điểm Lý Tưởng: 9:30 – 11:30 Sáng</h2>
<p>Theo đồng hồ sinh học (cortisol rhythm), mức cortisol — hormone tỉnh táo tự nhiên — đạt đỉnh từ 8:00–9:00 sáng. Uống cà phê lúc này là lãng phí vì cơ thể bạn đã tỉnh táo rồi! Hãy chờ đến 9:30 khi cortisol bắt đầu giảm.</p>
<h2>🚫 Thời Điểm Nên Tránh</h2>
<ul>
<li><strong>Lúc đói (trước 8 sáng):</strong> Kích thích axit dạ dày, gây khó chịu</li>
<li><strong>Sau 3 giờ chiều:</strong> Caffeine có thể cản trở giấc ngủ đêm</li>
<li><strong>Ngay sau bữa ăn:</strong> Ức chế hấp thụ sắt và một số khoáng chất</li>
</ul>
<h2>✅ Mẹo Uống Cà Phê Khoa Học</h2>
<p>Uống cà phê 30–60 phút sau bữa sáng, kết hợp với một ly nước lọc trước đó để hydrate cơ thể. Thêm một chút sữa hoặc cream để giảm kích ứng dạ dày nếu bạn nhạy cảm.</p>`,
        hinh: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      },

      // ===== CỘNG ĐỒNG =====
      {
        id_loai_bai_viet: categoryMap['Cộng Đồng'],
        tieu_de: 'Bean & Brew Đồng Hành Cùng Người Nông Dân Buôn Ma Thuột',
        slug: 'bean-brew-dong-hanh-nong-dan-buon-ma-thuot',
        noi_dung: `<p>Tây Nguyên — vùng đất đỏ bazan màu mỡ — là cái nôi của ngành cà phê Việt Nam. Và chính những người nông dân tại đây đang viết nên câu chuyện về hạt cà phê mà bạn thưởng thức mỗi ngày.</p>
<h2>Dự Án Cà Phê Bền Vững 2025</h2>
<p>Bean & Brew triển khai chương trình hợp tác với hơn <strong>200 hộ nông dân</strong> tại Buôn Ma Thuột và Lâm Đồng theo mô hình <em>Direct Trade</em> — mua trực tiếp từ nông dân với giá cao hơn thị trường 15–20%, đảm bảo thu nhập ổn định cho họ.</p>
<h2>Quy Trình Truy Xuất Nguồn Gốc</h2>
<p>Mỗi túi cà phê Bean & Brew đều có mã QR truy xuất nguồn gốc: tên vườn, độ cao trồng, phương pháp chế biến và ngày thu hái. Bạn biết chính xác hạt cà phê từ đâu đến!</p>
<h2>Tác Động Thực Tế</h2>
<ul>
<li>200+ hộ gia đình có thu nhập ổn định</li>
<li>Giảm 40% lượng thuốc trừ sâu sử dụng</li>
<li>Hỗ trợ 50 con em nông dân học bổng hàng năm</li>
</ul>
<p>Khi bạn chọn Bean & Brew, bạn không chỉ chọn cà phê ngon — bạn đang góp phần xây dựng tương lai bền vững cho những người nông dân Tây Nguyên.</p>`,
        hinh: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      },
      {
        id_loai_bai_viet: categoryMap['Cộng Đồng'],
        tieu_de: 'Cuộc Thi Pha Chế "Hương Vị Việt" – Tìm Kiếm Tài Năng Barista',
        slug: 'cuoc-thi-pha-che-huong-vi-viet-2025',
        noi_dung: `<p>Bean & Brew tự hào thông báo cuộc thi pha chế cà phê thường niên <strong>"Hương Vị Việt 2025"</strong> — sân chơi dành cho những người đam mê cà phê trên khắp cả nước!</p>
<h2>Thông Tin Cuộc Thi</h2>
<ul>
<li><strong>Thời gian:</strong> 15/08 – 30/08/2025</li>
<li><strong>Địa điểm:</strong> TP. Hồ Chí Minh, Hà Nội, Đà Nẵng</li>
<li><strong>Đối tượng:</strong> Tất cả mọi người — không cần chuyên nghiệp</li>
</ul>
<h2>Thể Lệ</h2>
<p>Thí sinh tạo ra một món đồ uống cà phê sáng tạo lấy cảm hứng từ văn hóa Việt Nam. Thời gian pha chế tối đa 15 phút. Ban giám khảo gồm các chuyên gia Q Grader và barista champion quốc tế.</p>
<h2>Giải Thưởng Hấp Dẫn</h2>
<ul>
<li>🥇 Giải Nhất: 20.000.000 VNĐ + Khóa học barista tại Ý</li>
<li>🥈 Giải Nhì: 10.000.000 VNĐ</li>
<li>🥉 Giải Ba: 5.000.000 VNĐ</li>
</ul>
<p>Đăng ký ngay tại website hoặc cửa hàng Bean & Brew gần nhất. Số lượng có hạn!</p>`,
        hinh: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      },

      // ===== KHUYẾN MÃI =====
      {
        id_loai_bai_viet: categoryMap['Khuyến Mãi & Sự Kiện'],
        tieu_de: 'Ưu Đãi Đặc Biệt Mừng Sinh Nhật Bean & Brew – Giảm 30%',
        slug: 'uu-dai-mung-sinh-nhat-bean-brew-giam-30',
        noi_dung: `<p>Nhân kỷ niệm <strong>5 năm thành lập</strong>, Bean & Brew gửi đến khách hàng thân yêu chương trình ưu đãi đặc biệt nhất từ trước đến nay!</p>
<h2>🎉 Ưu Đãi Sinh Nhật</h2>
<ul>
<li><strong>Giảm 30%</strong> toàn bộ sản phẩm cà phê rang xay</li>
<li><strong>Miễn phí vận chuyển</strong> đơn hàng từ 200.000 VNĐ toàn quốc</li>
<li><strong>Quà tặng</strong> phin cà phê cao cấp cho 100 đơn hàng đầu tiên mỗi ngày</li>
</ul>
<h2>Thời Gian Áp Dụng</h2>
<p>Từ ngày <strong>01/07 – 15/07/2025</strong>. Áp dụng khi mua online tại website và app Bean & Brew, hoặc tại tất cả cửa hàng trên toàn quốc.</p>
<h2>Cách Nhận Ưu Đãi</h2>
<ol>
<li>Đăng nhập tài khoản Bean & Brew</li>
<li>Thêm sản phẩm vào giỏ hàng</li>
<li>Nhập mã: <strong>BIRTHDAY30</strong> khi thanh toán</li>
</ol>
<p>Đừng bỏ lỡ cơ hội hiếm có này — chia sẻ ngay với bạn bè và gia đình để cùng tận hưởng!</p>`,
        hinh: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      },
      {
        id_loai_bai_viet: categoryMap['Khuyến Mãi & Sự Kiện'],
        tieu_de: 'Ra Mắt Dòng Sản Phẩm Cà Phê Specialty Mới – Giới Hạn 500 Hộp',
        slug: 'ra-mat-dong-ca-phe-specialty-gioi-han',
        noi_dung: `<p>Bean & Brew hân hạnh giới thiệu dòng sản phẩm <strong>Specialty Collection 2025</strong> — những hạt cà phê đặc biệt nhất được tuyển chọn từ các vùng trồng danh tiếng.</p>
<h2>Bộ Sưu Tập Gồm 3 Dòng</h2>
<h3>1. Cầu Đất Geisha – Lâm Đồng</h3>
<p>Hương hoa nhài, chanh bergamot và đào chín. Điểm cupping 88/100. Rang Light để giữ trọn hương hoa.</p>
<h3>2. Buôn Ma Thuột Natural – Đắk Lắk</h3>
<p>Chế biến natural, vị socola đen, cherry và caramel. Rang Medium Dark. Điểm cupping 86/100.</p>
<h3>3. Mộc Châu Honey Process – Sơn La</h3>
<p>Chế biến honey, vị mật ong, vải thiều và cam quýt. Rang Medium. Điểm cupping 87/100.</p>
<h2>⚠️ Số Lượng Có Hạn</h2>
<p>Mỗi dòng chỉ có <strong>500 hộp</strong> — khi hết không sản xuất thêm. Đặt hàng trước tại website để đảm bảo suất của bạn!</p>
<p>Mỗi hộp đi kèm thẻ truy xuất nguồn gốc và hướng dẫn pha chế từ chuyên gia Q Grader của Bean & Brew.</p>`,
        hinh: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=900',
        an_hien: 1
      }
    ];

    let inserted = 0;
    for (const art of articles) {
      const [existing] = await db.query(`SELECT * FROM bai_viet WHERE slug = '${art.slug}'`);
      if (existing.length === 0) {
        await db.query(
          `INSERT INTO bai_viet (id_loai_bai_viet, tieu_de, slug, noi_dung, hinh, luot_xem, an_hien, ngay_dang) 
           VALUES (${art.id_loai_bai_viet || 1}, '${art.tieu_de.replace(/'/g, "\\'")}', '${art.slug}', '${art.noi_dung.replace(/'/g, "\\'")}', '${art.hinh}', ${Math.floor(Math.random()*500+100)}, ${art.an_hien}, NOW())`
        );
        inserted++;
        console.log(`✅ Đã chèn: "${art.tieu_de}"`);
      } else {
        console.log(`⏭️  Đã tồn tại: "${art.tieu_de}"`);
      }
    }

    console.log(`\n🎉 Hoàn tất! Đã chèn ${inserted} bài viết mới.`);
  } catch (err) {
    console.error('❌ Lỗi:', err);
  } finally {
    process.exit(0);
  }
}
seedNews();
