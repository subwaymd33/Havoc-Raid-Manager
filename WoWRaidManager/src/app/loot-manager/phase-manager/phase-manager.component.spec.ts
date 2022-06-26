import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseManagerComponent } from './phase-manager.component';

describe('PhaseManagerComponent', () => {
  let component: PhaseManagerComponent;
  let fixture: ComponentFixture<PhaseManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhaseManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
