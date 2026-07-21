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
  auction_arr = signal<any[]>([]);

  // Search feature properties
  searchKeyword: string = '';
  suggestions = signal<IProduct[]>([]);
  showSuggestions: boolean = false;
  isSearching: boolean = false;
  popularTags: string[] = ['Cà phê hòa tan', 'Highlands', 'Arabica', 'Phúc Long', 'Nescafe', 'King Coffee'];

  async ngOnInit() { 
    const resCategories = await this.site.getCategories(); // {success: true, data: [] }
    this.category_arr.set((resCategories.data || []) as ICategory[]);

    const resFeatured = await this.site.getFeaturedProducts(8); // {success: true, data: [] }
    this.featured_arr.set((resFeatured.data || []) as IProduct[]);
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
    const variantId = product.variants?.[0]?.id; // tạm chọn variant
    this.cart.addToCart(product.id, variantId);
  }
}
