import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAmendentComponent } from './add-amendent.component';

describe('AddAmendentComponent', () => {
  let component: AddAmendentComponent;
  let fixture: ComponentFixture<AddAmendentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAmendentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAmendentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
