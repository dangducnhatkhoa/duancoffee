import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

interface PolicyPage {
  title: string;
  category: string;
  content: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './support.html',
})
export class SupportComponent implements OnInit {
  currentSlug: string = '';
  currentPage: PolicyPage | null = null;

  pages: Record<string, PolicyPage> = {
    'the-le-dieu-kien': {
      title: 'Thể lệ và Điều kiện giao dịch',
      category: 'Chính Sách & Quy Định',
      content: `
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">1. Chấp thuận các điều kiện sử dụng</h3>
        <p class="mb-4">Chào mừng bạn đến với King Coffee. Khi bạn truy cập và sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các thể lệ và điều kiện dưới đây. Vui lòng đọc kỹ trước khi thực hiện giao dịch.</p>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">2. Tài khoản người dùng</h3>
        <p class="mb-4">Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. King Coffee không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc bạn không bảo mật thông tin tài khoản.</p>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">3. Quy định thanh toán</h3>
        <p class="mb-4">Chúng tôi hỗ trợ các phương thức thanh toán trực tuyến bảo mật bao gồm SePay chuyển khoản ngân hàng, ví MoMo, thẻ nội địa và quốc tế. Người mua cần cung cấp thông tin giao dịch chính xác.</p>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">4. Giới hạn trách nhiệm</h3>
        <p class="mb-4">King Coffee luôn cam kết cung cấp sản phẩm chất lượng nhất. Tuy nhiên, trong trường hợp xảy ra sự cố bất khả kháng hoặc lỗi kỹ thuật ngoài tầm kiểm soát, chúng tôi sẽ xử lý theo quy trình thương lượng và bồi thường hợp lý nhất cho khách hàng.</p>
      `
    },
    'chinh-sach-bao-mat': {
      title: 'Chính sách Bảo mật Thông tin',
      category: 'Chính Sách & Quy Định',
      content: `
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">1. Mục đích thu thập dữ liệu</h3>
        <p class="mb-4">Chúng tôi thu thập các thông tin cá nhân của bạn như Họ tên, Số điện thoại, Địa chỉ giao hàng và Email nhằm phục vụ cho mục đích xử lý đơn hàng, giao hàng và chăm sóc khách hàng sau mua.</p>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">2. Phạm vi sử dụng thông tin</h3>
        <p class="mb-4">Thông tin cá nhân chỉ được sử dụng nội bộ trong hệ thống King Coffee và các đối tác vận chuyển liên kết trực tiếp để thực hiện giao nhận đơn hàng.</p>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">3. Cam kết bảo mật</h3>
        <p class="mb-4">Chúng tôi áp dụng các công nghệ mã hóa tiên tiến để đảm bảo thông tin cá nhân của bạn không bị rò rỉ, đánh cắp hoặc sử dụng sai mục đích. King Coffee tuyệt đối không mua bán hay chia sẻ thông tin khách hàng cho bên thứ ba vì mục đích thương mại.</p>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">4. Quyền lợi của khách hàng</h3>
        <p class="mb-4">Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản cá nhân trên trang web hoặc liên hệ trực tiếp với bộ phận hỗ trợ khách hàng của chúng tôi.</p>
      `
    },
    'chinh-sach-doi-tra': {
      title: 'Chính sách Đổi trả & Hoàn tiền',
      category: 'Chính Sách & Quy Định',
      content: `
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">1. Thời hạn đổi trả sản phẩm</h3>
        <p class="mb-4">Khách hàng có quyền yêu cầu đổi trả sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng thực tế thành công.</p>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">2. Điều kiện đổi trả hàng</h3>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng và bao bì không bị rách, hư hại.</li>
          <li>Sản phẩm phát sinh lỗi từ phía nhà sản xuất (hương vị lạ, ẩm mốc trước hạn sử dụng, đóng gói sai quy cách).</li>
          <li>Đơn hàng bị giao sai mẫu mã hoặc thiếu số lượng sản phẩm so với đơn hàng đã đặt.</li>
        </ul>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">3. Quy trình hoàn tiền</h3>
        <p class="mb-4">Ngay sau khi sản phẩm hoàn trả được nhân viên King Coffee tiếp nhận và kiểm tra đáp ứng điều kiện đổi trả, chúng tôi sẽ tiến hành hoàn tiền qua số tài khoản ngân hàng của bạn trong vòng 3 - 5 ngày làm việc.</p>
      `
    },
    'chinh-sach-giao-hang': {
      title: 'Chính sách Vận chuyển & Giao nhận',
      category: 'Chính Sách & Quy Định',
      content: `
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">1. Thời gian giao hàng dự kiến</h3>
        <ul class="list-disc pl-5 mb-4 space-y-2">
          <li><strong>Khu vực nội thành (TP.HCM / Hà Nội):</strong> 1 - 2 ngày làm việc.</li>
          <li><strong>Khu vực ngoại thành & Các tỉnh thành khác:</strong> 3 - 5 ngày làm việc.</li>
        </ul>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">2. Phí vận chuyển áp dụng</h3>
        <p class="mb-4">Phí vận chuyển mặc định là 35.000đ cho đơn hàng dưới 1.500.000đ. Đơn hàng từ 1.500.000đ trở lên sẽ được <strong>miễn phí hoàn toàn phí vận chuyển</strong> trên toàn quốc.</p>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">3. Kiểm tra hàng trước khi nhận (Đồng kiểm)</h3>
        <p class="mb-4">Khách hàng được quyền mở hộp kiểm tra số lượng và quy cách sản phẩm cùng nhân viên giao nhận trước khi thanh toán hoặc ký nhận đơn hàng.</p>
      `
    },
    'faq': {
      title: 'Câu hỏi thường gặp (FAQ)',
      category: 'Hỗ Trợ Khách Hàng',
      content: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-[#2C1A0E] text-base mb-2">Q1: Tôi có thể hủy đơn hàng sau khi đặt không?</h4>
            <p class="text-[#5A4A3A]">A: Có, bạn hoàn toàn có thể tự hủy đơn hàng trực tiếp trong trang quản lý Lịch sử mua hàng cá nhân nếu đơn hàng đang ở trạng thái Chờ xử lý (Pending). Trong trường hợp đơn đã được bàn giao đối tác giao hàng, vui lòng liên hệ hotline 1800 599 9999 để được hỗ trợ.</p>
          </div>
          <div class="border-t border-[#EDE5D8] pt-4">
            <h4 class="font-bold text-[#2C1A0E] text-base mb-2">Q2: Cà phê King Coffee có hạn sử dụng trong bao lâu?</h4>
            <p class="text-[#5A4A3A]">A: Hạn sử dụng của tất cả các dòng sản phẩm cà phê hạt rang xay, cà phê phin giấy và cà phê hòa tan là 2 năm tính từ ngày sản xuất in trên bao bì.</p>
          </div>
          <div class="border-t border-[#EDE5D8] pt-4">
            <h4 class="font-bold text-[#2C1A0E] text-base mb-2">Q3: Cửa hàng có xuất hóa đơn giá trị gia tăng (VAT) không?</h4>
            <p class="text-[#5A4A3A]">A: Có, King Coffee hỗ trợ xuất hóa đơn điện tử cho khách hàng cá nhân hoặc doanh nghiệp. Vui lòng điền thông tin xuất hóa đơn tại ghi chú thanh toán hoặc gửi thông tin trực tiếp cho hỗ trợ trực tuyến.</p>
          </div>
        </div>
      `
    },
    'huong-dan-dat-hang': {
      title: 'Hướng dẫn Mua hàng Online',
      category: 'Hỗ Trợ Khách Hàng',
      content: `
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">Các bước đặt hàng trực tuyến đơn giản:</h3>
        <ol class="list-decimal pl-5 mb-4 space-y-4 text-[#5A4A3A]">
          <li>
            <strong>Bước 1: Tìm kiếm sản phẩm:</strong>
            <p class="mt-1 text-sm">Truy cập trang chủ hoặc mục Sản Phẩm, sử dụng thanh tìm kiếm thông minh hoặc các bộ lọc danh mục để chọn sản phẩm yêu thích.</p>
          </li>
          <li>
            <strong>Bước 2: Thêm vào Giỏ hàng:</strong>
            <p class="mt-1 text-sm">Chọn quy cách đóng gói (nếu có), nhập số lượng cần mua rồi bấm "MUA NGAY" hoặc "THÊM VÀO GIỎ HÀNG".</p>
          </li>
          <li>
            <strong>Bước 3: Nhập thông tin thanh toán:</strong>
            <p class="mt-1 text-sm">Vào giỏ hàng bấm Tiến hành thanh toán. Nhập chính xác Họ tên, Số điện thoại và Địa chỉ nhận hàng.</p>
          </li>
          <li>
            <strong>Bước 4: Sử dụng Voucher & Chọn thanh toán:</strong>
            <p class="mt-1 text-sm">Nhập mã giảm giá (nếu có) để hưởng ưu đãi. Chọn phương thức thanh toán chuyển khoản SePay hoặc Stripe/Thẻ ngân hàng rồi bấm Hoàn tất đặt hàng.</p>
          </li>
        </ol>
      `
    },
    'theo-doi-don-hang': {
      title: 'Hướng dẫn Theo dõi Trạng thái Đơn hàng',
      category: 'Hỗ Trợ Khách Hàng',
      content: `
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">Theo dõi đơn hàng qua tài khoản thành viên:</h3>
        <p class="mb-4">Khách hàng có thể dễ dàng kiểm tra trạng thái đơn hàng của mình bất kỳ lúc nào bằng cách:</p>
        <ol class="list-decimal pl-5 mb-6 space-y-3 text-[#5A4A3A]">
          <li>Đăng nhập tài khoản cá nhân trên góc phải màn hình trang chủ.</li>
          <li>Bấm chọn mục <strong>"Lịch sử đơn hàng"</strong> hoặc vào trang Hồ sơ cá nhân.</li>
          <li>Tại đây, bạn sẽ thấy toàn bộ danh sách đơn hàng đã mua kèm trạng thái xử lý thời gian thực: <strong>Chờ xử lý, Đang giao hàng, Đã giao thành công, Đã hủy</strong>.</li>
        </ol>
        
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">Theo dõi đơn hàng khi mua không đăng nhập:</h3>
        <p class="mb-4">Khi đặt hàng thành công, hệ thống sẽ gửi một mã đơn hàng định dạng <code>ORD-xxxxxx</code> và email xác nhận tự động. Bạn có thể sử dụng mã đơn hàng này nhắn tin hỗ trợ trực tiếp để nhân viên tổng đài tra cứu nhanh hành trình vận đơn giúp bạn.</p>
      `
    },
    'lien-he-ho-tro': {
      title: 'Thông tin Liên hệ Hỗ trợ Khách hàng',
      category: 'Hỗ Trợ Khách Hàng',
      content: `
        <h3 class="text-xl font-bold text-[#2C1A0E] mb-4">Kênh liên hệ khẩn cấp 24/7</h3>
        <p class="mb-6">Nếu bạn cần hỗ trợ nhanh về kỹ thuật, đổi trả sản phẩm hoặc khiếu nại chất lượng dịch vụ, vui lòng liên lạc với chúng tôi qua các kênh chính thức sau:</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="bg-[#FAF7F3] p-4 rounded border border-[#EDE5D8] text-center">
            <i class="fas fa-phone-alt text-2xl text-[#C8572C] mb-2"></i>
            <h4 class="font-bold text-[#2C1A0E]">Tổng đài miễn phí</h4>
            <p class="text-sm text-gray-500 mt-1">1800 599 9999</p>
          </div>
          <div class="bg-[#FAF7F3] p-4 rounded border border-[#EDE5D8] text-center">
            <i class="fas fa-envelope text-2xl text-[#C8572C] mb-2"></i>
            <h4 class="font-bold text-[#2C1A0E]">Email hỗ trợ</h4>
            <p class="text-sm text-gray-500 mt-1">support@kingcoffee.com</p>
          </div>
        </div>
        
        <p class="mb-4">Hoặc bạn có thể truy cập trang <a routerLink="/contact" class="text-[#C8572C] font-semibold underline hover:text-[#A6411B]">Liên hệ trực tiếp</a> để điền form gửi thắc mắc của bạn về bộ phận chuyên môn xử lý.</p>
      `
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentSlug = params.get('slug') || 'the-le-dieu-kien';
      this.currentPage = this.pages[this.currentSlug] || this.pages['the-le-dieu-kien'];
    });
  }
}
