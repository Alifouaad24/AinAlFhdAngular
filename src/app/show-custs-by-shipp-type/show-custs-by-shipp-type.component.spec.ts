import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCustsByShippTypeComponent } from './show-custs-by-shipp-type.component';

describe('ShowCustsByShippTypeComponent', () => {
  let component: ShowCustsByShippTypeComponent;
  let fixture: ComponentFixture<ShowCustsByShippTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCustsByShippTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowCustsByShippTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
