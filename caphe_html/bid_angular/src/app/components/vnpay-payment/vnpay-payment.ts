import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BankInfo {
  id: string;
  name: string;
  logo: string;
}

@Component({
  selector: 'app-vnpay-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './vnpay-payment.html',
  styleUrl: './vnpay-payment.css'
})
export class VnpayPayment {
  constructor(private router: Router) {}

  orderNumber: string = '';
  totalAmount: number = 0;
  
  // States: 'select_bank', 'bank_form'
  currentState: string = 'select_bank';
  selectedBank: BankInfo | null = null;
  
  cardNumber: string = '';
  cardName: string = '';
  issueDate: string = '';
  searchQuery: string = '';
  
  timer: number = 15 * 60;
  timerDisplay: string = '15:00';
  interval: any;

  banks: BankInfo[] = [
    { id: 'vietcombank', name: 'Vietcombank', logo: 'https://api.vietqr.io/img/VCB.png' },
    { id: 'vietinbank', name: 'VietinBank', logo: 'https://api.vietqr.io/img/ICB.png' },
    { id: 'bidv', name: 'BIDV', logo: 'https://api.vietqr.io/img/BIDV.png' },
    { id: 'agribank', name: 'Agribank', logo: 'https://api.vietqr.io/img/VBA.png' },
    { id: 'sacombank', name: 'Sacombank', logo: 'https://api.vietqr.io/img/STB.png' },
    { id: 'techcombank', name: 'Techcombank', logo: 'https://api.vietqr.io/img/TCB.png' },
    { id: 'acb', name: 'ACB', logo: 'https://api.vietqr.io/img/ACB.png' },
    { id: 'vpbank', name: 'VPBank', logo: 'https://api.vietqr.io/img/VPB.png' },
    { id: 'mbbank', name: 'MB Bank', logo: 'https://api.vietqr.io/img/MB.png' },
    { id: 'tpbank', name: 'TPBank', logo: 'https://api.vietqr.io/img/TPB.png' },
    { id: 'shb', name: 'SHB', logo: 'https://api.vietqr.io/img/SHB.png' },
    { id: 'vib', name: 'VIB', logo: 'https://api.vietqr.io/img/VIB.png' },
    { id: 'hdbank', name: 'HDBank', logo: 'https://api.vietqr.io/img/HDB.png' },
    { id: 'eximbank', name: 'Eximbank', logo: 'https://api.vietqr.io/img/EIB.png' },
    { id: 'msb', name: 'MSB', logo: 'https://api.vietqr.io/img/MSB.png' },
    { id: 'ncb', name: 'NCB', logo: 'https://api.vietqr.io/img/NCB.png' },
    { id: 'ocb', name: 'OCB', logo: 'https://api.vietqr.io/img/OCB.png' },
    { id: 'scb', name: 'SCB', logo: 'https://api.vietqr.io/img/SCB.png' },
    { id: 'abbank', name: 'ABBank', logo: 'https://api.vietqr.io/img/ABB.png' },
    { id: 'bacabank', name: 'Bac A Bank', logo: 'https://api.vietqr.io/img/BAB.png' },
    { id: 'pvcombank', name: 'PVcomBank', logo: 'https://api.vietqr.io/img/PVCB.png' },
    { id: 'saigonbank', name: 'SaigonBank', logo: 'https://api.vietqr.io/img/SGB.png' },
    { id: 'namabank', name: 'Nam A Bank', logo: 'https://api.vietqr.io/img/NAB.png' },
    { id: 'pgbank', name: 'PGBank', logo: 'https://api.vietqr.io/img/PGB.png' },
  ];

  get filteredBanks(): BankInfo[] {
    if (!this.searchQuery.trim()) return this.banks;
    const q = this.searchQuery.toLowerCase().trim();
    return this.banks.filter(b => b.name.toLowerCase().includes(q) || b.id.includes(q));
  }

  ngOnInit() {
    const orderStr = sessionStorage.getItem('last_order');
    if (!orderStr) {
      this.router.navigate(['/']);
      return;
    }
    const orderData = JSON.parse(orderStr);
    this.orderNumber = orderData.order_number || '';
    this.totalAmount = orderData.total_amount || 0;
    
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        const m = Math.floor(this.timer / 60).toString().padStart(2, '0');
        const s = (this.timer % 60).toString().padStart(2, '0');
        this.timerDisplay = `${m}:${s}`;
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  selectBank(bank: BankInfo) {
    this.selectedBank = bank;
    this.currentState = 'bank_form';
    this.cardNumber = '';
    this.cardName = '';
    this.issueDate = '';
  }

  goBack() {
    if (this.currentState === 'bank_form') {
      this.currentState = 'select_bank';
      this.selectedBank = null;
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  continuePayment() {
    this.router.navigate(['/order-success']);
  }
}
