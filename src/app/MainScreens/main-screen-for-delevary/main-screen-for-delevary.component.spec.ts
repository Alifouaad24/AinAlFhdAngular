import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenForDelevaryComponent } from './main-screen-for-delevary.component';

describe('MainScreenForDelevaryComponent', () => {
  let component: MainScreenForDelevaryComponent;
  let fixture: ComponentFixture<MainScreenForDelevaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainScreenForDelevaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainScreenForDelevaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
