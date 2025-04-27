import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AriShippingCustomersComponent } from './ari-shipping-customers.component';

describe('AriShippingCustomersComponent', () => {
  let component: AriShippingCustomersComponent;
  let fixture: ComponentFixture<AriShippingCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AriShippingCustomersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AriShippingCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
