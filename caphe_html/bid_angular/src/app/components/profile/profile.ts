import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  user: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      // Not logged in, redirect to login
      this.router.navigate(['/users/login']);
    }
  }

  logout() {
    this.router.navigate(['/users/logout']);
  }
}
