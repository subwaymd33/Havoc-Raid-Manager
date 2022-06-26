import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LootConfigComponent } from './loot-config.component';

describe('LootConfigComponent', () => {
  let component: LootConfigComponent;
  let fixture: ComponentFixture<LootConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LootConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LootConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
