import { Component, OnInit } from '@angular/core';
import { Items } from '../loot-manager/loot-config/models/items';
import { MasterLootSheetModel } from '../loot-manager/loot-config/models/MasterLootSheetModel';
import { LootService } from '../loot-manager/loot-config/services/loot.service';
import { ConfigModel } from '../models/configModel';
import { RaidModel } from '../raid-manager/models/RaidModel';
import { raidService } from '../raid-manager/service/raid.service';
import { ConfigService } from '../service/config.service';
import * as moment from 'moment';
import { RaidWeekModel } from '../raid-manager/models/RaidWeekModel';
import { AttendanceModelWithDate } from './models/AttendanceModelWithDate';
import { AttendanceModiferObject } from './models/AttendanceModiferObject';
import { CharacterAttendancePercentageModel } from './models/CharacterAttendancePercentageModel';


@Component({
  selector: 'app-master-loot-sheet',
  templateUrl: './master-loot-sheet.component.html',
  styleUrls: ['./master-loot-sheet.component.css']
})
export class MasterLootSheetComponent implements OnInit {
  phases: string[] = []
  configs: ConfigModel[] = [];
  items: Items[] = [];

  itemsInPhase: Items[] = [];
  selectedPhase: number = 0;
  uniqueRaids: string[] = [];
  bossesForRaid: string[] = [];
  allRaids: RaidModel[] = []
  masterLootSheet: MasterLootSheetModel[] = [];

  disableRaidSelector: boolean = true;
  disableBossSelector: boolean = true;
  disablePhaseSelector: boolean = false;
  selectedRaid: string = "";
  selectedBoss: string = "";
  sixteenWeekIds: string[];
  RaidWeeks: RaidWeekModel[] = [];
  CharacterAttendancePercentage: CharacterAttendancePercentageModel[] = [];



  constructor(private lootService: LootService, private configService: ConfigService, private raidService: raidService) {

  }

  ngOnInit(): void {

    this.configService.getConfig().subscribe(data => {
      this.configs = data
      this.setPhaseDropdown()

    });

    this.lootService.getItems().subscribe(data => {
      this.items = data
    })

    this.lootService.getMasterLootsheet().subscribe(data => {
      this.masterLootSheet = data

    })

    this.raidService.getRaids().subscribe(raids => {
      this.allRaids = raids;
      this.raidService.getRaidWeeks().subscribe(data => {
        this.RaidWeeks = data

        var prevTuesday = new Date();
        prevTuesday.setDate(prevTuesday.getDate() - (prevTuesday.getDay() + 5) % 7);
        prevTuesday.setHours(10, 0, 0)
        var SixteenWeekWindowDate = new Date()
        SixteenWeekWindowDate.setDate(prevTuesday.getDate() - 112);
        SixteenWeekWindowDate.setHours(10, 0, 0)
        prevTuesday = (moment(prevTuesday.setHours(10, 0, 0)).toDate())

        var WeekObjectsToUse: RaidWeekModel[] = []
        this.RaidWeeks.forEach(week => {
          if (WeekObjectsToUse.length < 16) {
            if (moment(week.start_dt).toDate() >= SixteenWeekWindowDate && moment(week.end_dt).toDate() <= prevTuesday) {
              WeekObjectsToUse.push(week)
            }
          }
        })
        this.RaidWeeks = WeekObjectsToUse
        this.GenerateCharacterAttendanceModifier()
      })

    })
  }


