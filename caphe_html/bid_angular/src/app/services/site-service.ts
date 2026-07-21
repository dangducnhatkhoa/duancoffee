import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BASE_API } from '../cauhinh';
import { IProduct, IProductImage } from '../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
    constructor(private http: HttpClient) {}
    async getCategories(): Promise<any> {
        return await firstValueFrom(this.http.get(`${BASE_API}categories`));
    }
    
    async getBrands(): Promise<any> {
        return await firstValueFrom(this.http.get(`${BASE_API}brands`));
    }
 
    // Lấy danh sách sản phẩm nổi bật
    async getFeaturedProducts( limit= 6): Promise<any> {
        return await firstValueFrom(this.http.get(`${BASE_API}products/featured?limit=${limit}`));
    }

    // Lấy danh sách sản phẩm xem nhiều nhất (phổ biến)
    async getPopularProducts(limit = 5): Promise<any> {
        return await firstValueFrom(this.http.get(`${BASE_API}products?sort=popular&limit=${limit}`));
    }

    // Lấy danh sách sản phẩm đang đấu giá
    async getAuctionProducts( limit= 6): Promise<any> {
        return await firstValueFrom(this.http.get(`${BASE_API}products/auction?limit=${limit}`));
    }

    // Helper to format image URLs from backend
    formatImageUrl(url: string | undefined): string {
        if (!url) return '/assets/no-image.png';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        if (url.startsWith('/images/')) {
            return `https://duancoffee-bcu2.vercel.app${url}`;
        }
        if (url.startsWith('images/')) {
            return `https://duancoffee-bcu2.vercel.app/${url}`;
        }
        return `https://duancoffee-bcu2.vercel.app/images/products/${url}`;
    }

    // Lấy ảnh chính của sản phẩm
    getPrimaryImage(sp: IProduct) {
        const rawUrl = sp.images?.find( (img: IProductImage) => img.is_primary)?.image_url || (sp as any).image || (sp as any).hinh_anh;
        return this.formatImageUrl(rawUrl);
    }

    async getProductsInCategory(id_category: number, page=1, limit=4, sort='newest', brandIds: number[]=[], priceRange: string='', minRating: number|null=null, categoryIds: number[]=[]){        
        let url = `${BASE_API}products/category/${id_category}?page=${page}&sort=${sort}&limit=${limit}`;
        if (brandIds && brandIds.length > 0) url += `&brand_ids=${brandIds.join(',')}`;
        if (categoryIds && categoryIds.length > 0) url += `&category_ids=${categoryIds.join(',')}`;
        if (priceRange) {
           const [min, max] = priceRange.split('-');
           if (min) url += `&min_price=${min}`;
           if (max && max !== '0') url += `&max_price=${max}`;
        }
        if (minRating) url += `&min_rating=${minRating}`;
        return  await firstValueFrom(this.http.get(url));
    }

    async getCategory(id_category: number){        
        const url = `${BASE_API}categories/${id_category}`;
        return  await firstValueFrom(this.http.get(url));
    }

    async getProductsWithKeyword(keyword: string, page=1, limit=4, sort='newest'){        
        const url = `${BASE_API}products/search?keyword=${keyword}&page=${page}&sort=${sort}&limit=${limit}`;
        return  await firstValueFrom(this.http.get(url));
    }
    async sendContact(formData: any): Promise<any> {
        // dùng firstValueFrom để convert Observable → Promise
        return await firstValueFrom(this.http.post(`${BASE_API}contact`, formData));
    }

    async register(formData: any){
        return await firstValueFrom(this.http.post(`${BASE_API}users/register`, formData));
    }

    async activateAccount(token: string){
        return await firstValueFrom(this.http.get(`${BASE_API}users/activate/${token}`));
    }

    async login(formData: any){
        return await firstValueFrom(this.http.post(`${BASE_API}users/login`, formData));
    }

    async forgotpassword(formData: any){
        return await firstValueFrom(this.http.post(`${BASE_API}users/forgotpassword`, formData));
    }

    async resetpassword(formData: any){
    return await firstValueFrom(this.http.post(`${BASE_API}users/resetpassword`, formData));
    }

    async changepassword(formData: any){
        const token = sessionStorage.getItem('token'); 
        const headers = { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json'};
        const url = `${BASE_API}users/changepassword` 
        return await firstValueFrom(this.http.post(url, formData ,  { headers} ));
    }

    isLoggedIn(): boolean {
        return !!sessionStorage.getItem('token');
    }

    private authHeaders() {
        const token = sessionStorage.getItem('token') || '';
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    }

    async getMyReviewStatus(productId: number): Promise<any> {
        return await firstValueFrom(
            this.http.get(`${BASE_API}reviews/status/${productId}`, { headers: this.authHeaders() })
        );
    }

    async submitReview(data: { product_id: number; rating: number; review_text?: string }): Promise<any> {
        return await firstValueFrom(
            this.http.post(`${BASE_API}reviews`, data, { headers: this.authHeaders() })
        );
    }



    // Lấy chi tiết 1 sản phẩm theo id 
    async getProduct(id_product: number): Promise<any> {
    return await firstValueFrom(this.http.get(`${BASE_API}products/${id_product}`));
    }

    // Lấy ảnh phụ của sản phẩm
    getSubImages(sp: IProduct): string[] {
        if (!sp?.images || sp?.images.length === 0) { return [];}
        return sp.images.filter((img: IProductImage) => !img.is_primary)  // lọc ảnh phụ
            .map((img: IProductImage) => this.formatImageUrl(img.image_url))       // lấy URL đã định dạng
            .filter((url: string) => !!url);                 // loại bỏ null/undefined nếu có
    }

    //lấy sản phẩm cùng loại
    async getRelatedProducts(id_loai:number, limit:number=5): Promise<any> {
    const url =`${BASE_API}products/category/${id_loai}?limit=${limit}`
    return await firstValueFrom(this.http.get(url));
    }

    async getProductsAuction( page=1, limit=3, sort="ending_soon"){
    const url =`${BASE_API}products/auction?limit=${limit}&page=${page}&sort=${sort}`
    return await firstValueFrom(this.http.get(url));
    }

    async getArticles(): Promise<any> {
        return await firstValueFrom(this.http.get(`${BASE_API}articles`));
    }

    async getArticle(id: number): Promise<any> {
        return await firstValueFrom(this.http.get(`${BASE_API}articles/${id}`));
    }

}//class SiteService
