import { Component , signal} from '@angular/core';
import { IProduct, ICategory } from '../../models/data.model';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { SiteService } from '../../services/site-service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {

  product_arr = signal<IProduct[]>([]);
  id_category = signal(0) ; //id loại sản phẩm
  page = signal(1); // trang hien tai
  total = signal(0); // tong so sp
  limit = signal(4); // so sp tren trang
  totalPages = signal(0);  //tong so trang
  sort:string ="newest"; //sap xep
  category = signal<ICategory>({} as ICategory);
  
  categories_arr = signal<any[]>([]);
  brands_arr = signal<any[]>([]);

  selectedBrands = signal<number[]>([]);
  selectedCategories = signal<number[]>([]);
  selectedPrice = signal<string>('');
  selectedRating = signal<number | null>(null);

  constructor(
    private route: ActivatedRoute, 
    public site:SiteService,
    private cart: CartService,
    private router: Router
  ) {}

  async ngOnInit() {     
      this.route.paramMap.subscribe(async (params) => {
        this.id_category.set(Number(params.get('id_category')) || -1);

        try {
          const resCategory:any = await this.site.getCategory(this.id_category());
          if (resCategory?.data) {
            this.category.set(resCategory.data as ICategory);
          }
        } catch (e) {
          console.error('Error loading category:', e);
        }

        this.loadProducts();
      });

      try {
        const resCats:any = await this.site.getCategories();
        if (resCats?.data) this.categories_arr.set(resCats.data);
      } catch (e) {}

      try {
        const resBrands:any = await this.site.getBrands();
        if (resBrands?.data) this.brands_arr.set(resBrands.data);
      } catch (e) {}

      this.route.queryParamMap.subscribe( params => {
        this.page.set(Number(params.get('page')) || 1);
        this.sort = params.get('sort') || 'newest';
        
        const brandsParam = params.get('brands');
        this.selectedBrands.set(brandsParam ? brandsParam.split(',').map(Number) : []);
        
        const categoriesParam = params.get('categories');
        this.selectedCategories.set(categoriesParam ? categoriesParam.split(',').map(Number) : []);
        
        this.selectedPrice.set(params.get('price') || '');
        this.selectedRating.set(params.get('rating') ? Number(params.get('rating')) : null);
        this.loadProducts();
      });
  }

  async loadProducts() {
      try {
        const resProducts:any  = await this.site.getProductsInCategory(
          this.id_category(), this.page(), this.limit(), this.sort,
          this.selectedBrands(), this.selectedPrice(), this.selectedRating(), this.selectedCategories()
        );
        this.total.set(resProducts.pagination.total || 0);
        this.limit.set(resProducts.pagination.limit || 0);
        this.totalPages.set(Math.ceil(this.total() / this.limit()));
        this.page.set(resProducts.pagination.page || 1);
        this.product_arr.set(resProducts.data as IProduct[]);
      } catch (e) {
        console.error('Error loading products:', e);
      }
  }

  async navigateWithFilters() {
    const queryParams: any = {
      page: this.page(),
      sort: this.sort
    };
    
    if (this.selectedBrands().length > 0) {
      queryParams.brands = this.selectedBrands().join(',');
    } else {
      queryParams.brands = null;
    }
    
    if (this.selectedCategories().length > 0) {
      queryParams.categories = this.selectedCategories().join(',');
    } else {
      queryParams.categories = null;
    }
    
    if (this.selectedPrice()) {
      queryParams.price = this.selectedPrice();
    } else {
      queryParams.price = null;
    }
    
    if (this.selectedRating() !== null) {
      queryParams.rating = this.selectedRating();
    } else {
      queryParams.rating = null;
    }
    
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  toggleBrand(id: number) {
    const current = this.selectedBrands();
    if (current.includes(id)) {
      this.selectedBrands.set(current.filter(x => x !== id));
    } else {
      this.selectedBrands.set([...current, id]);
    }
    this.page.set(1);
    this.navigateWithFilters();
  }

  toggleCategory(id: number) {
    const current = this.selectedCategories();
    if (current.includes(id)) {
      this.selectedCategories.set(current.filter(x => x !== id));
    } else {
      this.selectedCategories.set([...current, id]);
    }
    this.page.set(1);
    this.navigateWithFilters();
  }

  updateFilters() {
    this.page.set(1);
    this.navigateWithFilters();
  }

  clearFilters() {
    this.selectedBrands.set([]);
    this.selectedCategories.set([]);
    this.selectedPrice.set('');
    this.selectedRating.set(null);
    this.page.set(1);
    this.navigateWithFilters();
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
