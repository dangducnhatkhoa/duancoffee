import { Component, signal } from '@angular/core';
import { ICategory } from '../models/data.model';
import { AdminCategoryService } from '../services/admin-category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-category-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class AdminCategoryForm {
  category = signal<ICategory>({
    name: '', slug: '', icon: '', display_order: 0, status: 'active',
  } as ICategory);
  isEdit = false;
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  constructor(
    private categoryService: AdminCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      const res: any = await this.categoryService.getOne(+id);
      this.category.set(res?.data);
      if (this.category().icon) {
        if (this.category().icon?.startsWith('http')) this.previewUrl.set(this.category().icon || '');
        else this.previewUrl.set(`http://localhost:3000/${this.category().icon}`);
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
      this.router.navigate(['/admin/category']);
    } catch (error: any) {
      alert(error.error?.message || 'Có lỗi xảy ra');
    }
  }

  generateSlug() {
    const name = this.category().name;
    if (!name) return;
    this.category().slug = name
      .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  }

  previewIcon(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Vui lòng chọn file ảnh!'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('Kích thước file không được vượt quá 2MB!'); return; }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl.set(e.target.result);
      (document.getElementById('iconPreview') as HTMLDivElement).innerHTML =
        `<img src="${e.target.result}" class="w-full h-full object-cover">`;
    };
    reader.readAsDataURL(file);
  }

  removeIcon() {
    this.selectedFile = null;
    this.previewUrl.set(null);
    const fileInput = document.getElementById('categoryIcon') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  resetForm() {
    this.category.set({ name: '', slug: '', display_order: 0, status: 'active', icon: '' } as ICategory);
    this.removeIcon();
  }
}
