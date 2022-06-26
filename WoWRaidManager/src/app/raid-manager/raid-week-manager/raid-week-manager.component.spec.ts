import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidWeekManagerComponent } from './raid-week-manager.component';

describe('RaidWeekManagerComponent', () => {
  let component: RaidWeekManagerComponent;
  let fixture: ComponentFixture<RaidWeekManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaidWeekManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaidWeekManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
