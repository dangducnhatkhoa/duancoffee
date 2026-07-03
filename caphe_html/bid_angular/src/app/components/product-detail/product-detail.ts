import { Component, signal } from '@angular/core';
import { SiteService } from '../../services/site-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail {
  constructor(
    public site: SiteService, 
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService
  ){}

  id:number= 0; //id sản phẩm
  product = signal<any>({} );
  mainImage = signal(""); // ảnh chính hiển thị
  products_related = signal<any[]>([]);
  quantity = signal(1);
  selectedThumbIndex = signal(0);
  selectedVariantIndex = signal(-1);
  currentVariant = signal<any>(null);
  currentPrice = signal(0);
  minPrice = signal(0);
  maxPrice = signal(0);

  isLoggedIn = signal(false);
  alreadyReviewed = signal(false);
  reviewRating = signal(5);
  reviewText = signal('');
  submittingReview = signal(false);
  reviewMessage = signal('');
  reviewError = signal(false);

  async ngOnInit(){
    this.route.paramMap.subscribe(async (params) => {
      this.id = Number(params.get('id')) || -1;
      await this.loadProduct();
    });
  }

  async loadProduct() {
    try {
      const resProduct = await this.site.getProduct(this.id);
      this.product.set(resProduct.data);
      this.mainImage.set(this.site.getPrimaryImage(this.product()));
      this.selectedThumbIndex.set(0);
      this.quantity.set(1);

      if (this.product()?.variants && this.product().variants.length > 0) {
        const prices = this.product().variants.map((v:any) => parseFloat(v.variant_price) || 0);
        this.minPrice.set(Math.min(...prices));
        this.maxPrice.set(Math.max(...prices));
        this.selectedVariantIndex.set(-1);
        this.currentVariant.set(null);
        this.currentPrice.set(0);
      } else {
        this.minPrice.set(this.product().fixed_price);
        this.maxPrice.set(this.product().fixed_price);
        this.currentVariant.set(null);
        this.currentPrice.set(this.product().fixed_price);
      }

      const category_id = this.product().category_id;
      const resRelatedProducts = await this.site.getRelatedProducts(category_id, 4);
      const related = (resRelatedProducts.data || []).filter((p: any) => p.id !== this.id);
      this.products_related.set(related.slice(0, 4));

      await this.loadReviewStatus();
    } catch (e) {
      console.error('Error loading product:', e);
    }
  }

  async loadReviewStatus() {
    this.isLoggedIn.set(this.site.isLoggedIn());
    this.alreadyReviewed.set(false);

    if (!this.isLoggedIn()) return;

    try {
      const res = await this.site.getMyReviewStatus(this.id);
      this.alreadyReviewed.set(!!res.data?.alreadyReviewed);
    } catch (e: any) {
      if (e?.status === 404) {
        this.reviewError.set(true);
        this.reviewMessage.set(
          'API đánh giá chưa có trên server. Deploy backend mới lên Vercel, hoặc bật USE_LOCAL_API trong cauhinh.ts và chạy backend local.'
        );
      }
    }
  }

  changeImage(index: number) {
    const allImages = this.getAllImages();
    if (allImages && allImages[index]) {
      this.mainImage.set(allImages[index]);
      this.selectedThumbIndex.set(index);
    }
  }

  selectVariant(index: number) {
    this.selectedVariantIndex.set(index);
    const variant = this.product().variants[index];
    this.currentVariant.set(variant);
    this.currentPrice.set(variant.variant_price || this.product().fixed_price);
  }

  getAllImages(): string[] {
    const product = this.product();
    let urls = [];
    if (product?.images && product.images.length > 0) {
      urls = product.images.map((img: any) => this.site.formatImageUrl(img.image_url)).filter((url: string) => !!url);
    }
    // "thêm 3 ảnh con nữa" theo yêu cầu
    while (urls.length < 4 && urls.length > 0) {
      urls.push(urls[0]); // Duplicate primary if missing
    }
    return urls;
  }

  increaseQty() {
    if (this.quantity() < 10) this.quantity.set(this.quantity() + 1);
  }

  decreaseQty() {
    if (this.quantity() > 1) this.quantity.set(this.quantity() - 1);
  }

  addToCart() {
    const product = this.product();
    if (product?.variants && product.variants.length > 0 && this.selectedVariantIndex() === -1) {
      alert('Vui lòng chọn quy cách sản phẩm!');
      return;
    }
    const variantId = this.currentVariant()?.id || product.variants?.[0]?.id;
    for (let i = 0; i < this.quantity(); i++) {
      this.cart.addToCart(product.id, variantId);
    }
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getStarType(starIndex: number, rating: number | string): 'full' | 'half' | 'empty' {
    const r = parseFloat(String(rating)) || 0;
    if (r >= starIndex) return 'full';
    if (r >= starIndex - 0.5) return 'half';
    return 'empty';
  }

  getRatingBreakdown(): { star: number; count: number; percent: number }[] {
    const reviews = this.product()?.reviews || [];
    const total = reviews.length;
    return [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter((r: any) => r.rating === star).length;
      return { star, count, percent: total > 0 ? (count / total) * 100 : 0 };
    });
  }

  getReviewerName(review: any): string {
    return review?.reviewer?.full_name || 'Khách hàng';
  }

  getReviewerInitials(review: any): string {
    const name = this.getReviewerName(review);
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getAvatarUrl(url?: string): string {
    return this.site.formatImageUrl(url);
  }

  scrollToReviews() {
    document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToLogin() {
    this.router.navigate(['/users/login'], { state: { back: `/product/${this.id}` } });
  }

  setReviewRating(star: number) {
    this.reviewRating.set(star);
  }

  isReviewStarFilled(star: number): boolean {
    return star <= this.reviewRating();
  }

  async submitReview() {
    if (!this.isLoggedIn()) {
      this.goToLogin();
      return;
    }

    if (this.alreadyReviewed()) {
      this.reviewError.set(true);
      this.reviewMessage.set('Bạn đã đánh giá sản phẩm này rồi');
      return;
    }

    if (!this.reviewRating()) {
      this.reviewError.set(true);
      this.reviewMessage.set('Vui lòng chọn số sao đánh giá');
      return;
    }

    this.submittingReview.set(true);
    this.reviewMessage.set('');
    this.reviewError.set(false);

    try {
      const res = await this.site.submitReview({
        product_id: this.id,
        rating: this.reviewRating(),
        review_text: this.reviewText().trim()
      });

      if (res.success) {
        this.reviewError.set(false);
        this.reviewMessage.set(res.message || 'Đánh giá đã được gửi thành công');
        this.reviewText.set('');
        this.reviewRating.set(5);
        this.alreadyReviewed.set(true);
        await this.loadProduct();
        this.scrollToReviews();
      } else {
        this.reviewError.set(true);
        this.reviewMessage.set(res.message || 'Không thể gửi đánh giá');
      }
    } catch (error: any) {
      this.reviewError.set(true);
      const msg = error.error?.message || error.message || 'Không thể gửi đánh giá';
      if (error.status === 404) {
        this.reviewMessage.set(
          'API đánh giá chưa có trên server. Deploy backend lên Vercel hoặc dùng backend local (xem hướng dẫn trong cauhinh.ts).'
        );
      } else if (error.status === 401) {
        this.reviewMessage.set('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        this.goToLogin();
      } else {
        this.reviewMessage.set(msg);
      }
    } finally {
      this.submittingReview.set(false);
    }
  }
}
