import { Component, ComponentRef, OnInit } from '@angular/core';
import { FilterService } from '../services/filter.service';
import { RosterService } from '../services/roster.service';
import { ICharacter } from '../shared/interfaces';
import { faUser, faPlus, faAlignJustify, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { Characters } from '../roster/models/Characters';
import { Buffs } from '../roster/models/Buffs';
import { ModalComponent } from './modal/modal/modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpecData } from './models/SpecData';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})

export class RosterComponent implements OnInit {
  userGylph = faUser;
  plusGlyph = faPlus;
  alignJustifyGlyph = faAlignJustify;
  thLargeGlyph = faThLarge;
  currentFilter: string = "";
  props = ['char_name', 'primarySpec.spec_name', 'mainsCharacterName', 'main'];

  title: string = '';
  filterText: string = '';
  characters: ICharacter[] = [];
  displayMode: DisplayModeEnum = DisplayModeEnum.Card;
  displayModeEnum = DisplayModeEnum;
  totalRecords = 0;
  pageSize = 10;
  mapComponentRef: ComponentRef<any> = {} as ComponentRef<any>;
  _filteredCharacters: ICharacter[] = [];

  get filteredCharacters() {
    return this._filteredCharacters;
  }

  set filteredCharacters(value: ICharacter[]) {
    this._filteredCharacters = value;
  }

  constructor(private rosterService: RosterService, private filterService: FilterService, public dialog: MatDialog) { }

  ngOnInit() {
    this.title = 'Roster';
    this.filterText = 'Filter Roster:';
    this.displayMode = DisplayModeEnum.Grid;

    this.getRoster();
  }

  changeDisplayMode(mode: DisplayModeEnum) {
    this.displayMode = mode;
  }

  getRoster() {
    this.rosterService.getRoster()
      .subscribe((response: ICharacter[]) => {
        this.characters = this.filteredCharacters = response;
      },
        (err: any) => console.log(err),
        () => {
          this.filterChanged(this.currentFilter)
          console.log('getRoster() retrieved characters and applied filters, if any')
        });
  }

  filterChanged(data: string) {
    if (data && this.characters) {
      data = data.toUpperCase();
      this.currentFilter = data;
      this.filteredCharacters = this.filterService.filter<ICharacter>(this.characters, data, this.props);
    } else {
      this.filteredCharacters = this.characters;
    }
  }

  addEditCharacter(action: string, obj: any) {
    obj.action = action;

    let unique ={
      mainCharacterList: new Array
    }
    this.characters.forEach(item => {
      if (!unique.mainCharacterList.includes(item.mains_name)) {
        unique.mainCharacterList.push(item.mains_name)
      }
    })
    
    console.log(unique)

    obj = Object.assign(unique, obj)
    console.log(obj)
    if (action == 'Add') {

      var buffdata: Buffs[] = []
      var testCharacter = new Characters('', "", "", new SpecData('', '', buffdata), new SpecData('', '', buffdata));
      obj.data = testCharacter;
    } else {
      var compMain = obj.rank;
      var compPrimarySpecName = obj.primarySpec.spec_name;
      var compOffSpecName = obj.offSpec.spec_name;
    }
    let dialogRef = this.dialog.open(ModalComponent, {
      height: '500px',
      width: '400px',
      data: obj,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event == 'Add') {
          this.rosterService.addCharacter(result.data).subscribe(data => {
            this.characters.push(result.data)
            this.characters = [...this.characters];  //refresh the dataSource
            this.filterChanged(this.currentFilter)
          })
        } else if (result.event == 'Edit') {
          if (compMain != result.data.main || compPrimarySpecName != result.data.primarySpec.spec_name || compOffSpecName != result.data.offSpec.spec_name) {
            console.log("going to update")
            this.rosterService.updateCharacter(result.data).subscribe(data => {

              this.characters.forEach(element => {
                if (element.char_name == result.data.char_name) {
                  console.log(element)
                  element.primarySpec.spec_name = result.data.primarySpec.spec_name;
                  element.offSpec.spec_name = result.data.offSpec.spec_name;
                  element.rank = result.data.rank;
                }
              })
              this.characters = [...this.characters];  //refresh the dataSource
              this.filterChanged(this.currentFilter)
            })
          }
        }

      }
    });


  }

  refresh() {
    this.getRoster()
  }

  compareDataBeforeUpdate(obj: ICharacter, retObj: ICharacter): boolean {
    if (obj.char_name == retObj.char_name && obj.rank == retObj.rank && obj.primarySpec.spec_name == retObj.primarySpec.spec_name && obj.offSpec.spec_name == retObj.offSpec.spec_name) {
      return false;
    } else {
      return true;
    }
  }
}



enum DisplayModeEnum {
  Card = 0,
  Grid = 1
}
