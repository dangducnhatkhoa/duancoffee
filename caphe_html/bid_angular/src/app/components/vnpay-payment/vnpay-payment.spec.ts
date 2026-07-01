import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VnpayPayment } from './vnpay-payment';

describe('VnpayPayment', () => {
  let component: VnpayPayment;
  let fixture: ComponentFixture<VnpayPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VnpayPayment],
    }).compileComponents();

    fixture = TestBed.createComponent(VnpayPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
