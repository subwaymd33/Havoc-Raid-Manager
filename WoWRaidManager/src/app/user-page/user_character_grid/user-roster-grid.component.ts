import { Component, Input, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ICharacter } from 'src/app/shared/interfaces';
import { MatSort } from '@angular/material/sort';
import { RosterService } from 'src/app/services/roster.service';
import { SorterService } from 'src/app/services/sorter.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LootService } from 'src/app/services/loot.service';


@Component({
  selector: 'user-roster-grid',
  templateUrl: './user-roster-grid.component.html',
  styleUrls: ['./user-roster-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserRosterGridComponent implements OnInit {
  @Output() refreshData = new EventEmitter<string>();
  @Output() editCharacterEvent = new EventEmitter<ICharacter>();
  @Output() ToggleToLootSheetEvent = new EventEmitter<ICharacter>();
  @ViewChild('charTbSort') charTbSort = new MatSort();
  @ViewChild('charTbSortWithObject') charTbSortWithObject = new MatSort();
  @ViewChild('paginator') paginator: MatPaginator;

  @Input() characters: ICharacter[] = [];

  displayedColumns: string[] = ['icon', 'charName', 'spec', 'main', 'mainsCharacterName', 'offSpec', 'lootSheetButton', 'editButton', 'deleteButton'];
  //sortedData: ICharacter[];
  dataSource = new MatTableDataSource(this.characters);

  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private rosterService: RosterService, private sorterService: SorterService, private snackBarService: SnackbarService, private lootService: LootService) {
  }

  mainCharacterNameCellDisplay(name: string, rank: string): string {
    if (rank == 'Alt') {
      return name;
    } else {
      return "";
    }
  }

  ngOnChanges(changes: ICharacter[]) {
    if (this.dataSource) {
      this.dataSource = new MatTableDataSource(this.characters);
      this.dataSource.paginator = this.paginator;
    }

    this.charTbSort.disableClear = true;
    this.dataSource.sort = this.charTbSort;

    this.dataSource.sortingDataAccessor = (row: ICharacter, columnName: string): string => {
      switch (columnName) {
        case 'icon':
          return row.primarySpec.specName;
        case 'charName':
          return row.charName;
        case 'spec':
          return row.primarySpec.specName;
        case 'main':
          return row.rank;
        case 'spec':
          return row.offSpec.specName;
        case 'mainsCharacterName':
          if (row.charName == row.mainsCharacterName) {
            return 'z' + row.mainsCharacterName
          } else {
            return row.mainsCharacterName
          }

        default:
          return ""
      }
    }
  }

  ngOnInit(): void {
  }

  getSpecImage(spec: string) {
    let returnValue;
    switch (spec) {
      case 'Fire Mage':
        returnValue = "/assets/icons/Fire Mage.png";
        break;
      case 'Frost Mage':
        returnValue = "/assets/icons/Frost Mage.png";
        break;
      case 'Arcane Mage':
        returnValue = "/assets/icons/Arcane Mage.png";
        break;
      case 'Affliction Warlock':
        returnValue = "/assets/icons/Affliction Warlock.png";
        break;
      case 'Destruction Warlock':
        returnValue = "/assets/icons/Destruction Warlock.png";
        break;
      case 'Demonology Warlock':
        returnValue = "/assets/icons/Demonology Warlock.png";
        break;
      case 'Arms Warrior':
        returnValue = "/assets/icons/Arms Warrior.png";
        break;
      case 'Fury Warrior':
        returnValue = "/assets/icons/Fury Warrior.png";
        break;
      case 'Protection Warrior':
        returnValue = "/assets/icons/Protection Warrior.png";
        break;
      case 'Assasination Rogue':
        returnValue = "/assets/icons/Assasination Rogue.png";
        break;
      case 'Combat Rogue':
        returnValue = "/assets/icons/Combat Rogue.png";
        break;
      case 'Subtlety Rogue':
        returnValue = "/assets/icons/Subtlety Rogue.png";
        break;
      case 'Balance Druid':
        returnValue = "/assets/icons/Balance Druid.png";
        break;
      case 'Feral (Bear) Druid':
        returnValue = "/assets/icons/Feral (Bear) Druid.png";
        break;
      case 'Feral (Cat) Druid':
        returnValue = "/assets/icons/Feral (Cat) Druid.png";
        break;
      case 'Restoration Druid':
        returnValue = "/assets/icons/Restoration Druid.png";
        break;
      case 'Beast Mastery Hunter':
        returnValue = "/assets/icons/Beast Mastery Hunter.png";
        break;
      case 'Marksmanship Hunter':
        returnValue = "/assets/icons/Marksmanship Hunter.png";
        break;
      case 'Survival Hunter':
        returnValue = "/assets/icons/Survival Hunter.png";
        break;
      case 'Frost Death Knight':
        returnValue = "/assets/icons/Frost Death Knight.png";
        break;
      case 'Blood Death Knight':
        returnValue = "/assets/icons/Blood Death Knight.png";
        break;
      case 'Unholy Death Knight':
        returnValue = "/assets/icons/Unholy Death Knight.png";
        break;
      case 'Holy Priest':
        returnValue = "/assets/icons/Holy Priest.png";
        break;
      case 'Discipline Priest':
        returnValue = "/assets/icons/Discipline Priest.png";
        break;
      case 'Shadow Priest':
        returnValue = "/assets/icons/Shadow Priest.png";
        break;
      case 'Elemental Shaman':
        returnValue = "/assets/icons/Elemental Shaman.png";
        break;
      case 'Restoration Shaman':
        returnValue = "/assets/icons/Restoration Shaman.png";
        break;
      case 'Enhancement Shaman':
        returnValue = "/assets/icons/Enhancement Shaman.png";
        break;
      case 'Holy Paladin':
        returnValue = "/assets/icons/Holy Paladin.png";
        break;
      case 'Protection Paladin':
        returnValue = "/assets/icons/Protection Paladin.png";
        break;
      case 'Retribution Paladin':
        returnValue = "/assets/icons/Retribution Paladin.png";
        break;


      default:
        returnValue = 'white';
    }
    return returnValue;
  }

  deleteCharacter(char: ICharacter) {
    console.log("Event Handler: Delete")

    this.rosterService.getCharUIDByCharName(char.charName).subscribe(resp1 => {
      let charUID = resp1[0].charUID;
      this.rosterService.deleteCharacter(charUID).subscribe(resp => {
        if (resp.status != 200) {

          this.snackBarService.openSnackBar("Error Deleting: " + char.charName)
          throw Error("Cannot delete your item from list");
        } else {
          this.snackBarService.openSnackBar("Deleted: " + char.charName + " successfully")
          this.refreshData.emit();
        }
      })
    })


  }

  editCharacter(char: ICharacter) {
    this.editCharacterEvent.emit(char)
  }

  displayLootSheet(char: ICharacter) {
    this.ToggleToLootSheetEvent.emit(char)
  }
}
