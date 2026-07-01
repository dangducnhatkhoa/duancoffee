import { Component, signal } from '@angular/core';
import { SiteService } from '../../services/site-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IProduct } from '../../models/data.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail {
  constructor(
    public site:SiteService, 
    private route: ActivatedRoute,
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

  async ngOnInit(){
    this.route.paramMap.subscribe(async (params) => {
      this.id = Number(params.get('id')) || -1;
      
      try {
        const resProduct = await this.site.getProduct(this.id);
        this.product.set(resProduct.data);
        this.mainImage.set(this.site.getPrimaryImage(this.product()));
        this.selectedThumbIndex.set(0);
        this.quantity.set(1);

        // Variant setup
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

        //lấy sản phẩm liên quan (cùng loại)
        const category_id = this.product().category_id;
        const resRelatedProducts = await this.site.getRelatedProducts(category_id, 4);
        // Filter out current product from related
        const related = (resRelatedProducts.data || []).filter((p: any) => p.id !== this.id);
        this.products_related.set(related.slice(0, 4));
      } catch (e) {
        console.error('Error loading product:', e);
      }
    });
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
}
