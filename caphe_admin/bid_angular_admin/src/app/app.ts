import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  isLoginPage = false;
  currentUser: any = null;
  currentDate = '';

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.currentDate = new Date().toLocaleDateString('vi-VN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isLoginPage = this.router.url.includes('/login');
        this.currentUser = this.auth.getCurrentUser();
      });

    this.isLoginPage = this.router.url.includes('/login');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
