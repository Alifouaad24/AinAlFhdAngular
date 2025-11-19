import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowShippingTypesForNavigateComponent } from './show-shipping-types-for-navigate.component';

describe('ShowShippingTypesForNavigateComponent', () => {
  let component: ShowShippingTypesForNavigateComponent;
  let fixture: ComponentFixture<ShowShippingTypesForNavigateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowShippingTypesForNavigateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowShippingTypesForNavigateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
