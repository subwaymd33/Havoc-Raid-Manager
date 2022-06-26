import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../roster/modal/modal/modal.component';
import { Buffs } from '../roster/models/Buffs';
import { Characters } from '../roster/models/Characters';
import { SpecData } from '../roster/models/SpecData';
import { RosterService } from '../service/roster.service';
import { ICharacter } from '../shared/interfaces';
import { faUser, faPlus, faAlignJustify, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { ignoreElements, Subject } from 'rxjs';
import { lootSheetInitiateModel } from './models/lootSheetInitiateModel';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


export class CharWithActionModel {
  action: string;
  char: Characters;

  constructor(action: string, char: Characters) {
    this.action = action;
    this.char = char;
  }
}

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  characters: ICharacter[] = [];
  discordID = "";
  username = "";
  userGylph = faUser;
  plusGlyph = faPlus;
  alignJustifyGlyph = faAlignJustify;
  thLargeGlyph = faThLarge;

  //loot sheet variables
  toggleToLootSheet: boolean = false;
  lootSheetInitModel: lootSheetInitiateModel;
  characterClass: string = "";
  characterName: string = "";
  characterPrimarySpec: string = "";
  characterOffSpec: string = "";

  eventsSubject: Subject<lootSheetInitiateModel> = new Subject<lootSheetInitiateModel>();

  modalDialogImport: MatDialogRef<ModalComponent, any> | undefined;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 5;


  constructor(private rosterService: RosterService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.discordID = localStorage.getItem("dID")!
    this.username = localStorage.getItem("username")!
    this.getRoster();
  }

  ngAfterViewInit(): void {
    document.onclick = (args: any): void => {
      if (args.target.tagName === 'BODY') {
        this.modalDialogImport?.close()
      }
    }
  }

  addEditCharacter(action: string, obj: any) {
    obj.action = action;

    let unique = {
      mainCharacterList: new Array
    }
    this.characters.forEach(item => {
      if (!unique.mainCharacterList.includes(item.mainsCharacterName)) {
        unique.mainCharacterList.push(item.mainsCharacterName)
      }
    })



    obj = Object.assign(unique, obj)

    let dialogRef;
    if (action == 'Add') {
      var buffdata: Buffs[] = []
      dialogRef = this.dialog.open(ModalComponent, {
        height: '500px',
        width: '400px',
        data: { char: new Characters('', false, this.characters.find(char => char.main == true)!.charName, new SpecData('', '', buffdata), new SpecData('', '', buffdata)), action: "Add" }
      });
    } else {
      var compMain = obj.main;
      var compPrimarySpecName = obj.primarySpec.specName;
      var compOffSpecName = obj.offSpec.specName;
      dialogRef = this.dialog.open(ModalComponent, {
        height: '500px',
        width: '400px',
        data: { char: obj, action: "Edit" },
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.completeAction) {

          if (result.data.action == 'Add') {
            result.data.char.userOwner = this.discordID;
            this.rosterService.addCharacter(result.data.char).subscribe(data => {
              this.characters.push(result.data.char)
              this.characters = [...this.characters];  //refresh the dataSource
              this.openSnackBar("Successfully added: " + result.data.char.charName + ".")
            })
          } else if (result.data.action == 'Edit') {
            if (compMain != result.data.char.main || compPrimarySpecName != result.data.char.primarySpec.specName || compOffSpecName != result.data.char.offSpec.specName) {
              this.rosterService.updateCharacter(result.data.char).subscribe(data => {
                this.characters.forEach(element => {
                  if (element.charName == result.data.char.charName) {
                    element.primarySpec.specName = result.data.char.primarySpec.specName;
                    element.offSpec.specName = result.data.char.offSpec.specName;
                    console.log(result.data.char.main)
                    element.main = result.data.char.main;
                  }
                })
                this.characters = [...this.characters];  //refresh the dataSource
              })
            }

            this.openSnackBar("Successfully updated: " + result.data.char.charName + ".")
          }

        }


      }
    });


  }

  refresh() {
    this.getRoster()
  }

  getRoster() {
    this.rosterService.getRosterforUser(this.discordID)
      .subscribe((response: ICharacter[]) => {
        this.characters = response;
        console.log(this.characters)
      },
        (err: any) => console.log(err),
        () => {
        });
  }

  ToggleToLootSheet(data: any) {
    var char: ICharacter = data;

    this.lootSheetInitModel = new lootSheetInitiateModel(char.primarySpec.specName.substring(char.primarySpec.specName.lastIndexOf(" ") + 1), char.primarySpec.specName, char.offSpec.specName, char.charName)

    this.characterName = char.charName
    this.toggleToLootSheet = true;
    this.emitEventToChild()
  }

  emitEventToChild() {
    this.eventsSubject.next(this.lootSheetInitModel);
  }

  ReturnToCharactersPage() {
    this.toggleToLootSheet = false;
  }

  openSnackBar(text: string) {
    this._snackBar.open(text, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000
    });
  }
}