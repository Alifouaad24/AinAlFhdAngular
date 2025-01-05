import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenForStoreComponent } from './main-screen-for-store.component';

describe('MainScreenForStoreComponent', () => {
  let component: MainScreenForStoreComponent;
  let fixture: ComponentFixture<MainScreenForStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainScreenForStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainScreenForStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
