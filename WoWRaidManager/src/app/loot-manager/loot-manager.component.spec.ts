import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LootManagerComponent } from './loot-manager.component';

describe('LootManagerComponent', () => {
  let component: LootManagerComponent;
  let fixture: ComponentFixture<LootManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LootManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LootManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
