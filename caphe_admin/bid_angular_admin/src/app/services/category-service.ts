import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../data.model';
import { firstValueFrom } from 'rxjs';

import { BASE_API } from '../cauhinh';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${BASE_API}categories`;
  constructor(private http: HttpClient) {}

  getAll(page=1, limit=1, sort='newest'): Promise<ICategory[]> { 
     const url = `${this.apiUrl}?page=${page}&sort=${sort}&limit=${limit}`;
     return firstValueFrom(this.http.get<ICategory[]>( url ));
  }

  getOne(id: number): Promise<ICategory> {
    return firstValueFrom(this.http.get<ICategory>(`${this.apiUrl}/${id}`)); 
  }

  create(category: ICategory, iconFile?: File): Promise<any> {
    const formData = new FormData();
    
    formData.append('name', category.name);
    formData.append('slug', category.slug);
    
    if (category.display_order !== undefined) {
      formData.append('display_order', category.display_order.toString());
    }
    
    if (category.status) {
      formData.append('status', category.status);
    }
    
    if (iconFile) {
      formData.append('icon', iconFile);
    }
    
    return firstValueFrom(this.http.post<any>(this.apiUrl, formData));
  }
  
  update(id: number, category: ICategory, iconFile?: File): Promise<any> {
    const formData = new FormData();
    
    formData.append('name', category.name);
    formData.append('slug', category.slug);
    
    if (category.display_order !== undefined) {
      formData.append('display_order', category.display_order.toString());
    }
    
    if (category.status) {
      formData.append('status', category.status);
    }
    
    if (iconFile) {
      formData.append('icon', iconFile);
    }
    
    return firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, formData));
  }
  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
