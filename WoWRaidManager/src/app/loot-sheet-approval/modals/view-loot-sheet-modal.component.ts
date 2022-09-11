import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Items } from 'src/app/loot-manager/loot-config/models/items';
import { rawSheetDataRow } from 'src/app/loot-manager/loot-config/models/rawSheetDataRow';
import { sheetLockModel } from 'src/app/loot-manager/loot-config/models/sheetLockModel';
import { LootService } from 'src/app/services/loot.service';

@Component({
  selector: 'view-loot-sheet-modal',
  templateUrl: './view-loot-sheet-modal.component.html',
  styleUrls: ['./view-loot-sheet-modal.component.css']
})
export class ViewLootSheetModalComponent implements OnInit {

  
  lootSheet:rawSheetDataRow[] = [];
  items: Items[] = [];

    // MatPaginator Inputs
    length = 100;
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(public dialogRef: MatDialogRef<ViewLootSheetModalComponent>,@Inject(MAT_DIALOG_DATA) public data: sheetLockModel, private lootService:LootService) { }

  ngOnInit(): void {
    this.lootService.getLootSheetByCharName(this.data.char_name).subscribe(data=>{
      this.lootSheet = JSON.parse(JSON.stringify(data))
      this.lootSheet = this.lootSheet.filter(sheet=>sheet.phase = this.data.phase).sort((a, b) => ('' + b.slot).localeCompare(a.slot))
      this.items = this.lootService.getItems()
    })
  }

  getWowheadLinkBasedOnItemID(item_id:number){
    return this.items.find(itm => itm.item_id == item_id)!.wowhead_link
    
  }

  getItemNameBasedOnItemID(item_id: number){
    
    return this.items.find(itm => itm.item_id == item_id)!.item_name
   
  }

}
