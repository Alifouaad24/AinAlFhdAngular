import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectInventoryComponent } from './direct-inventory.component';

describe('DirectInventoryComponent', () => {
  let component: DirectInventoryComponent;
  let fixture: ComponentFixture<DirectInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectInventoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
