import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RosterService } from '../services/roster.service';
import { ICharacter } from '../shared/interfaces';
import { GeneratorService } from '../services/generator.service';

@Component({
  selector: 'app-raid-generator',
  templateUrl: './raid-generator.component.html',
  styleUrls: ['./raid-generator.component.css']
})
export class RaidGeneratorComponent implements OnInit {

  hideProgress = true;
  hideTabs = true;
  raidSizeValues = [10, 25]

  tenManTankValues = [1, 2]
  tenManHealValues = [1, 2]
  tenManRDPSValues = [1, 2, 3, 4, 5, 6]
  tenManMDPSValues = [1, 2, 3, 4, 5, 6]

  twentyFiveManTankValues = [1, 2, 3]
  twentyFiveManHealValues = [1, 2, 3, 4, 5]
  twentyFiveManRDPSValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  twentyFiveManMDPSValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  tankSelectorValues = this.twentyFiveManTankValues
  healerSelectorValues = this.twentyFiveManHealValues
  rDPSSelectorValues = this.twentyFiveManRDPSValues
  mDPSSelectorValues = this.twentyFiveManMDPSValues



  roster: ICharacter[] = [];
  RaidCollection: any = []
  optimizedRaid: ICharacter[] = [];

  showRaids = false;

  RaidGeneratorSettings: FormGroup;

  constructor(public rosterService: RosterService, public generatorService: GeneratorService) {
    this.RaidGeneratorSettings = new FormGroup({
      tanks: new FormControl(['', Validators.required]),
      healer: new FormControl('', Validators.required),
      rDPS: new FormControl('', Validators.required),
      mDPS: new FormControl('', Validators.required),
      raidSize: new FormControl('', Validators.required),
    })
    this.getRoster()
  }

  ngOnInit(): void {

  }

  generateRaidComp() {
    this.hideProgress = false;
    this.hideTabs = true;
    this.RaidCollection.splice(0)
    let tankCount = this.RaidGeneratorSettings.controls['tanks'].value
    let healerCount = this.RaidGeneratorSettings.controls['healer'].value
    let rDPSCount = this.RaidGeneratorSettings.controls['rDPS'].value
    let mDPSCount = this.RaidGeneratorSettings.controls['mDPS'].value
    let raidSize = this.RaidGeneratorSettings.controls['raidSize'].value


    this.generatorService.processRaidComp(this.roster, raidSize, tankCount, healerCount, rDPSCount, mDPSCount).subscribe(data => {
      console.log(data)
      this.hideProgress = true;
      this.hideTabs = false;
      for (let i = 0; i < data.length; i++) {
        this.RaidCollection[i] = data[i]
      }
    })
  }
  resetControls() {
    this.hideTabs = true;
    this.hideProgress = true;
    this.RaidCollection.splice(0)
    this.RaidGeneratorSettings.reset()
  }
  getRoster() {
    this.rosterService.getRoster()
      .subscribe((response: ICharacter[]) => {
        this.roster = response;
      },
        (err: any) => console.log(err),
        () => {
          console.log('getRoster() retrieved characters')
        });
  }

  raidSizeChanged(data: any) {
    if (data.value == 25) {
      this.tankSelectorValues = this.twentyFiveManTankValues
      this.healerSelectorValues = this.twentyFiveManHealValues
      this.rDPSSelectorValues = this.twentyFiveManRDPSValues
      this.mDPSSelectorValues = this.twentyFiveManMDPSValues
    } else if (data.value == 10) {
      this.tankSelectorValues = this.tenManTankValues
      this.healerSelectorValues = this.tenManHealValues
      this.rDPSSelectorValues = this.tenManRDPSValues
      this.mDPSSelectorValues = this.tenManMDPSValues
    }
  }

}
