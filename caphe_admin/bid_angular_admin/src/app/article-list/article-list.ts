import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../cauhinh';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './article-list.html',
})
export class ArticleList implements OnInit {
  articles: any[] = [];
  searchQuery: string = '';
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;
  totalArticles: number = 0;
  totalViews: number = 0;
  mostViewedArticleTitle: string = 'N/A';
  mostViewedArticleCount: number = 0;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.loadArticles();
  }

  async loadArticles() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res: any = await firstValueFrom(
        this.http.get(`${BASE_API}admin/articles?search=${encodeURIComponent(this.searchQuery)}&page=${this.page}&limit=${this.limit}`, { headers })
      );
      if (res && res.success) {
        this.articles = res.data || [];
        this.totalArticles = res.pagination?.total || 0;
        this.totalPages = res.pagination?.totalPages || 1;
        
        // Tính toán lượt xem và tương tác
        this.calculateStats();
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      alert('Không thể tải danh sách bài viết');
    }
  }

  calculateStats() {
    this.totalViews = this.articles.reduce((sum, art) => sum + (Number(art.luot_xem) || 0), 0);
    if (this.articles.length > 0) {
      const sorted = [...this.articles].sort((a, b) => (Number(b.luot_xem) || 0) - (Number(a.luot_xem) || 0));
      this.mostViewedArticleTitle = sorted[0].tieu_de;
      this.mostViewedArticleCount = Number(sorted[0].luot_xem) || 0;
    } else {
      this.mostViewedArticleTitle = 'N/A';
      this.mostViewedArticleCount = 0;
    }
  }

  async deleteArticle(id: number) {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này khỏi trang chủ?')) {
      return;
    }

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res: any = await firstValueFrom(
        this.http.delete(`${BASE_API}admin/articles/${id}`, { headers })
      );
      if (res && res.success) {
        alert('Xóa bài viết thành công');
        await this.loadArticles();
      }
    } catch (error: any) {
      console.error('Error deleting article:', error);
      alert(error.error?.message || 'Không thể xóa bài viết');
    }
  }

  activeTab: 'list' | 'interactions' = 'list';

  getImageUrl(hinh: string): string {
    if (!hinh) return 'https://placehold.co/100x70/F5F0EA/C8572C?text=No+Image';
    if (hinh.startsWith('http')) return hinh;
    return `https://duancoffee-bcu2.vercel.app/images/${hinh}`;
  }

  async updateEngagement(article: any) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const bodyFormData = new FormData();
    bodyFormData.append('luot_xem', String(article.luot_xem || 0));
    bodyFormData.append('luot_thich', String(article.luot_thich || 0));
    bodyFormData.append('luot_chia_se', String(article.luot_chia_se || 0));

    try {
      const res: any = await firstValueFrom(
        this.http.put(`${BASE_API}admin/articles/${article.id}`, bodyFormData, { headers })
      );
      if (res && res.success) {
        alert(`Cập nhật tương tác bài viết "${article.tieu_de}" thành công!`);
        await this.loadArticles();
      }
    } catch (error: any) {
      console.error('Error updating engagement:', error);
      alert(error.error?.message || 'Không thể cập nhật tương tác');
    }
  }

  search() {
    this.page = 1;
    this.loadArticles();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadArticles();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadArticles();
    }
  }
}
