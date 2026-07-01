import { Component, signal } from '@angular/core';
import { ICategory } from '../models/data.model';
import { AdminCategoryService } from '../services/admin-category.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-category-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class AdminCategoryList {
  category_arr = signal<ICategory[]>([]);
  page = signal<number>(1);
  total = signal<number>(0);
  limit = signal<number>(4);
  totalPages = signal<number>(0);
  sort = signal<string>('newest');

  constructor(
    private categoryService: AdminCategoryService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.queryParamMap.subscribe(async (params) => {
      this.page.set(Number(params.get('page')) || 1);
      this.sort.set(params.get('sort') || 'newest');

      const res: any = await this.categoryService.getAll(this.page(), this.limit(), this.sort());
      this.total.set(res?.pagination?.total || 0);
      this.limit.set(res?.pagination?.limit || 0);
      this.totalPages.set(Math.ceil(this.total() / this.limit()));
      this.page.set(res?.pagination?.page || 1);
      this.category_arr.set(res.data as ICategory[]);
    });
  }

  pagesToShow() {
    const pages = [];
    const start = Math.max(1, this.page() - 2);
    const end = Math.min(this.totalPages(), this.page() + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  async xoa(id: number) {
    if (!confirm(`Bạn có chắc chắn muốn xóa loại ${id} không?`)) return;
    await this.categoryService.delete(id);
    window.location.reload();
  }
}
