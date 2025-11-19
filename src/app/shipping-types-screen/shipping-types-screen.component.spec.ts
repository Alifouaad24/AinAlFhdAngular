import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingTypesScreenComponent } from './shipping-types-screen.component';

describe('ShippingTypesScreenComponent', () => {
  let component: ShippingTypesScreenComponent;
  let fixture: ComponentFixture<ShippingTypesScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingTypesScreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShippingTypesScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
