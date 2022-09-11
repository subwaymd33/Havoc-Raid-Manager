import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ICharacter } from 'src/app/shared/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { RosterService } from 'src/app/services/roster.service';
import { environment } from 'src/environments/environment';
import { LootService } from 'src/app/services/loot.service';


@Component({
  selector: 'roster-card',
  templateUrl: './roster-card.component.html',
  styleUrls: ['./roster-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RosterCardComponent implements OnInit {
  @Output() refreshData = new EventEmitter<string>();
  @Output() editCharacterEvent = new EventEmitter<ICharacter>();
  
  @Input() characters: ICharacter[] = [];
  dataSource = new MatTableDataSource(this.characters);
  @ViewChild('paginator') paginator: MatPaginator;
  obs: Observable<any>;
  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(public rosterService: RosterService, public lootService: LootService) {
  }

  ngOnChanges() {
    if (this.dataSource) {
      this.dataSource = new MatTableDataSource(this.characters);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    }
  }

  getSpecImage(spec: string) {
    let returnValue;
    switch (spec) {
      case 'Fire Mage':
        returnValue = "url('/assets/icons/Fire Mage.png')";
        break;
      case 'Frost Mage':
        returnValue = "url('/assets/icons/Frost Mage.png')";
        break;
      case 'Arcane Mage':
        returnValue = "url('/assets/icons/Arcane Mage.png')";
        break;
      case 'Affliction Warlock':
        returnValue = "url('/assets/icons/Affliction Warlock.png')";
        break;
      case 'Destruction Warlock':
        returnValue = "url('/assets/icons/Destruction Warlock.png')";
        break;
      case 'Demonology Warlock':
        returnValue = "url('/assets/icons/Demonology Warlock.png')";
        break;
      case 'Arms Warrior':
        returnValue = "url('/assets/icons/Arms Warrior.png')";
        break;
      case 'Fury Warrior':
        returnValue = "url('/assets/icons/Fury Warrior.png')";
        break;
      case 'Protection Warrior':
        returnValue = "url('/assets/icons/Protection Warrior.png')";
        break;
      case 'Assasination Rogue':
        returnValue = "url('/assets/icons/Assasination Rogue.png')";
        break;
      case 'Combat Rogue':
        returnValue = "url('/assets/icons/Combat Rogue.png')";
        break;
      case 'Subtlety Rogue':
        returnValue = "url('/assets/icons/Subtlety Rogue.png')";
        break;
      case 'Balance Druid':
        returnValue = "url('/assets/icons/Balance Druid.png')";
        break;
      case 'Feral (Bear) Druid':
        returnValue = "url('/assets/icons/Feral (Bear) Druid.png')";
        break;
      case 'Feral (Cat) Druid':
        returnValue = "url('/assets/icons/Feral (Cat) Druid.png')";
        break;
      case 'Restoration Druid':
        returnValue = "url('/assets/icons/Restoration Druid.png')";
        break;
      case 'Beast Mastery Hunter':
        returnValue = "url('/assets/icons/Beast Mastery Hunter.png'";
        break;
      case 'Marksmanship Hunter':
        returnValue = "url('/assets/icons/Marksmanship Hunter.png')";
        break;
      case 'Survival Hunter':
        returnValue = "url('/assets/icons/Survival Hunter.png')";
        break;
      case 'Frost Death Knight':
        returnValue = "url('/assets/icons/Frost Death Knight.png'";
        break;
      case 'Blood Death Knight':
        returnValue = "url('/assets/icons/Blood Death Knight.png')";
        break;
      case 'Unholy Death Knight':
        returnValue = "url('/assets/icons/Unholy Death Knight.png')";
        break;
      case 'Holy Priest':
        returnValue = "url('/assets/icons/Holy Priest.png'";
        break;
      case 'Discipline Priest':
        returnValue = "url('/assets/icons/Discipline Priest.png')";
        break;
      case 'Shadow Priest':
        returnValue = "url('/assets/icons/Shadow Priest.png')";
        break;
      case 'Elemental Shaman':
        returnValue = "url('/assets/icons/Elemental Shaman.png'";
        break;
      case 'Restoration Shaman':
        returnValue = "url('/assets/icons/Restoration Shaman.png')";
        break;
      case 'Enhancement Shaman':
        returnValue = "url('/assets/icons/Enhancement Shaman.png')";
        break;
      case 'Holy Paladin':
        returnValue = "url('/assets/icons/Holy Paladin.png'";
        break;
      case 'Protection Paladin':
        returnValue = "url('/assets/icons/Protection Paladin.png')";
        break;
      case 'Retribution Paladin':
        returnValue = "url('/assets/icons/Retribution Paladin.png')";
        break;


      default:
        returnValue = 'white';
    }
    return returnValue;
  }

  mainCharacterNameDisplay(name:string, rank:string):string{
    if (rank==environment.MAIN_RAIDER_RANK_NAME||rank==environment.SOCIAL_RAIDER_RANK_NAME){
      return rank
    
    }else{
      return "Alt Character. Main is " + name +"."
    }
  }
  offSpecNameDisplay(name:string) :string{
    if (name !=null){
      return "Off-Spec: "+name
    
    }else{
      return ""
    }
  }
  geBackgrounColorforClass(spec: string) {
    let returnValue;
    if (spec.includes("Mage")) {
      returnValue = "rgb(63, 199, 235) !important";
    } else if (spec.includes("Druid")) {
      returnValue = "rgb(255, 124, 10) !important";
    } else if (spec.includes("Death Knight")) {
      returnValue = "rgb(196, 30, 58) !important";
    } else if (spec.includes("Warlock")) {
      returnValue = "rgb(135 , 136, 238) !important";
    } else if (spec.includes("Warrior")) {
      returnValue = "rgb(198, 155, 109) !important";
    } else if (spec.includes("Shaman")) {
      returnValue = "rgb(0, 112, 221) !important";
    } else if (spec.includes("Priest")) {
      returnValue = "rgb(255, 255, 255) !important";
    } else if (spec.includes("Rogue")) {
      returnValue = "rgb(255, 244, 104) !important";
    } else if (spec.includes("Hunter")) {
      returnValue = "rgb(170, 211, 114) !important";
    } else if (spec.includes("Paladin")) {
      returnValue = "rgb(244, 140, 186) !important";
    }
    return returnValue;
  }

  ngOnInit(): void {
  }

  deleteCharacter(char: ICharacter) {
    console.log("Event Handler: Delete")

    this.rosterService.getCharUIDByCharName(char.char_name).subscribe(resp1 => {
      let charUID = resp1[0].charUID;
      this.rosterService.deleteCharacter(charUID).subscribe(resp => {
        if (resp.status != 200) {

         
          throw Error("Cannot delete your item from list");
        } else {
      
          this.refreshData.emit();
        }
      })
    })
  }

  editCharacter(char:ICharacter){
    this.editCharacterEvent.emit(char)
  }
}