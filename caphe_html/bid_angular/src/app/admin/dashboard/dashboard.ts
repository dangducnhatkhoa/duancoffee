import { CommonModule, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin-service';

declare const Chart: any;

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class AdminDashboard implements OnInit, AfterViewInit {
  stats: any = null;
  loading = true;
  private chart: any = null;

  constructor(private adminService: AdminService) {}

  async ngOnInit() {
    try {
      const res: any = await this.adminService.getDashboard();
      this.stats = res.data;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
      if (this.stats) setTimeout(() => this.renderChart(), 100);
    }
  }

  ngAfterViewInit() {}

  renderChart() {
    if (!this.stats?.revenueByDay || typeof Chart === 'undefined') return;
    const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) this.chart.destroy();
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.stats.dayLabels || ['T2','T3','T4','T5','T6','T7','CN'],
        datasets: [{
          label: 'Doanh thu',
          data: this.stats.revenueByDay,
          borderColor: '#2c1a0e',
          backgroundColor: 'rgba(44,26,14,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#2c1a0e',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f0f0f0' },
            ticks: {
              callback: (v: number) => v >= 1000000 ? (v/1000000).toFixed(0)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v,
            },
          },
          x: { grid: { display: false } },
        },
      },
    });
  }

  sparkHeights(seed: number): number[] {
    return [40, 65, 30, 80, 55, 70, 45].map((h, i) => h + (seed + i) % 20);
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      cho_xac_nhan: 'Chờ xác nhận', pending: 'Chờ xác nhận',
      dang_xu_ly: 'Đang xử lý', processing: 'Đang xử lý',
      dang_giao: 'Đang giao', shipping: 'Đang giao',
      hoan_thanh: 'Hoàn thành', completed: 'Hoàn thành', da_giao: 'Đã giao',
      da_huy: 'Đã hủy', cancelled: 'Đã hủy',
    };
    return map[status] || status;
  }

  statusBadge(status: string): string {
    if (['cho_xac_nhan', 'pending'].includes(status)) return 'badge-yellow';
    if (['dang_xu_ly', 'processing'].includes(status)) return 'badge-blue';
    if (['dang_giao', 'shipping'].includes(status)) return 'badge-purple';
    if (['hoan_thanh', 'completed', 'da_giao'].includes(status)) return 'badge-green';
    return 'badge-red';
  }

  stockBadge(stock: number): string {
    if (stock <= 5) return 'badge-red';
    if (stock <= 15) return 'badge-orange';
    return 'badge-yellow';
  }

  stockLabel(stock: number): string {
    if (stock <= 5) return 'Rất thấp';
    if (stock <= 15) return 'Thấp';
    return 'Cảnh báo';
  }
}
