import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutControlComponent } from './logout-control.component';

describe('LogoutControlComponent', () => {
  let component: LogoutControlComponent;
  let fixture: ComponentFixture<LogoutControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoutControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
