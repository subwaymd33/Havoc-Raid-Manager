import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidManagerControllerComponent } from './raid-manager-controller.component';

describe('RaidManagerControllerComponent', () => {
  let component: RaidManagerControllerComponent;
  let fixture: ComponentFixture<RaidManagerControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaidManagerControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaidManagerControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
