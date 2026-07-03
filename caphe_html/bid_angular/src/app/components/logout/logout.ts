import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  template: ` <p>logout works!</p> `,
  styles: ``,
})
export class Logout {
  constructor(private r:Router){}

  ngOnInit() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.r.navigate(['/']).then(() => {
        window.location.reload(); // Reload lại toàn trang
    });
  }

}
