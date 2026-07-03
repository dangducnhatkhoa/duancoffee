import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteService } from '../../services/site-service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.html',
})
export class NewsComponent implements OnInit {
  articles: any[] = [];

  constructor(
    public siteService: SiteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  async loadArticles() {
    try {
      const res: any = await this.siteService.getArticles();
      console.log('Articles response:', res);
      if (res.success) {
        this.articles = res.data;
        this.cdr.detectChanges(); // Bắt buộc Angular cập nhật giao diện
      }
    } catch (error) {
      console.error('Error loading articles', error);
    }
  }
}

