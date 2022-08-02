import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { IClasses, ISpecs } from 'src/app/shared/interfaces';
import { CharWithActionModel } from 'src/app/user-page/user-page.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  //value for new/edit
  userGylph = faUser;
  showOffSpec = false;
  hideMainSelector = true;
  specData: ISpecs[] = []
  action: string;
  character: CharWithActionModel;
  reactiveForm: FormGroup;
  characterNameDisabled=true;
  classesDisabled=true;
  completedAction:boolean = false;
  ngOnInit() {

  }
  ranks: IClasses[] = [
    { value: 'rank-1', viewValue: environment.MAIN_RAIDER_RANK_NAME },
    { value: 'rank-2', viewValue: environment.SOCIAL_RAIDER_RANK_NAME },
    { value: 'rank-3', viewValue: environment.ALT_RAIDER_RANK_NAME },
  ]

  classesData: IClasses[] = [
    { value: 'class-01', viewValue: 'Death Knight' },
    { value: 'class-02', viewValue: 'Druid' },
    { value: 'class-03', viewValue: 'Hunter' },
    { value: 'class-04', viewValue: 'Mage' },
    { value: 'class-05', viewValue: 'Paladin' },
    { value: 'class-06', viewValue: 'Priest' },
    { value: 'class-07', viewValue: 'Rogue' },
    { value: 'class-08', viewValue: 'Shaman' },
    { value: 'class-09', viewValue: 'Warlock' },
    { value: 'class-10', viewValue: 'Warrior' },
  ]

  dKSpecs: ISpecs[] = [
    { value: 'dk-spec-01', viewValue: 'Blood' },
    { value: 'dk-spec-02', viewValue: 'Frost' },
    { value: 'dk-spec-03', viewValue: 'Unholy' },
  ]
  druidSpecs: ISpecs[] = [
    { value: 'druid-spec-01', viewValue: 'Balance' },
    { value: 'druid-spec-02', viewValue: 'Feral (Bear)' },
    { value: 'druid-spec-03', viewValue: 'Feral (Cat)' },
    { value: 'druid-spec-04', viewValue: 'Restoration' },
  ]
  hunterSpecs: ISpecs[] = [
    { value: 'hunter-spec-01', viewValue: 'Beast Mastery' },
    { value: 'hunter-spec-02', viewValue: 'Marksmanship' },
    { value: 'hunter-spec-03', viewValue: 'Survival' },
  ]
  mageSpecs: ISpecs[] = [
    { value: 'mage-spec-01', viewValue: 'Arcane' },
    { value: 'mage-spec-02', viewValue: 'Fire' },
    { value: 'mage-spec-03', viewValue: 'Frost' },
  ]
  paladinSpecs: ISpecs[] = [
    { value: 'paladin-spec-01', viewValue: 'Holy' },
    { value: 'paladin-spec-02', viewValue: 'Protection' },
    { value: 'paladin-spec-03', viewValue: 'Retribution' },
  ]
  priestSpecs: ISpecs[] = [
    { value: 'priest-spec-01', viewValue: 'Discipline' },
    { value: 'priest-spec-02', viewValue: 'Holy' },
    { value: 'priest-spec-03', viewValue: 'Shadow' },
  ]
  rogueSpecs: ISpecs[] = [
    { value: 'rogue-spec-01', viewValue: 'Assasination' },
    { value: 'rogue-spec-02', viewValue: 'Combat' },
    { value: 'rogue-spec-03', viewValue: 'Subtlety' },
  ]
  shamanSpecs: ISpecs[] = [
    { value: 'shaman-spec-01', viewValue: 'Elemental' },
    { value: 'shaman-spec-02', viewValue: 'Enhancement' },
    { value: 'shaman-spec-03', viewValue: 'Restoration' },
  ]
  warlockSpecs: ISpecs[] = [
    { value: 'warlock-spec-01', viewValue: 'Affliction' },
    { value: 'warlock-spec-02', viewValue: 'Demonology' },
    { value: 'warlock-spec-03', viewValue: 'Destruction' },
  ]
  warriorSpecs: ISpecs[] = [
    { value: 'warrior-spec-01', viewValue: 'Arms' },
    { value: 'warrior-spec-02', viewValue: 'Fury' },
    { value: 'warrior-spec-03', viewValue: 'Protection' },
  ]

  setSpecBoxValues(data: any) {
    if (data.value == "class-04") {
      this.specData = this.mageSpecs;
    } else if (data.value == ("class-02")) {
      this.specData = this.druidSpecs;
    } else if (data.value == ("class-01")) {
      this.specData = this.dKSpecs;
    } else if (data.value == ("class-09")) {
      this.specData = this.warlockSpecs;
    } else if (data.value == ("class-10")) {
      this.specData = this.warriorSpecs;
    } else if (data.value == ("class-08")) {
      this.specData = this.shamanSpecs;
    } else if (data.value == ("class-06")) {
      this.specData = this.priestSpecs;
    } else if (data.value == ("class-07")) {
      this.specData = this.rogueSpecs;
    } else if (data.value == ("class-03")) {
      this.specData = this.hunterSpecs;
    } else if (data.value == ("class-05")) {
      this.specData = this.paladinSpecs;
    } else {
      this.specData = []
    }
    if (this.specData) {
      this.reactiveForm.controls['offSpecs'].enable()
      this.reactiveForm.controls['specs'].enable()
    } else {

      this.reactiveForm.controls['offSpecs'].disable()
      this.reactiveForm.controls['specs'].disable()
  
    }
  }
  setRankBoxValues(data: any) {
    if (data.value == 'rank-1') {
      this.hideMainSelector = true
    } else {
      this.hideMainSelector = false
    }
  }
  constructor(public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: CharWithActionModel) {
    this.character = data;
    
    this.action = data.action

    this.reactiveForm = new FormGroup({
      characterName: new FormControl([{disabled: true}, Validators.required]),
      classes: new FormControl({disabled: true}, Validators.required),
      specs: new FormControl('', Validators.required),
      rank: new FormControl('', Validators.required),
      offSpecs: new FormControl(''),
      main: new FormControl(''),
    })

    if(this.character.char.rank==environment.MAIN_RAIDER_RANK_NAME){
      this.reactiveForm.controls['rank'].setValue('rank-1')
    }else if(this.character.char.rank==environment.SOCIAL_RAIDER_RANK_NAME){
      this.reactiveForm.controls['rank'].setValue('rank-2')
    }else{
      this.reactiveForm.controls['rank'].setValue('rank-3')
      this.reactiveForm.controls['main'].setValue(this.character.char.mainsCharacterName)
      
    }

    if (this.action == 'Edit') {
      this.reactiveForm.controls['characterName'].disable()
      this.reactiveForm.controls['classes'].disable()
      this.setDataForEdit();
    } else {
      this.reactiveForm.controls['characterName'].setValue('')
      this.reactiveForm.controls['characterName'].enable()
      this.reactiveForm.controls['classes'].enable()
      this.reactiveForm.controls['specs'].disable()
      this.reactiveForm.controls['offSpecs'].disable()   
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ completeAction: false, data: this.character });
  }



  doAction() {
    //adding character name
    this.character.char.charName = this.reactiveForm.controls['characterName'].value;

    //Adding Spec Name
    this.classesData.forEach(element => {
      if (element.value == this.reactiveForm.controls['classes'].value) {
        this.specData.forEach(spec => {
          if (spec.value == this.reactiveForm.controls['specs'].value) {
            let str: string = spec.viewValue + " " + element.viewValue;
            this.character.char.primarySpec.specName = str;
          }
          if (spec.value == this.reactiveForm.controls['offSpecs'].value) {
            let str: string = spec.viewValue + " " + element.viewValue;
            this.character.char.offSpec.specName = str;
          }
        })

      }
    })




    //adding main or alt
    if (this.reactiveForm.controls['rank'].value == "rank-1") {
      this.character.char.rank = environment.MAIN_RAIDER_RANK_NAME
      this.character.char.mainsCharacterName = this.reactiveForm.controls['characterName'].value
    } else if(this.reactiveForm.controls['rank'].value == "rank-2"){
      this.character.char.rank = environment.SOCIAL_RAIDER_RANK_NAME
      this.character.char.mainsCharacterName = this.reactiveForm.controls['characterName'].value
    }else{
      this.character.char.rank = environment.ALT_RAIDER_RANK_NAME
      this.character.char.mainsCharacterName = this.reactiveForm.controls['main'].value
    }

    
    //this.local_data.name = this.classes.value
    this.dialogRef.close({ data: this.character, completeAction:true});
  }

  setDataForEdit() {
    this.reactiveForm.controls['characterName'].setValue(this.character.char.charName)

    this.classesData.forEach(element => {
      if (element.viewValue.includes(this.character.char.primarySpec.specName.split(' ').pop()!)) {
        this.reactiveForm.controls['classes'].setValue(element.value)
      }
    })
    this.setSpecBoxValues(this.reactiveForm.controls['classes'])

    this.specData.forEach(element => {
      if (element.viewValue.includes(this.character.char.primarySpec.specName.substring(0,this.character.char.primarySpec.specName.lastIndexOf(" ")))) {
        this.reactiveForm.controls['specs'].setValue(element.value)
      }
      if (this.character.char.offSpec.specName) {
        if (element.viewValue.includes(this.character.char.offSpec.specName.substring(0,this.character.char.offSpec.specName.lastIndexOf(" ")))) {
          this.reactiveForm.controls['offSpecs'].setValue(element.value)
        }
      }


    })

    if (this.character.char.rank == environment.MAIN_RAIDER_RANK_NAME) {
      this.reactiveForm.controls['rank'].setValue("rank-1")
    } else if(this.character.char.rank == environment.SOCIAL_RAIDER_RANK_NAME){
      this.reactiveForm.controls['rank'].setValue("rank-2")
    }else{
      this.reactiveForm.controls['rank'].setValue("rank-3")
    }



  }

};

