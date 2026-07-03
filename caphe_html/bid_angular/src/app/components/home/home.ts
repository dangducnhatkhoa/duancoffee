import { Component, signal } from '@angular/core';
import { SiteService } from '../../services/site-service';
import { ICategory, IProduct } from '../../models/data.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    public site:SiteService,
    public cart: CartService
  ){}
  category_arr = signal<ICategory[]>([]);
  featured_arr = signal<IProduct[]>([]);
  auction_arr=  signal<any[]>([]);

  async ngOnInit() { 
    const resCategories = await this.site.getCategories(); // {success: true, data: [] }
    this.category_arr.set(resCategories.data as ICategory[]);

    const resFeatured = await this.site.getFeaturedProducts(8); // {success: true, data: [] }
    this.featured_arr.set(resFeatured.data as IProduct[]);
  } 

  addToCart(product: any) {
    const variantId = product.variants?.[0]?.id; // tạm chọn variant đấu 
    this.cart.addToCart(product.id, variantId);
}

}
