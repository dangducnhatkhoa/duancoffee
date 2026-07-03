import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ICategory } from '../models/data.model';
import { BASE_API } from '../../cauhinh';

@Injectable({ providedIn: 'root' })
export class AdminCategoryService {
  private apiUrl = `${BASE_API}categories`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10, sort = 'newest') {
    const url = `${this.apiUrl}?page=${page}&sort=${sort}&limit=${limit}`;
    return firstValueFrom(this.http.get<ICategory[]>(url));
  }

  getOne(id: number) {
    return firstValueFrom(this.http.get<ICategory>(`${this.apiUrl}/${id}`));
  }

  create(category: ICategory, iconFile?: File) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('slug', category.slug);
    if (category.display_order !== undefined) formData.append('display_order', category.display_order.toString());
    if (category.status) formData.append('status', category.status);
    if (iconFile) formData.append('icon', iconFile);
    return firstValueFrom(this.http.post<any>(this.apiUrl, formData));
  }

  update(id: number, category: ICategory, iconFile?: File) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('slug', category.slug);
    if (category.display_order !== undefined) formData.append('display_order', category.display_order.toString());
    if (category.status) formData.append('status', category.status);
    if (iconFile) formData.append('icon', iconFile);
    return firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, formData));
  }

  delete(id: number) {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
