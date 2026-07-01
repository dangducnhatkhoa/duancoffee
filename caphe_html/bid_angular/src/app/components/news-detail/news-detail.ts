import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteService } from '../../services/site-service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-detail.html',
})
export class NewsDetailComponent implements OnInit {
  article: any;

  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        try {
          const res = await this.siteService.getArticle(Number(id));
          if (res.success) {
            this.article = res.data;
            this.cdr.detectChanges(); // Bắt buộc Angular cập nhật giao diện
          }
        } catch (error) {
          console.error('Error loading article', error);
        }
      }
    });
  }
}

