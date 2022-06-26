import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendanceModalComponent } from './add-attendance-modal.component';

describe('AddAttendanceModalComponent', () => {
  let component: AddAttendanceModalComponent;
  let fixture: ComponentFixture<AddAttendanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAttendanceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
