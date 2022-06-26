import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidManagerComponent } from './raid-manager.component';

describe('RaidManagerComponent', () => {
  let component: RaidManagerComponent;
  let fixture: ComponentFixture<RaidManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaidManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaidManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
