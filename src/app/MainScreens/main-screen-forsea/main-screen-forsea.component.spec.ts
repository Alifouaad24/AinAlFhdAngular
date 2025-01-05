import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenForseaComponent } from './main-screen-forsea.component';

describe('MainScreenForseaComponent', () => {
  let component: MainScreenForseaComponent;
  let fixture: ComponentFixture<MainScreenForseaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainScreenForseaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainScreenForseaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
