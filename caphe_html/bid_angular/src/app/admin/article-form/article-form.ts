import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-article-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './article-form.html',
})
export class AdminArticleForm implements OnInit {
  isEditMode: boolean = false;
  articleId: number = 0;
  isSubmitting: boolean = false;

  article: any = {
    tieu_de: '',
    noi_dung: '',
    id_loai_bai_viet: null,
    an_hien: 1
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.articleId = parseInt(idParam);
      await this.loadArticleDetail();
    }
  }

  async loadArticleDetail() {
    try {
      const res = await this.adminService.getArticleById(this.articleId);
      if (res && res.success && res.data) {
        this.article = res.data;
        if (this.article.hinh) {
          this.imagePreview = `http://localhost:3000/images/products/${this.article.hinh}`;
        }
      }
    } catch (error) {
      console.error('Error loading article detail:', error);
      alert('Không thể tải thông tin chi tiết bài viết');
      this.router.navigate(['/admin/articles']);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Use FormData for multipart image upload
    const formData = new FormData();
    formData.append('tieu_de', this.article.tieu_de);
    formData.append('noi_dung', this.article.noi_dung);
    formData.append('an_hien', String(this.article.an_hien));
    if (this.article.id_loai_bai_viet !== null) {
      formData.append('id_loai_bai_viet', String(this.article.id_loai_bai_viet));
    }
    if (this.selectedFile) {
      formData.append('hinh', this.selectedFile);
    }

    try {
      let res: any;
      if (this.isEditMode) {
        res = await this.adminService.updateArticle(this.articleId, formData);
      } else {
        res = await this.adminService.createArticle(formData);
      }

      if (res && res.success) {
        alert(this.isEditMode ? 'Cập nhật bài viết thành công' : 'Đăng bài viết thành công');
        this.router.navigate(['/admin/articles']);
      }
    } catch (error: any) {
      console.error('Error saving article:', error);
      alert(error.error?.message || 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      this.isSubmitting = false;
    }
  }
}
