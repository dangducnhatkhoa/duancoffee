import { Component, signal } from '@angular/core';
import { SiteService } from '../../services/site-service';
import { ICategory, IProduct } from '../../models/data.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    public site: SiteService,
    public cart: CartService,
    private router: Router
  ) {}

  category_arr = signal<ICategory[]>([]);
  featured_arr = signal<IProduct[]>([]);
  popular_arr = signal<IProduct[]>([]);
  auction_arr = signal<any[]>([]);
  articles_arr = signal<any[]>([]);

  // Search feature properties
  searchKeyword: string = '';
  suggestions = signal<IProduct[]>([]);
  showSuggestions: boolean = false;
  isSearching: boolean = false;
  popularTags: string[] = ['Cà phê hòa tan', 'Highlands', 'Arabica', 'Phúc Long', 'Nescafe', 'King Coffee'];

  // Fallback articles khi API chưa có dữ liệu
  fallback_articles = [
    {
      id: null,
      tieu_de: 'Bí Quyết Pha Cà Phê Phin Ngon Chuẩn Vị Truyền Thống',
      loai: 'KIẾN THỨC',
      mo_ta: 'Nước pha cà phê phải sôi ở 95-100 độ C. Tráng phin bằng nước nóng trước khi pha sẽ giúp cà phê nở đều và chiết xuất tốt hơn...',
      hinh: 'https://images.unsplash.com/photo-1495474472202-4affb9442b08?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: null,
      tieu_de: 'Uống 1 Ly Cà Phê Mỗi Ngày Mang Lại Lợi Ích Gì?',
      loai: 'SỨC KHỎE',
      mo_ta: 'Cà phê không chỉ giúp tỉnh táo mà còn chứa nhiều chất chống oxy hóa, hỗ trợ quá trình trao đổi chất và bảo vệ sức khỏe tim mạch...',
      hinh: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: null,
      tieu_de: 'Bean & Brew Đồng Hành Cùng Người Nông Dân Buôn Ma Thuột',
      loai: 'CỘNG ĐỒNG',
      mo_ta: 'Dự án hỗ trợ phát triển nông nghiệp bền vững, mang lại sinh kế ổn định cho các hộ gia đình trồng cà phê tại vùng Tây Nguyên...',
      hinh: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80'
    }
  ];

  async ngOnInit() { 
    const resCategories = await this.site.getCategories();
    this.category_arr.set((resCategories.data || []) as ICategory[]);

    const resFeatured = await this.site.getFeaturedProducts(8);
    this.featured_arr.set((resFeatured.data || []) as IProduct[]);

    // Tải danh sách sản phẩm xem nhiều nhất
    try {
      const resPopular = await this.site.getPopularProducts(5);
      this.popular_arr.set((resPopular.data || []) as IProduct[]);
    } catch (e) {
      console.error('Error loading popular products:', e);
    }

    // Load bài viết từ API
    try {
      const resArticles: any = await this.site.getArticles();
      if (resArticles.success && resArticles.data?.length > 0) {
        this.articles_arr.set(resArticles.data.slice(0, 3));
      }
    } catch (e) {
      // Nếu API lỗi thì dùng fallback
    }
  } 

  async onSearchInput() {
    const q = this.searchKeyword.trim();
    if (q.length >= 2) {
      this.isSearching = true;
      try {
        const res: any = await this.site.getProductsWithKeyword(q, 1, 5);
        this.suggestions.set((res.data || []) as IProduct[]);
        this.showSuggestions = true;
      } catch (err) {
        this.suggestions.set([]);
      } finally {
        this.isSearching = false;
      }
    } else {
      this.suggestions.set([]);
      this.showSuggestions = false;
    }
  }

  onSearchSubmit() {
    const q = this.searchKeyword.trim();
    if (q) {
      this.showSuggestions = false;
      this.router.navigate(['/search'], { queryParams: { keyword: q } });
    }
  }

  selectTag(tag: string) {
    this.searchKeyword = tag;
    this.onSearchSubmit();
  }

  hideSuggestions() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  addToCart(product: any) {
    const variantId = product.variants?.[0]?.id;
    this.cart.addToCart(product.id, variantId);
  }

  getExcerpt(html: string, maxLen = 120): string {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
  }
}
