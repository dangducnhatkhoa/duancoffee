import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminProductService } from '../services/admin-product.service';
import { SiteService } from '../../services/site-service';

const MAX_NAME_LENGTH = 255;
const MAX_CODE_LENGTH = 50;
const MAX_SHORT_DESC_LENGTH = 500;
const MAX_DESC_LENGTH = 10000;
const MAX_PRICE = 999999999;
const MAX_STOCK = 999999;
const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_STATUS = ['con_hang', 'ngung_kinh_doanh'];

@Component({
  selector: 'app-admin-product-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class AdminProductForm implements OnInit {
  isEdit = false;
  productId = 0;
  saving = signal(false);
  loading = signal(true);
  submitted = signal(false);

  categories = signal<any[]>([]);
  brands = signal<any[]>([]);
  existingImages = signal<any[]>([]);
  newFiles = signal<File[]>([]);
  newPreviews = signal<string[]>([]);
  errors = signal<Record<string, string>>({});
  formError = signal('');

  form = {
    name: '',
    product_code: '',
    short_description: '',
    description: '',
    fixed_price: 0,
    sale_price: null as number | null,
    stock: 0,
    category_id: '',
    brand_id: '',
    status: 'con_hang',
    featured: true,
    promo_start: '',
    promo_end: '',
  };

  readonly statusOptions = [
    { value: 'con_hang', label: 'Đang bán' },
    { value: 'ngung_kinh_doanh', label: 'Ngừng kinh doanh' },
  ];

  constructor(
    private productService: AdminProductService,
    private site: SiteService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {
    const [catRes, brandRes] = await Promise.all([
      this.productService.getCategories(),
      this.productService.getBrands(),
    ]);
    this.categories.set(catRes?.data || catRes || []);
    this.brands.set(brandRes?.data || []);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = +id;
      await this.loadProduct();
    }
    this.loading.set(false);
  }

  async loadProduct() {
    const res = await this.productService.getOne(this.productId);
    const p = res.data;
    this.form = {
      name: p.name || '',
      product_code: p.product_code || '',
      short_description: p.short_description || '',
      description: p.description || '',
      fixed_price: parseFloat(p.fixed_price) || 0,
      sale_price: p.sale_price ? parseFloat(p.sale_price) : null,
      stock: p.stock ?? 0,
      category_id: String(p.category_id || p.category?.id || ''),
      brand_id: p.brand_id ? String(p.brand_id) : '',
      status: p.status || 'con_hang',
      featured: p.featured !== false,
      promo_start: p.promo_start ? p.promo_start.slice(0, 16) : '',
      promo_end: p.promo_end ? p.promo_end.slice(0, 16) : '',
    };
    this.existingImages.set(p.images || []);
  }

  discountPercent(): number {
    const price = this.form.fixed_price;
    const sale = this.form.sale_price || 0;
    if (!sale || sale >= price) return 0;
    return Math.round(((price - sale) / price) * 100);
  }

  clearError(field: string) {
    const next = { ...this.errors() };
    delete next[field];
    this.errors.set(next);
    if (Object.keys(next).length === 0) {
      this.formError.set('');
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = [...input.files];
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        fileErrors.push(`"${file.name}" không đúng định dạng (chỉ JPEG, PNG, WebP, GIF).`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        fileErrors.push(`"${file.name}" vượt quá 5MB.`);
        continue;
      }
      validFiles.push(file);
    }

    const totalImages = this.existingImages().length + this.newFiles().length + validFiles.length;
    if (totalImages > MAX_IMAGES) {
      this.errors.set({
        ...this.errors(),
        images: `Tối đa ${MAX_IMAGES} ảnh cho mỗi sản phẩm.`,
      });
      input.value = '';
      return;
    }

    if (fileErrors.length) {
      this.errors.set({
        ...this.errors(),
        images: fileErrors.join(' '),
      });
    } else {
      this.clearError('images');
    }

    if (!validFiles.length) {
      input.value = '';
      return;
    }

    this.newFiles.set([...this.newFiles(), ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => this.newPreviews.set([...this.newPreviews(), e.target?.result as string]);
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeNewFile(index: number) {
    const files = [...this.newFiles()];
    const previews = [...this.newPreviews()];
    files.splice(index, 1);
    previews.splice(index, 1);
    this.newFiles.set(files);
    this.newPreviews.set(previews);
    this.clearError('images');
  }

  imageUrl(path: string): string {
    return this.site.formatImageUrl(path);
  }

  async deleteImage(imageId: number) {
    if (!confirm('Xóa ảnh này?')) return;
    await this.productService.deleteImage(this.productId, imageId);
    await this.loadProduct();
    this.validateForm();
  }

  async setPrimary(imageId: number) {
    await this.productService.setPrimaryImage(this.productId, imageId);
    await this.loadProduct();
  }

  buildFormData(): FormData {
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') fd.append(k, String(v));
    });
    this.newFiles().forEach((f) => fd.append('images', f));
    return fd;
  }

  private parseOptionalDate(value: string): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private categoryExists(categoryId: string): boolean {
    return this.categories().some((c) => String(c.id) === String(categoryId));
  }

  private brandExists(brandId: string): boolean {
    return this.brands().some((b) => String(b.id) === String(brandId));
  }

  validateForm(): boolean {
    const errors: Record<string, string> = {};

    const name = this.form.name?.trim() || '';
    if (!name) {
      errors['name'] = 'Tên sản phẩm không được để trống.';
    } else if (name.length < 2) {
      errors['name'] = 'Tên sản phẩm phải có ít nhất 2 ký tự.';
    } else if (name.length > MAX_NAME_LENGTH) {
      errors['name'] = `Tên sản phẩm không được vượt quá ${MAX_NAME_LENGTH} ký tự.`;
    }

    const productCode = this.form.product_code?.trim() || '';
    if (productCode) {
      if (productCode.length > MAX_CODE_LENGTH) {
        errors['product_code'] = `Mã sản phẩm không được vượt quá ${MAX_CODE_LENGTH} ký tự.`;
      } else if (!/^[A-Za-z0-9_-]+$/.test(productCode)) {
        errors['product_code'] = 'Mã sản phẩm chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới.';
      }
    }

    if ((this.form.short_description || '').length > MAX_SHORT_DESC_LENGTH) {
      errors['short_description'] = `Mô tả ngắn không được vượt quá ${MAX_SHORT_DESC_LENGTH} ký tự.`;
    }

    if ((this.form.description || '').length > MAX_DESC_LENGTH) {
      errors['description'] = `Mô tả chi tiết không được vượt quá ${MAX_DESC_LENGTH} ký tự.`;
    }

    if (!this.form.category_id) {
      errors['category_id'] = 'Vui lòng chọn danh mục.';
    } else if (!this.categoryExists(this.form.category_id)) {
      errors['category_id'] = 'Danh mục không hợp lệ.';
    }

    if (this.form.brand_id && !this.brandExists(this.form.brand_id)) {
      errors['brand_id'] = 'Thương hiệu không hợp lệ.';
    }

    const fixedPrice = Number(this.form.fixed_price);
    if (this.form.fixed_price === null || this.form.fixed_price === undefined || Number.isNaN(fixedPrice)) {
      errors['fixed_price'] = 'Giá bán phải là số hợp lệ.';
    } else if (fixedPrice <= 0) {
      errors['fixed_price'] = 'Giá bán phải lớn hơn 0.';
    } else if (!Number.isInteger(fixedPrice)) {
      errors['fixed_price'] = 'Giá bán phải là số nguyên (VNĐ).';
    } else if (fixedPrice > MAX_PRICE) {
      errors['fixed_price'] = `Giá bán không được vượt quá ${MAX_PRICE.toLocaleString('vi-VN')} đ.`;
    }

    const hasSale = this.form.sale_price !== null
      && this.form.sale_price !== undefined
      && String(this.form.sale_price).trim() !== '';
    let salePrice: number | null = null;
    if (hasSale) {
      salePrice = Number(this.form.sale_price);
      if (Number.isNaN(salePrice)) {
        errors['sale_price'] = 'Giá khuyến mãi phải là số hợp lệ.';
      } else if (salePrice < 0) {
        errors['sale_price'] = 'Giá khuyến mãi phải lớn hơn hoặc bằng 0.';
      } else if (!Number.isNaN(fixedPrice) && salePrice >= fixedPrice) {
        errors['sale_price'] = 'Giá khuyến mãi phải nhỏ hơn giá bán.';
      } else if (!Number.isInteger(salePrice)) {
        errors['sale_price'] = 'Giá khuyến mãi phải là số nguyên (VNĐ).';
      } else if (salePrice > MAX_PRICE) {
        errors['sale_price'] = `Giá khuyến mãi không được vượt quá ${MAX_PRICE.toLocaleString('vi-VN')} đ.`;
      } else if (salePrice > 0 && salePrice < 1000) {
        errors['sale_price'] = 'Giá khuyến mãi phải từ 1.000 đ trở lên hoặc để trống.';
      }
    }

    const stock = Number(this.form.stock);
    if (Number.isNaN(stock)) {
      errors['stock'] = 'Số lượng tồn kho phải là số nguyên.';
    } else if (stock < 0) {
      errors['stock'] = 'Số lượng tồn kho không được nhỏ hơn 0.';
    } else if (!Number.isInteger(stock)) {
      errors['stock'] = 'Số lượng tồn kho phải là số nguyên.';
    } else if (stock > MAX_STOCK) {
      errors['stock'] = `Số lượng tồn kho không được vượt quá ${MAX_STOCK.toLocaleString('vi-VN')}.`;
    }

    if (!ALLOWED_STATUS.includes(this.form.status)) {
      errors['status'] = 'Trạng thái sản phẩm không hợp lệ.';
    }

    const promoStart = this.parseOptionalDate(this.form.promo_start);
    const promoEnd = this.parseOptionalDate(this.form.promo_end);
    if (this.form.promo_start && !promoStart) {
      errors['promo_start'] = 'Thời gian bắt đầu khuyến mãi không hợp lệ.';
    }
    if (this.form.promo_end && !promoEnd) {
      errors['promo_end'] = 'Thời gian kết thúc khuyến mãi không hợp lệ.';
    }
    if (promoStart && promoEnd && promoEnd <= promoStart) {
      errors['promo_end'] = 'Thời gian kết thúc khuyến mãi phải sau thời gian bắt đầu.';
    }
    if ((promoStart && !promoEnd) || (!promoStart && promoEnd)) {
      errors['promo_end'] = 'Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc khuyến mãi.';
    }
    if (salePrice !== null && salePrice > 0 && (!promoStart || !promoEnd)) {
      errors['promo_start'] = errors['promo_start'] || 'Khi có giá khuyến mãi, cần nhập thời gian khuyến mãi.';
      errors['promo_end'] = errors['promo_end'] || 'Khi có giá khuyến mãi, cần nhập thời gian khuyến mãi.';
    }

    const totalImages = this.existingImages().length + this.newFiles().length;
    if (!this.isEdit && totalImages === 0) {
      errors['images'] = 'Vui lòng chọn ít nhất một ảnh sản phẩm.';
    }
    if (this.isEdit && totalImages === 0) {
      errors['images'] = 'Sản phẩm phải có ít nhất một ảnh.';
    }
    if (totalImages > MAX_IMAGES) {
      errors['images'] = `Tối đa ${MAX_IMAGES} ảnh cho mỗi sản phẩm.`;
    }

    this.errors.set(errors);
    const valid = Object.keys(errors).length === 0;
    if (!valid) {
      this.formError.set('Vui lòng kiểm tra lại các trường được đánh dấu lỗi.');
    } else {
      this.formError.set('');
    }
    return valid;
  }

  scrollToFirstError() {
    setTimeout(() => {
      const el = document.querySelector('.form-error');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  async onSubmit() {
    this.submitted.set(true);
    if (!this.validateForm()) {
      this.scrollToFirstError();
      return;
    }
    this.saving.set(true);
    try {
      const fd = this.buildFormData();
      if (this.isEdit) {
        await this.productService.update(this.productId, fd);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await this.productService.create(fd);
        alert('Thêm sản phẩm thành công!');
      }
      this.router.navigate(['/admin/product']);
    } catch (e: any) {
      const backendErrors = e.error?.errors;
      if (backendErrors && typeof backendErrors === 'object') {
        this.errors.set({ ...this.errors(), ...backendErrors });
        this.formError.set(e.error?.message || 'Dữ liệu sản phẩm không hợp lệ.');
        this.scrollToFirstError();
      } else {
        alert(e.error?.message || 'Có lỗi xảy ra');
      }
    } finally {
      this.saving.set(false);
    }
  }
}
