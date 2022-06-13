import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterGridComponent } from './roster-grid.component';

describe('RosterGridComponent', () => {
  let component: RosterGridComponent;
  let fixture: ComponentFixture<RosterGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosterGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
