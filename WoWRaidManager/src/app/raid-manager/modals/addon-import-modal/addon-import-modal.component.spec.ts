import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonImportModalComponent } from './addon-import-modal.component';

describe('AddonImportModalComponent', () => {
  let component: AddonImportModalComponent;
  let fixture: ComponentFixture<AddonImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonImportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
