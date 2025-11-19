import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingTypesForPackagesComponent } from './shipping-types-for-packages.component';

describe('ShippingTypesForPackagesComponent', () => {
  let component: ShippingTypesForPackagesComponent;
  let fixture: ComponentFixture<ShippingTypesForPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingTypesForPackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShippingTypesForPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