  GenerateCharacterAttendanceModifier() {
    var allChars: string[] = [];
    this.masterLootSheet.forEach(sheet => {
      if (allChars.length == 0 || allChars.filter(name => name == sheet.charName).length == 1) {
        allChars.push(sheet.charName)
      }
    })

    var prevTuesday = new Date();
    prevTuesday.setDate(prevTuesday.getDate() - (prevTuesday.getDay() + 5) % 7);
    prevTuesday.setHours(0, 0, 0);
    prevTuesday = (moment(prevTuesday.setHours(10, 0, 0)).toDate());

    var SixteenWeekWindowDate = new Date();
    SixteenWeekWindowDate.setDate(prevTuesday.getDate() - 112);
    SixteenWeekWindowDate.setHours(0, 0, 0);


    var TwoWeekWindowDate = new Date()
    TwoWeekWindowDate.setDate(prevTuesday.getDate() - 15);
    TwoWeekWindowDate.setHours(0, 0, 0);

    //code will give all raid attendance rows for each character for the past 16 weeks
    allChars.forEach(char => {
      var filteredAttendanceByChar: AttendanceModelWithDate[] = [];

      this.allRaids.forEach(raid => {
        if (moment(raid.raid_date).toDate() > SixteenWeekWindowDate && moment(raid.raid_date).toDate() < prevTuesday) {
          var AttModelArray = raid.attendance.filter(att => att.char_name == char)
          AttModelArray.forEach(model => {
            filteredAttendanceByChar.push(new AttendanceModelWithDate(model.raid_id, raid.raid_date, model.char_name, model.present, model.used_time_off))
          })
        }
      })

      //modifier to account for less than 8 weeks of raids
      var mod: number = 0;
      if (this.RaidWeeks.length < 8) {
        mod = (8 - this.RaidWeeks.length) * 2
      }


      var newObj: AttendanceModiferObject = new AttendanceModiferObject(char, (this.RaidWeeks.filter(week => week.req_raids_for_attendance).length * 2), 0)
 
      var tieBreakerCount: number = 0;     
      //var weeksMetFullAttend:number = 0;
      this.RaidWeeks.forEach(week => {
        //code to check required attendance based on days

        if(week.req_raids_for_attendance ==0){
          newObj.weeks_present_for_raids += 2
        }else if(week.req_raids_for_attendance==1){
          if (filteredAttendanceByChar.filter(row => moment(row.raid_date).toDate() >= moment(week.start_dt).toDate() && moment(row.raid_date).toDate() <= moment(week.end_dt).toDate() && row.present == true).length >= week.req_raids_for_attendance) {
            newObj.weeks_present_for_raids += 2
          }
        }else if(week.req_raids_for_attendance==2){
          if (filteredAttendanceByChar.filter(row => moment(row.raid_date).toDate() >= moment(week.start_dt).toDate() && moment(row.raid_date).toDate() <= moment(week.end_dt).toDate() && row.present == true).length >= week.req_raids_for_attendance) {
            newObj.weeks_present_for_raids += 2
          } else if(filteredAttendanceByChar.filter(row => moment(row.raid_date).toDate() >= moment(week.start_dt).toDate() && moment(row.raid_date).toDate() <= moment(week.end_dt).toDate() && row.present == true).length == 1){
            newObj.weeks_present_for_raids += 1
          }
        }

        //Code to check X out of Weeks attendance
        //  if (filteredAttendanceByChar.filter(row => moment(row.raid_date).toDate() >= moment(week.start_dt).toDate() && moment(row.raid_date).toDate() <= moment(week.end_dt).toDate() && row.present == true).length >= week.req_raids_for_attendance) {
        //   weeksMetFullAttend+=1
        //  }
    
        //code to check the two week tiebreaker -------not checking against req attendance
        if (moment(week.start_dt).toDate() >= TwoWeekWindowDate) {
          if (filteredAttendanceByChar.filter(row => moment(row.raid_date).toDate() >= moment(week.start_dt).toDate() && moment(row.raid_date).toDate() <= moment(week.end_dt).toDate() && row.present == true).length >= week.req_raids_for_attendance) {
            tieBreakerCount +=1;
          }
        }
      });

      var tieBreaker: boolean = false;
      if (tieBreakerCount==2){
        tieBreaker=true;
      }

      // var badLuckProtection: boolean = false;
      // if (weeksMetFullAttend>=9){
      //   badLuckProtection=true
      // }


      //use this row when checking days out of 16 ayttendnace
      console.log("MOD: "+mod)
      console.log("Attend: " +newObj.weeks_present_for_raids)
      this.CharacterAttendancePercentage.push(new CharacterAttendancePercentageModel(char, newObj.weeks_present_for_raids / 16, tieBreaker))


      //use this row when checking week attendance
     // this.CharacterAttendancePercentage.push(new CharacterAttendancePercentageModel(char, newObj.weeks_present_for_raids / newObj.weeks_to_check_against, tieBreaker))

    })
  }


  setPhaseDropdown() {
    this.configs.forEach(config => {
      if (config.name == "p1_show_in_master_cb" && config.value == 'true') {
        this.phases.push("Phase 1")
      }
      if (config.name == "p2_show_in_master_cb" && config.value == 'true') {
        this.phases.push("Phase 2")
      }
      if (config.name == "p3_show_in_master_cb" && config.value == 'true') {
        this.phases.push("Phase 3")
      }
      if (config.name == "p4_show_in_master_cb" && config.value == 'true') {
        this.phases.push("Phase 4")
      }
    })
    if (this.phases.length == 0) {
      this.disablePhaseSelector = true
    }


  }

