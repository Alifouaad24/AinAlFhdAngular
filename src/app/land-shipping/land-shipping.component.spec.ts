import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandShippingComponent } from './land-shipping.component';

describe('LandShippingComponent', () => {
  let component: LandShippingComponent;
  let fixture: ComponentFixture<LandShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandShippingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
