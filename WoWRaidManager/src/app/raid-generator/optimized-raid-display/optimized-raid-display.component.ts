import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IBuffs, ICharacter } from 'src/app/shared/interfaces';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'optimized-raid-display',
  templateUrl: './optimized-raid-display.component.html',
  styleUrls: ['./optimized-raid-display.component.css']
})
export class OptimizedRaidDisplayComponent implements OnInit {
  facheck = faCheckCircle;


  @Input() optimizedRaid: ICharacter[];

  buffCollection: IBuffs[] = []
  buffDesc: string = "Select a Buff/Debuff above to see effect."
  selectedBuffName:string=''
  selectedIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    this.parseBuffs(changes['optimizedRaid'].currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

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

  getStyleList(char: ICharacter) {
    if (char.primarySpec.buffs.some(b => b.buff_name == this.selectedBuffName)) {
      return { 'box-shadow': '0 0 10px #2ba805' };
    } else {
      return null;
    }
  }

  showCheck(char: ICharacter) {
    if (char.primarySpec.buffs.some(b => b.buff_name == this.selectedBuffName)) {
      return true
    } else {
      return false;
    }
  }

  parseBuffs(data: ICharacter[]) {
    this.buffCollection.splice(0);
    data.forEach(x => {
      //generate ria dbuff collection
      x.primarySpec.buffs.forEach(b => {
        if (this.buffCollection.some(q => q.buff_code == b.buff_code)) {
          if (this.buffCollection.some(q => (q.buff_code == b.buff_code && b.buff_weight > q.buff_weight))) {
            //found item where weight is higher and buff code is the same
            // console.log("Replacing Item as new Weight is higher")
            var foundBuff = this.buffCollection.find(q => (q.buff_code == b.buff_code && b.buff_weight > q.buff_weight))
            var index = this.buffCollection.indexOf(foundBuff!)
            this.buffCollection[index] = b
          }
        } else {
          // console.log("New Code Found. Adding to Buff cOllection")
          // console.log("BuffCode : " + b.buffCode)

          this.buffCollection.push(b)
        }
      })
    })
    this.buffCollection = this.buffCollection.sort((a, b) => {
      return parseInt(a.buff_code) - parseInt(b.buff_code)
    })
  }

  buffButtonClick(buff: IBuffs, i: any) {
    console.log(buff)
    console.log(i)
    this.selectedIndex = i;
    this.buffDesc = buff.buff_text;
    this.selectedBuffName = buff.buff_name
  }
}
