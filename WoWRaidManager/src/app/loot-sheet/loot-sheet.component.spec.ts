import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LootSheetComponent } from './loot-sheet.component';

describe('LootSheetComponent', () => {
  let component: LootSheetComponent;
  let fixture: ComponentFixture<LootSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LootSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LootSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
