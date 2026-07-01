import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../../cauhinh';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  brand_id?: string;
  status?: string;
  trash?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private apiUrl = `${BASE_API}admin/products`;

  constructor(private http: HttpClient) {}

  getAll(filters: ProductFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return firstValueFrom(this.http.get<any>(this.apiUrl, { params }));
  }

  getStats() {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/stats`));
  }

  getOne(id: number) {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  create(formData: FormData) {
    return firstValueFrom(this.http.post<any>(this.apiUrl, formData));
  }

  update(id: number, formData: FormData) {
    return firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, formData));
  }

  updateStock(id: number, quantity: number, mode: 'set' | 'add' = 'set') {
    return firstValueFrom(this.http.patch<any>(`${this.apiUrl}/${id}/stock`, { quantity, mode }));
  }

  softDelete(id: number) {
    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }

  restore(id: number) {
    return firstValueFrom(this.http.patch<any>(`${this.apiUrl}/${id}/restore`, {}));
  }

  forceDelete(id: number) {
    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}/force`));
  }

  deleteImage(productId: number, imageId: number) {
    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${productId}/images/${imageId}`));
  }

  setPrimaryImage(productId: number, imageId: number) {
    return firstValueFrom(this.http.patch<any>(`${this.apiUrl}/${productId}/images/${imageId}/primary`, {}));
  }

  getCategories() {
    return firstValueFrom(this.http.get<any>(`${BASE_API}categories?limit=100`));
  }

  getBrands() {
    return firstValueFrom(this.http.get<any>(`${BASE_API}brands`));
  }
}
