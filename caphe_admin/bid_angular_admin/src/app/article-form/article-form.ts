import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../cauhinh';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './article-form.html',
})
export class ArticleForm implements OnInit {
  isEditMode: boolean = false;
  articleId: number | null = null;
  
  formData = {
    tieu_de: '',
    noi_dung: '',
    an_hien: true,
    hinh: '',
    luot_xem: 0
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.articleId = Number(id);
      await this.loadArticleDetail();
    }
  }

  async loadArticleDetail() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res: any = await firstValueFrom(
        this.http.get(`${BASE_API}admin/articles/${this.articleId}`, { headers })
      );
      if (res && res.success && res.data) {
        const art = res.data;
        this.formData.tieu_de = art.tieu_de || '';
        this.formData.noi_dung = art.noi_dung || '';
        this.formData.an_hien = art.an_hien === 1 || art.an_hien === true;
        this.formData.hinh = art.hinh || '';
        this.formData.luot_xem = Number(art.luot_xem) || 0;
        if (art.hinh) {
          this.imagePreview = art.hinh.startsWith('http') ? art.hinh : `https://duancoffee-bcu2.vercel.app/images/${art.hinh}`;
        }
      }
    } catch (error) {
      console.error('Error loading article detail:', error);
      alert('Không thể tải chi tiết bài viết');
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

  async onSubmit() {
    if (!this.formData.tieu_de.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }

    if (!this.formData.noi_dung.trim()) {
      alert('Vui lòng nhập nội dung bài viết!');
      return;
    }

    this.isSubmitting = true;
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const bodyFormData = new FormData();
    bodyFormData.append('tieu_de', this.formData.tieu_de);
    bodyFormData.append('noi_dung', this.formData.noi_dung);
    bodyFormData.append('an_hien', this.formData.an_hien ? '1' : '0');
    bodyFormData.append('luot_xem', String(this.formData.luot_xem || 0));

    if (this.selectedFile) {
      bodyFormData.append('hinh', this.selectedFile);
    }

    try {
      let res: any;
      if (this.isEditMode && this.articleId) {
        res = await firstValueFrom(
          this.http.put(`${BASE_API}admin/articles/${this.articleId}`, bodyFormData, { headers })
        );
      } else {
        res = await firstValueFrom(
          this.http.post(`${BASE_API}admin/articles`, bodyFormData, { headers })
        );
      }

      if (res && res.success) {
        alert(this.isEditMode ? 'Cập nhật bài viết thành công!' : 'Đăng bài viết mới thành công!');
        this.router.navigate(['/articles']);
      } else {
        alert(res.message || 'Lỗi khi lưu bài viết!');
      }
    } catch (error: any) {
      console.error('Error saving article:', error);
      alert(error.error?.message || 'Không thể lưu bài viết');
    } finally {
      this.isSubmitting = false;
    }
  }
}
