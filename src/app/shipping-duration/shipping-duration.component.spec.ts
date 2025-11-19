import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingDurationComponent } from './shipping-duration.component';

describe('ShippingDurationComponent', () => {
  let component: ShippingDurationComponent;
  let fixture: ComponentFixture<ShippingDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingDurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShippingDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
