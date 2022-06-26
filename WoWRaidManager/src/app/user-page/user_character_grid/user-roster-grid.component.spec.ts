import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRosterGridComponent } from './user-roster-grid.component';

describe('RosterGridComponent', () => {
  let component: UserRosterGridComponent;
  let fixture: ComponentFixture<UserRosterGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRosterGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRosterGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
