import { Component, OnInit, ViewChildren } from '@angular/core';
import { raidService } from './service/raid.service';
import { v4 as uuidv4 } from 'uuid';
import { AttendanceModel } from './models/AttendanceModel';
import { RaidDropModel } from './models/RaidDropModel';
import { LootService } from '../loot-manager/loot-config/services/loot.service';
import { Items } from '../loot-manager/loot-config/models/items';
import { RaidModel } from './models/RaidModel';
import { AddonImportModalComponent } from './modals/addon-import-modal/addon-import-modal.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {  faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AddAttendanceModalComponent } from './modals/add-attendance-modal/add-attendance-modal.component';


export interface DialogData {
  raid_name: string;
  raid: RaidModel;
}

@Component({
  selector: 'app-raid-manager',
  templateUrl: './raid-manager.component.html',
  styleUrls: ['./raid-manager.component.css']
})
export class RaidManagerComponent implements OnInit {
  plusGlyph = faPlusCircle;

  inputString: string;
  raidName: string;

  existingRaids:RaidModel[] = []
  raidDate: Date;
  items: Items[] = [];
  workingRaid: RaidModel;
  submitButtonDisabled: boolean=true;
  hideAddAttendance:boolean = true

  dialogConfig = new MatDialogConfig();
  modalDialogImport: MatDialogRef<AddonImportModalComponent, any> | undefined;
  modalDialogAttendance: MatDialogRef<AddAttendanceModalComponent, any> | undefined;


  constructor(private raidService: raidService, private lootService: LootService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.lootService.getItems().subscribe(items => {
      this.items = items;
    })
    this.workingRaid = new RaidModel("", new Date(), "")
  }
  ngAfterViewInit(): void {
    document.onclick = (args: any): void => {
      if (args.target.tagName === 'BODY') {
        this.modalDialogImport?.close()
      }
    }
    this.raidService.getRaids().subscribe(raids=>{
      this.existingRaids = raids
    })

  }

  CreateRaid() {
    this.modalDialogImport = this.matDialog.open(AddonImportModalComponent, {
      width: '40vw',
      height: '50vh',
      data: { name: this.raidName, inputString: this.inputString, phase: 0 },
    });
    //this.ProcessImportString(this.inputString)
    this.modalDialogImport.afterClosed().subscribe(result => {
      if (result){
        this.ProcessImportString(result.inputString, result.raid_name, result.phase)
        this.submitButtonDisabled=false;
      }
    });
  }

  SaveRaid(){

    this.raidService.insertNewRaid(this.workingRaid).subscribe(data =>{
      console.log(data)
    })
  }

  AttendanceChange(record:AttendanceModel, event:any ) {
    console.log('record:' , record );
    console.log('event:' , event );
    if (event.value=="present"){
      record.present=true;
      record.used_time_off=false
    }else if(event.value=="absent"){
      record.present=false;
      record.used_time_off=false
    }else{
      record.present=true;
      record.used_time_off=true
    }
 }
 ChangedSelectedRaid(selectedRaid:any){
  this.workingRaid  = selectedRaid.value
  if (this.workingRaid){
    this.hideAddAttendance=false;
  }
 }

  ProcessImportString(importString: string, raid_name:string, phase:number) {
    var raid_id = uuidv4()
    raid_id = phase + "-" + raid_id
    var attendance: AttendanceModel[] = [];
    var drops: RaidDropModel[] = [];
    //create the attendance objects
    var attend = importString.substring(0, importString.indexOf("Loot:")).trimEnd()
    attend = attend.substring(attend.lastIndexOf("\n")).trimStart()

    attend.split(";").forEach(charName => {
      var newAttendance = new AttendanceModel(raid_id, charName, true, false)
      attendance.push(newAttendance)
    })


    //create the loot drop objects
    var loot = importString.substring(importString.indexOf("Loot:")).trim()
    loot = loot.substring(loot.indexOf("\n")).trimStart()
    loot.split("\n").forEach(item => {
      var itemDetails = item.split(";")
      this.raidDate = new Date(itemDetails[0])
      var specificItemID = this.items.filter(item => item.item_name == itemDetails[1].replace("[", "").replace("]", ""))[0].item_id

      var newLootDrop = new RaidDropModel(raid_id, specificItemID, itemDetails[2].trim())
      drops.push(newLootDrop)
    })


    var newRaid: RaidModel = new RaidModel(raid_id, this.raidDate, raid_name)
    newRaid.drops = drops;
    newRaid.attendance = attendance
    this.workingRaid = newRaid;
    console.log(newRaid);
  }

  getDBLink(rdm: RaidDropModel) {
    return `https://wotlkdb.com?item==${this.items.filter(item => item.item_id == rdm.item_id)[0].wowhead_link}`
  }

  getItemLink(rdm: RaidDropModel) {
    return `item=${this.items.filter(item => item.item_id == rdm.item_id)[0].wowhead_link}`
  }
  getItemName(rdm: RaidDropModel) {
    return `${this.items.filter(item => item.item_id == rdm.item_id)[0].item_name}`
  }

  AddAttendanceRecord(){
    this.modalDialogAttendance = this.matDialog.open(AddAttendanceModalComponent, {
      width: '200px',
      height: '100px',
      data: { char_name: "" },
    });
    //this.ProcessImportString(this.inputString)
    this.modalDialogAttendance.afterClosed().subscribe(result => {
      if (result){
        this.workingRaid.attendance.push(new AttendanceModel(this.workingRaid.raid_id,result.char_name,false,false))
        this.submitButtonDisabled=false;
      }
    });
  }
}
