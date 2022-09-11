import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LootSheetApprovalComponent } from './loot-sheet-approval.component';

describe('LootSheetApprovalComponent', () => {
  let component: LootSheetApprovalComponent;
  let fixture: ComponentFixture<LootSheetApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LootSheetApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LootSheetApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
