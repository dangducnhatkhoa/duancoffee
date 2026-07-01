import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-article-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './article-list.html',
})
export class AdminArticleList implements OnInit {
  articles: any[] = [];
  searchQuery: string = '';
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;
  totalArticles: number = 0;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadArticles();
  }

  async loadArticles() {
    try {
      const res = await this.adminService.getArticles(this.page, this.limit, this.searchQuery);
      if (res && res.success) {
        this.articles = res.data || [];
        this.totalArticles = res.pagination?.total || 0;
        this.totalPages = res.pagination?.totalPages || 1;
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      alert('Không thể tải danh sách bài viết');
    }
  }

  async deleteArticle(id: number) {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      const res = await this.adminService.deleteArticle(id);
      if (res && res.success) {
        alert('Xóa bài viết thành công');
        await this.loadArticles();
      }
    } catch (error: any) {
      console.error('Error deleting article:', error);
      alert(error.error?.message || 'Không thể xóa bài viết');
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
