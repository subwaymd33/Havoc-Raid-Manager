import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../roster/modal/modal/modal.component';
import { Buffs } from '../roster/models/Buffs';
import { Characters } from '../roster/models/Characters';
import { SpecData } from '../roster/models/SpecData';
import { RosterService } from '../services/roster.service';
import { ICharacter } from '../shared/interfaces';
import { faUser, faPlus, faAlignJustify, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { ignoreElements, Subject } from 'rxjs';
import { lootSheetInitiateModel } from './models/lootSheetInitiateModel';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../services/snackbar.service';
import { CookieService } from 'ngx-cookie-service';


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


  constructor(private rosterService: RosterService, public dialog: MatDialog, private snackBarService: SnackbarService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.discordID = this.cookieService.get("dID")!
    this.username = this.cookieService.get("username")!
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
      if (!unique.mainCharacterList.includes(item.mains_name)) {
        unique.mainCharacterList.push(item.mains_name)
      }
    })



    obj = Object.assign(unique, obj)

    let dialogRef;
    if (action == 'Add') {
      var buffdata: Buffs[] = []
      dialogRef = this.dialog.open(ModalComponent, {
        height: '500px',
        width: '400px',
        data: { char: new Characters('', "", this.characters.find(char => char.rank == environment.MAIN_RAIDER_RANK_NAME)!.char_name, new SpecData('', '', buffdata), new SpecData('', '', buffdata)), action: "Add" }
      });
    } else {
      var compRank = obj.rank;
      var compPrimarySpecName = obj.primarySpec.spec_name;
      var compOffSpecName = obj.offSpec.spec_name;
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
              this.snackBarService.openSnackBar("Successfully added: " + result.data.char.char_name + ".")
              
            })
          } else if (result.data.action == 'Edit') {
            if (compRank != result.data.char.rank || compPrimarySpecName != result.data.char.primarySpec.spec_name || compOffSpecName != result.data.char.offSpec.spec_name) {
              this.rosterService.updateCharacter(result.data.char).subscribe(data => {
                this.characters.forEach(element => {
                  if (element.char_name == result.data.char.char_name) {
                    element.primarySpec.spec_name = result.data.char.primarySpec.spec_name;
                    element.offSpec.spec_name = result.data.char.offSpec.spec_name;
                    element.rank = result.data.char.rank;
                  }
                })
                this.characters = [...this.characters];  //refresh the dataSource
              })
            }
            this.snackBarService.openSnackBar("Successfully updated: " + result.data.char.char_name + ".")
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

    this.lootSheetInitModel = new lootSheetInitiateModel(char.primarySpec.spec_name.substring(char.primarySpec.spec_name.lastIndexOf(" ") + 1), char.primarySpec.spec_name, char.offSpec.spec_name, char.char_name, char.rank)

    this.characterName = char.char_name
    this.toggleToLootSheet = true;
    this.emitEventToChild()
  }

  emitEventToChild() {
    this.eventsSubject.next(this.lootSheetInitModel);
  }

  ReturnToCharactersPage() {
    this.toggleToLootSheet = false;
  }
}
