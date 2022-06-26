import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLootSheetComponent } from './master-loot-sheet.component';

describe('MasterLootSheetComponent', () => {
  let component: MasterLootSheetComponent;
  let fixture: ComponentFixture<MasterLootSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterLootSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterLootSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
