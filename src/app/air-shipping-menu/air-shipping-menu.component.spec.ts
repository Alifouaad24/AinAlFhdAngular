import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirShippingMenuComponent } from './air-shipping-menu.component';

describe('AirShippingMenuComponent', () => {
  let component: AirShippingMenuComponent;
  let fixture: ComponentFixture<AirShippingMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirShippingMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirShippingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