  PopulateMasterSheetForPhase() {
    this.uniqueRaids = [... new Set(this.itemsInPhase.map(data => data.raid))]
    this.bossesForRaid = [... new Set(this.itemsInPhase.map(data => data.item_source))]
  }
  ChangePhase(data: any) {
    this.selectedPhase = parseInt(data.value.substring(data.value.length - 1));

    this.itemsInPhase = this.items.filter(item => item.item_phase == this.selectedPhase)

    this.disableRaidSelector = false;
    this.PopulateMasterSheetForPhase()
  }
  SelectRaid(data: any) {

    if (typeof (data.value) == "undefined") {
      this.disableBossSelector = true
      this.selectedBoss = ""
      this.selectedRaid = "";
      this.bossesForRaid = [... new Set(this.itemsInPhase.map(data => data.item_source))]
    } else {
      this.selectedBoss = ""
      this.selectedRaid = data.value;
      this.bossesForRaid = [... new Set(this.itemsInPhase.filter(item => item.raid == this.selectedRaid).map(data => data.item_source))]
      this.disableBossSelector = false;
    }
  }
  SelectBoss(data: any) {

    if (typeof (data.value) == "undefined") {
      this.selectedBoss = "";
    } else {

      this.selectedBoss = data.value;
    }
  }

  filterRaids() {

    if (this.selectedRaid == "") {
      return this.uniqueRaids
    } else {
      return new Array(this.selectedRaid)
    }
  }

  filterItemsToBoss(boss: string) {
    if (this.selectedRaid != "") {
      if (this.selectedBoss != "") {
        return this.itemsInPhase.filter(item => item.item_source == boss && item.raid == this.selectedRaid && item.item_source == this.selectedBoss)
      } else {
        return this.itemsInPhase.filter(item => item.item_source == boss && item.raid == this.selectedRaid)
      }

    } else {
      return this.itemsInPhase.filter(item => item.item_source == boss)
    }

  }

  filterBossesToRaid(raid: string) {
    let result;
    if (this.selectedBoss != "") {
      result = [...new Set(
        this.itemsInPhase.filter(o => o.raid === raid && o.item_source == this.selectedBoss)
          .reduce((c, v) => c.concat(v.item_source.split(',')), [] as string[])
          .map(o => o.trim()))
      ]
    } else {
      result = [...new Set(
        this.itemsInPhase.filter(o => o.raid === raid)
          .reduce((c, v) => c.concat(v.item_source.split(',')), [] as string[])
          .map(o => o.trim()))
      ]
    }
    return result
  }

  filterAndFormatSheetCells(item_id: number) {
    var cellsForItem = this.masterLootSheet.filter(mls => mls.item_id == item_id)

    cellsForItem.forEach(cell => {
      cell.displayValue = parseInt(cell.slot.substring(0, cell.slot.indexOf("-")))
      var percentForCharacter: number | undefined = this.CharacterAttendancePercentage.find(char => char.char_name == cell.charName)?.bonus
      if (typeof percentForCharacter != 'undefined') {
        cell.displayValue += percentForCharacter
      }

      var tiebreaker: boolean | undefined = this.CharacterAttendancePercentage.find(char => char.char_name == cell.charName)?.tiebreaker
      if (typeof tiebreaker != 'undefined') {
        if (tiebreaker) {
          cell.displayValue += .5
        }
      }
    })

    cellsForItem = cellsForItem.sort((a, b) => b.displayValue - a.displayValue)

    return cellsForItem
  }

  calculateSlotValue(charName: string, slot: string) {
    var sheetValue = parseInt(slot.substring(0, slot.indexOf("-")))

    //apply the modifier for attendance
    var percentForCharacter: number | undefined = this.CharacterAttendancePercentage.find(char => char.char_name == charName)?.bonus
    if (typeof percentForCharacter != 'undefined') {
      sheetValue += percentForCharacter
    }

    var tiebreaker: boolean | undefined = this.CharacterAttendancePercentage.find(char => char.char_name == charName)?.tiebreaker
    if (typeof tiebreaker != 'undefined') {
      if (tiebreaker) {
        sheetValue += .5
      }

    }

    return sheetValue;
  }
}