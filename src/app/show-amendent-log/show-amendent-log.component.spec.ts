import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAmendentLogComponent } from './show-amendent-log.component';

describe('ShowAmendentLogComponent', () => {
  let component: ShowAmendentLogComponent;
  let fixture: ComponentFixture<ShowAmendentLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAmendentLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowAmendentLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
