import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLootSheetModalComponent } from './view-loot-sheet-modal.component';

describe('ViewLootSheetModalComponent', () => {
  let component: ViewLootSheetModalComponent;
  let fixture: ComponentFixture<ViewLootSheetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLootSheetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLootSheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
