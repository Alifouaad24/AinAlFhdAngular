import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenForAirComponent } from './main-screen-for-air.component';

describe('MainScreenForAirComponent', () => {
  let component: MainScreenForAirComponent;
  let fixture: ComponentFixture<MainScreenForAirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainScreenForAirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainScreenForAirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
