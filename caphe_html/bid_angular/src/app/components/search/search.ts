import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteService } from '../../services/site-service';
import { IProduct } from '../../models/data.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-search',
  imports: [RouterLink, CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
    constructor(
        private route: ActivatedRoute, 
        public site:SiteService,
        private cart: CartService
    ) {} 

    product_arr = signal<IProduct[]>([]);
    keyword:string= "aasdsadcadffadsf232sdfccswcada"; //từ khóa tìm kiếm
    page = signal(1); //trang hien tai
    total = signal(0); //tong so sp
    limit = signal(4); //so sp tren trang
    totalPages = signal(0);  //tong so trang
    sort = signal("newest"); //sap xep

  async ngOnInit() {     
    const query_params = this.route.snapshot.queryParamMap; //chứa các tham số trong query string 
    this.keyword = query_params.get('keyword') || "asdasdsadasd"; 

    this.route.queryParamMap.subscribe( async params => {
      this.keyword = params.get('keyword') || '';
      this.page.set(Number(params.get('page')) || 1);
      this.sort.set(params.get('sort') || 'default');
      
      const resProducts:any  = await this.site.getProductsWithKeyword(this.keyword, this.page(), this.limit(), this.sort() );
      this.total.set(resProducts.pagination?.total || 0);
      this.limit.set(resProducts.pagination?.limit || 4);
      this.totalPages.set(Math.ceil(this.total() / (this.limit() || 1)));
      this.page.set(resProducts.pagination?.page || 1);
      this.product_arr.set((resProducts.data || []) as IProduct[]);
    });
  }

  pagesToShow() {
    const pages = [];
    const start = Math.max(1, this.page() - 2);
    const end = Math.min(this.totalPages(), this.page() + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  addToCart(product: any) {
      const variantId = product.variants?.[0]?.id; // tạm chọn variant đấu 
      this.cart.addToCart(product.id, variantId);
  }

}
