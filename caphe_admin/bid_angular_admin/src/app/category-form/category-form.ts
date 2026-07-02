import { Component , signal} from '@angular/core';
import { ICategory } from '../data.model';
import { CategoryService } from '../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  category = signal<ICategory>({
    name: '',
    slug: '',
    icon: '',
    display_order: 0,
    status: 'active'
  } as ICategory);
  isEdit: boolean = false;
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);
  
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      const res:any  = await this.categoryService.getOne(+id);
      this.category.set(res?.data);
       console.log(this.category())
      // Hiển thị icon cũ nếu có
      if (this.category().icon) {
        if (this.category().icon?.startsWith("http")==true) this.previewUrl.set(this.category().icon || '');
        else  this.previewUrl.set(`https://duancoffee-bcu2.vercel.app/${this.category().icon}`);
        (document.getElementById('iconPreview') as HTMLDivElement).innerHTML = 
          `<img src="${this.previewUrl()}" class="w-full h-full object-cover">`;
      }
    }
  }
  
  async onSubmit() {
    try {
      if (this.isEdit) {
        await this.categoryService.update(this.category().id, this.category(), this.selectedFile || undefined);
        alert('Cập nhật loại sản phẩm thành công!');
      } else {
        await this.categoryService.create(this.category(), this.selectedFile || undefined);
        alert('Thêm loại sản phẩm thành công!');
      }
      
      this.router.navigate(['/category']);
    } catch (error: any) {
      console.error('Lỗi:', error);
      alert(error.error?.message || 'Có lỗi xảy ra');
    }
  }
  
  generateSlug() {
    const name = this.category().name;
    if (!name) return;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-') // Replace multiple - with single -
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
    this.category().slug = slug;
  }
  
  previewIcon(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }
      
      // Kiểm tra kích thước file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 2MB!');
        return;
      }
      
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl.set(e.target.result);
        (document.getElementById('iconPreview') as HTMLDivElement).innerHTML = 
          `<img src="${e.target.result}" class="w-full h-full object-cover">`;
      }
      reader.readAsDataURL(file);
    }
  }
  
  removeIcon() {
    this.selectedFile = null;
    this.previewUrl.set(null);
    
    const fileInput = document.getElementById('categoryIcon') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    (document.getElementById('iconPreview') as HTMLDivElement).innerHTML = `
      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    `;
  }
  
  resetForm() {
    this.category.set({
      name: '',
      slug: '',
      display_order: 0,
      status: 'active',
      icon: ''
    } as ICategory);
    this.removeIcon();
  }
}
