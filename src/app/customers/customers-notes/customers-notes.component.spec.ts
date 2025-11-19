import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersNotesComponent } from './customers-notes.component';

describe('CustomersNotesComponent', () => {
  let component: CustomersNotesComponent;
  let fixture: ComponentFixture<CustomersNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomersNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
