import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SealesComponent } from './seales.component';

describe('SealesComponent', () => {
  let component: SealesComponent;
  let fixture: ComponentFixture<SealesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SealesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SealesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
