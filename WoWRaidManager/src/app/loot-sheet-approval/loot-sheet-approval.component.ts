import { getMatScrollStrategyAlreadyAttachedError } from '@angular/cdk/overlay/scroll/scroll-strategy';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { sheetLockModel } from '../loot-manager/loot-config/models/sheetLockModel';
import { LootService } from '../services/loot.service';
import { RosterService } from '../services/roster.service';
import { ICharacter } from '../shared/interfaces';
import { ViewLootSheetModalComponent } from './modals/view-loot-sheet-modal.component';
import { approvalModel } from './models/approvalModel';

@Component({
  selector: 'app-loot-sheet-approval',
  templateUrl: './loot-sheet-approval.component.html',
  styleUrls: ['./loot-sheet-approval.component.css']
})
export class LootSheetApprovalComponent implements OnInit {
  @ViewChild('charTbSort') charTbSort = new MatSort();
  @ViewChild('charTbSortWithObject') charTbSortWithObject = new MatSort();
  @ViewChild('paginator') paginator: MatPaginator;
  
sheetLocks: sheetLockModel[] = [];
dataSource = new MatTableDataSource(this.sheetLocks);
displayedColumns: string[] = [ 'char_name','phase', 'viewSheetButton', 'approveButton', 'denyButton'];
modalDialogAttendance: MatDialogRef<ViewLootSheetModalComponent, any> | undefined;

  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor( private lootService: LootService,private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getSheetsNeedingApproval()
  }
  
  getSheetsNeedingApproval() {
    this.lootService.getSheetLockForApproval()
      .subscribe((response: sheetLockModel[]) => {
        this.sheetLocks = response;
        if (this.dataSource) {
          this.dataSource = new MatTableDataSource(this.sheetLocks);
          this.dataSource.paginator = this.paginator;
        }
        console.log(this.sheetLocks)
        this.charTbSort.disableClear = true;
        this.dataSource.sort = this.charTbSort;
    
        this.dataSource.sortingDataAccessor = (row: sheetLockModel, columnName: string): string => {
          switch (columnName) {
            case 'char_name':
              return row.char_name;
            case 'phase':
              return row.phase.toString();              
            default:
              return ""
          }
        }
      },
        (err: any) => console.log(err),
        () => {
          console.log('getRoster() retrieved characters and applied filters, if any')
        });
  }

  viewCharacterSheet(sheetLock: sheetLockModel){
    this.modalDialogAttendance = this.matDialog.open(ViewLootSheetModalComponent, {
      width: '500px',
      height: '500px',
      data: sheetLock,
    });
    //this.ProcessImportString(this.inputString)
    this.modalDialogAttendance.afterClosed().subscribe(result => {
      if (result){
      }
    });
  }

  approveSheet(sheetLock: sheetLockModel){
    let AppModel  = new approvalModel(sheetLock.char_name,sheetLock.phase, "approved")
    this.lootService.approveOrDenySheetLock(AppModel).subscribe(ret =>{
      this.getSheetsNeedingApproval()
    })
  }

  denySheet(sheetLock: sheetLockModel){
    let AppModel  = new approvalModel(sheetLock.char_name,sheetLock.phase, "false")
    this.lootService.approveOrDenySheetLock(AppModel).subscribe(ret =>{
      this.getSheetsNeedingApproval()
    })
    
  }


}
