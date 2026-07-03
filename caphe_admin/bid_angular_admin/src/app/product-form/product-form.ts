import { Component, signal, OnInit } from '@angular/core';
import { IProduct, ICategory } from '../data.model';
import { ProductService } from '../services/product-service';
import { CategoryService } from '../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  product = signal<IProduct>({
    id: 0,
    name: '',
    slug: '',
    short_description: '',
    description: '',
    category_id: 0,
    product_code: '',
    featured: true,
    fixed_price: 0,
    sale_price: 0,
    stock: 0,
    status: 'con_hang',
  } as IProduct);
  
  categories = signal<ICategory[]>([]);
  isEdit: boolean = false;
  selectedFiles: File[] = [];
  previewUrls = signal<string[]>([]);
  errors = signal<Record<string, string>>({});

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      const res: any = await this.productService.getOne(+id);
      if (res && res.data) {
        this.product.set(res.data);
        const formatImg = (url: string) => {
          if (!url) return '';
          if (url.startsWith('http')) return url;
          if (url.startsWith('/images/')) return `https://duancoffee-bcu2.vercel.app${url}`;
          if (url.startsWith('images/')) return `https://duancoffee-bcu2.vercel.app/${url}`;
          return `https://duancoffee-bcu2.vercel.app/images/products/${url}`;
        };
        if (res.data.images && res.data.images.length > 0) {
          const urls = res.data.images.map((img: any) => formatImg(img.image_url));
          this.previewUrls.set(urls);
        } else if (res.data.image) {
          const url = formatImg(res.data.image);
          this.previewUrls.set([url]);
        }
      }
    }
  }

  async loadCategories() {
    try {
      const res: any = await this.categoryService.getAll(1, 100);
      this.categories.set(res.data || []);
    } catch (e) {
      console.error(e);
    }
  }

  validateForm(): boolean {
    const product = this.product();
    const errors: Record<string, string> = {};

    if (!product.name?.trim()) {
      errors.name = 'Tên sản phẩm không được để trống.';
    }
    if (!product.category_id || product.category_id === 0) {
      errors.category_id = 'Vui lòng chọn danh mục.';
    }
    if (product.fixed_price === null || product.fixed_price === undefined || product.fixed_price <= 0) {
      errors.fixed_price = 'Giá bán phải lớn hơn 0.';
    }
    if (product.sale_price !== null && product.sale_price < 0) {
      errors.sale_price = 'Giá khuyến mãi không được nhỏ hơn 0.';
    }
    if (product.sale_price !== null && product.sale_price > product.fixed_price) {
      errors.sale_price = 'Giá khuyến mãi phải nhỏ hơn hoặc bằng giá bán.';
    }
    if (product.stock === null || product.stock === undefined || product.stock < 0) {
      errors.stock = 'Số lượng tồn kho không được âm.';
    }

    this.errors.set(errors);
    return Object.keys(errors).length === 0;
  }

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    try {
      if (this.isEdit) {
        await this.productService.update(this.product().id, this.product(), this.selectedFiles);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await this.productService.create(this.product(), this.product(), this.selectedFiles);
        alert('Thêm sản phẩm thành công!');
      }
      this.router.navigate(['/product']);
    } catch (error: any) {
      console.error('Lỗi:', error);
      alert(error.error?.message || 'Có lỗi xảy ra');
    }
  }

  previewImages(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (files.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...files];
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.update(urls => [...urls, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.update(urls => urls.filter((_, i) => i !== index));
  }
}
