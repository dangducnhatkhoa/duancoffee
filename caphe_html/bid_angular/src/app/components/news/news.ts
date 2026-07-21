import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteService } from '../../services/site-service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.html',
})
export class NewsComponent implements OnInit {
  articles: any[] = [];

  fallbackArticles = [
    {
      id: 1,
      tieu_de: 'Bí Quyết Pha Cà Phê Phin Ngon Chuẩn Vị Truyền Thống',
      noi_dung: 'Nước pha cà phê phải sôi ở 95-100 độ C. Tráng phin bằng nước nóng trước khi pha sẽ giúp cà phê nở đều và chiết xuất tốt hơn. Sử dụng cà phê nguyên chất rang vừa, xay mịn vừa phải...',
      hinh: 'https://images.unsplash.com/photo-1495474472202-4affb9442b08?auto=format&fit=crop&w=600&q=80',
      ngay_dang: new Date()
    },
    {
      id: 2,
      tieu_de: 'Uống 1 Ly Cà Phê Mỗi Ngày Mang Lại Lợi Ích Gì?',
      noi_dung: 'Cà phê không chỉ giúp tỉnh táo mà còn chứa nhiều chất chống oxy hóa, hỗ trợ quá trình trao đổi chất và bảo vệ sức khỏe tim mạch khi thưởng thức đúng cách...',
      hinh: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80',
      ngay_dang: new Date()
    },
    {
      id: 3,
      tieu_de: 'Bean & Brew Đồng Hành Cùng Người Nông Dân Buôn Ma Thuột',
      noi_dung: 'Dự án hỗ trợ phát triển nông nghiệp bền vững, mang lại sinh kế ổn định cho các hộ gia đình trồng cà phê tại vùng Tây Nguyên...',
      hinh: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80',
      ngay_dang: new Date()
    }
  ];

  constructor(
    public siteService: SiteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  async loadArticles() {
    try {
      const res: any = await this.siteService.getArticles();
      console.log('Articles response:', res);
      if (res && res.success && res.data && res.data.length > 0) {
        this.articles = res.data;
      } else {
        this.articles = this.fallbackArticles;
      }
    } catch (error) {
      console.error('Error loading articles', error);
      this.articles = this.fallbackArticles;
    } finally {
      this.cdr.detectChanges();
    }
  }

  getImageUrl(hinh: string): string {
    if (!hinh) return 'https://images.unsplash.com/photo-1495474472202-4affb9442b08?auto=format&fit=crop&w=600&q=80';
    if (hinh.startsWith('http')) return hinh;
    return `https://duancoffee-bcu2.vercel.app/images/${hinh}`;
  }
}

