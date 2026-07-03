import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../../cauhinh';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${BASE_API}admin`;

  constructor(private http: HttpClient) {}

  getDashboard() {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/dashboard`));
  }

  getOrders(page = 1, limit = 10, search = '', status = '') {
    const params = new HttpParams()
      .set('page', page).set('limit', limit).set('search', search).set('status', status);
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/orders`, { params }));
  }

  updateOrderStatus(id: number, status: string) {
    return firstValueFrom(this.http.patch<any>(`${this.apiUrl}/orders/${id}/status`, { status }));
  }

  getOrderById(id: number) {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/orders/${id}`));
  }

  getUsers(page = 1, limit = 10, search = '') {
    const params = new HttpParams().set('page', page).set('limit', limit).set('search', search);
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/users`, { params }));
  }

  toggleUserStatus(id: number) {
    return firstValueFrom(this.http.patch<any>(`${this.apiUrl}/users/${id}/toggle-status`, {}));
  }

  // Voucher Management
  getVouchers(page = 1, limit = 10, search = '') {
    const params = new HttpParams().set('page', page).set('limit', limit).set('search', search);
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/vouchers`, { params }));
  }

  getVoucherById(id: number) {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/vouchers/${id}`));
  }

  createVoucher(voucher: any) {
    return firstValueFrom(this.http.post<any>(`${this.apiUrl}/vouchers`, voucher));
  }

  updateVoucher(id: number, voucher: any) {
    return firstValueFrom(this.http.put<any>(`${this.apiUrl}/vouchers/${id}`, voucher));
  }

  deleteVoucher(id: number) {
    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/vouchers/${id}`));
  }

  // Article Management
  getArticles(page = 1, limit = 10, search = '') {
    const params = new HttpParams().set('page', page).set('limit', limit).set('search', search);
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/articles`, { params }));
  }

  getArticleById(id: number) {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/articles/${id}`));
  }

  createArticle(formData: FormData) {
    return firstValueFrom(this.http.post<any>(`${this.apiUrl}/articles`, formData));
  }

  updateArticle(id: number, formData: FormData) {
    return firstValueFrom(this.http.put<any>(`${this.apiUrl}/articles/${id}`, formData));
  }

  deleteArticle(id: number) {
    return firstValueFrom(this.http.delete<any>(`${this.apiUrl}/articles/${id}`));
  }
}
