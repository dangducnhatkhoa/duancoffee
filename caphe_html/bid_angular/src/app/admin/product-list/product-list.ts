import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminProductService } from '../services/admin-product.service';
import { SiteService } from '../../services/site-service';

const STATUS_MAP: Record<string, string> = {
  con_hang: 'Đang bán',
  ngung_kinh_doanh: 'Ngừng KD',
  an: 'Ẩn',
};

@Component({
  selector: 'app-admin-product-list',
  imports: [CommonModule, RouterLink, DecimalPipe, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class AdminProductList implements OnInit {
  products = signal<any[]>([]);
  stats = signal<any>(null);
  categories = signal<any[]>([]);
  brands = signal<any[]>([]);
  page = signal(1);
  total = signal(0);
  totalPages = signal(0);
  search = signal('');
  categoryId = signal('');
  brandId = signal('');
  status = signal('');
  trash = signal(false);
  loading = signal(true);
  stockModal = signal<any>(null);
  stockQty = signal(0);
  stockMode = signal<'set' | 'add'>('add');

  readonly statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'con_hang', label: 'Đang bán' },
    { value: 'ngung_kinh_doanh', label: 'Ngừng kinh doanh' },
    { value: 'an', label: 'Ẩn' },
  ];

  constructor(
    private productService: AdminProductService,
    private site: SiteService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadMeta();
    this.route.queryParamMap.subscribe(() => this.loadProducts());
  }

  async loadMeta() {
    const [catRes, brandRes, statsRes] = await Promise.all([
      this.productService.getCategories(),
      this.productService.getBrands(),
      this.productService.getStats(),
    ]);
    this.categories.set(catRes?.data || catRes || []);
    this.brands.set(brandRes?.data || []);
    this.stats.set(statsRes?.data || null);
  }

  async loadProducts() {
    const params = this.route.snapshot.queryParamMap;
    this.page.set(Number(params.get('page')) || 1);
    this.search.set(params.get('search') || '');
    this.categoryId.set(params.get('category_id') || '');
    this.brandId.set(params.get('brand_id') || '');
    this.status.set(params.get('status') || '');
    this.trash.set(params.get('trash') === '1');
    this.loading.set(true);
    try {
      const res = await this.productService.getAll({
        page: this.page(),
        limit: 10,
        search: this.search(),
        category_id: this.categoryId(),
        brand_id: this.brandId(),
        status: this.status(),
        trash: this.trash() ? '1' : '0',
      });
      this.products.set(res.data || []);
      this.total.set(res.pagination?.total || 0);
      this.totalPages.set(res.pagination?.totalPages || 0);
    } finally {
      this.loading.set(false);
    }
  }

  applyFilters() {
    this.router.navigate(['/admin/product'], {
      queryParams: {
        page: 1,
        search: this.search() || null,
        category_id: this.categoryId() || null,
        brand_id: this.brandId() || null,
        status: this.status() || null,
        trash: this.trash() ? '1' : null,
      },
    });
  }

  switchTab(trash: boolean) {
    this.trash.set(trash);
    this.applyFilters();
  }

  pagesToShow() {
    const pages = [];
    const start = Math.max(1, this.page() - 2);
    const end = Math.min(this.totalPages(), this.page() + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  statusLabel(s: string) {
    const status = s === 'het_hang' ? 'con_hang' : s;
    return STATUS_MAP[status] || status || 'Đang bán';
  }

  statusClass(p: any): string {
    const status = p.status === 'het_hang' ? 'con_hang' : p.status;
    if (!p.featured) return 'badge-gray';
    if (status === 'ngung_kinh_doanh' || status === 'an') return 'badge-gray';
    if (p.stock <= 10 && p.stock > 0) return 'badge-yellow';
    return 'badge-green';
  }

  productImage(p: any): string {
    const raw = p.primary_image
      || p.images?.find((img: any) => img.display_order === 1)?.image_url
      || p.images?.[0]?.image_url
      || p.image;
    return this.site.formatImageUrl(raw);
  }

  discountPercent(p: any): number {
    return p.discount_percent || 0;
  }

  async xoaMem(id: number) {
    if (!confirm('Chuyển sản phẩm vào thùng rác?')) return;
    await this.productService.softDelete(id);
    this.loadProducts();
    this.loadMeta();
  }

  async khoiPhuc(id: number) {
    await this.productService.restore(id);
    this.loadProducts();
    this.loadMeta();
  }

  async xoaVinhVien(id: number) {
    if (!confirm('Xóa vĩnh viễn? Không thể hoàn tác!')) return;
    await this.productService.forceDelete(id);
    this.loadProducts();
    this.loadMeta();
  }

  openStockModal(p: any) {
    this.stockModal.set(p);
    this.stockQty.set(0);
    this.stockMode.set('add');
  }

  closeStockModal() {
    this.stockModal.set(null);
  }

  async saveStock() {
    const p = this.stockModal();
    if (!p) return;
    await this.productService.updateStock(p.id, this.stockQty(), this.stockMode());
    this.closeStockModal();
    this.loadProducts();
  }
}
