import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidGeneratorComponent } from './raid-generator.component';

describe('RaidGeneratorComponent', () => {
  let component: RaidGeneratorComponent;
  let fixture: ComponentFixture<RaidGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaidGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaidGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
