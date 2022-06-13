import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizedRaidDisplayComponent } from './optimized-raid-display.component';

describe('OptimizedRaidDisplayComponent', () => {
  let component: OptimizedRaidDisplayComponent;
  let fixture: ComponentFixture<OptimizedRaidDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptimizedRaidDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizedRaidDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
