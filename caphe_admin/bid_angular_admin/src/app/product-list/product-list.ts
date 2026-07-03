import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product-service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products = signal<any[]>([]);
  page = signal(1);
  total = signal(0);
  totalPages = signal(0);
  search = signal('');
  loading = signal(true);

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(async (params) => {
      this.page.set(Number(params.get('page')) || 1);
      this.search.set(params.get('search') || '');
      await this.loadProducts();
    });
  }

  async loadProducts() {
    this.loading.set(true);
    try {
      const res: any = await this.productService.getAll(this.page(), 10, this.search());
      this.products.set(res.data || []);
      this.total.set(res.pagination?.total || 0);
      this.totalPages.set(res.pagination?.totalPages || 0);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteProduct(id: number) {
    if (!confirm('Xác nhận xóa sản phẩm này?')) {
      return;
    }
    try {
      await this.productService.delete(id);
      await this.loadProducts();
    } catch (error: any) {
      console.error('Lỗi xóa:', error);
      alert(error.error?.message || 'Xóa sản phẩm thất bại');
    }
  }

  productImage(p: any): string {
    const img = p.images?.[0]?.image_url || p.hinh_anh || p.image;
    if (!img) return 'https://placehold.co/60x60/6F4E37/FFFFFF?text=Coffee';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/images/')) return `https://duancoffee-bcu2.vercel.app${img}`;
    if (img.startsWith('images/')) return `https://duancoffee-bcu2.vercel.app/${img}`;
    return `https://duancoffee-bcu2.vercel.app/images/products/${img}`;
  }

  tempSearch = '';

  onSearchChange(event: Event) {
    this.tempSearch = (event.target as HTMLInputElement).value;
  }

  submitSearch() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.tempSearch || null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: p },
      queryParamsHandling: 'merge',
    });
  }
}
