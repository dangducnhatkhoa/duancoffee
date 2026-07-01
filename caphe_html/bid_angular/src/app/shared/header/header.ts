import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  keyword: string = '';
  full_name:string ='';
  isLoggedIn: boolean = false;
  cartCount: number = 0;

  constructor(
    private router: Router,
    public cart:CartService
  ) {}
  
  ngOnInit() { 
    this.hienThiTen()
    this.cart.cartCount.subscribe(count => {
      this.cartCount = count;
    });

  }
  hienThiTen() { 
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.full_name = user.full_name || "quý khách";
      this.isLoggedIn = true;
    } else {
      this.full_name = "quý khách";
      this.isLoggedIn = false;
    }
  }


  onSearch() {
    if (this.keyword.trim()) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/search'], { queryParams: { keyword: this.keyword } });
      });
    }
  } 

}
