import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServicesComponent } from './customer-services.component';

describe('CustomerServicesComponent', () => {
  let component: CustomerServicesComponent;
  let fixture: ComponentFixture<CustomerServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
