import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../cauhinh';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${BASE_API}products`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10, search = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
    if (search) params = params.set('search', search);
    return firstValueFrom(this.http.get<any>(this.apiUrl, { params }));
  }

  getOne(id: number) {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  create(data: any, files: File[]) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('images', file); // Adjust field name if the backend uses something else
      });
    }
    return firstValueFrom(this.http.post<any>(this.apiUrl, formData));
  }

  update(id: number, data: any, files: File[]) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('images', file);
      });
    }
    return firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, formData));
  }

  delete(id: number) {
    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
