import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { RaidWeekModel } from '../models/RaidWeekModel';
import { raidService } from '../service/raid.service';

@Component({
  selector: 'app-raid-week-manager',
  templateUrl: './raid-week-manager.component.html',
  styleUrls: ['./raid-week-manager.component.css']
})
export class RaidWeekManagerComponent implements OnInit {
  submitButtonDisabled: boolean = true;
  hideWeekData: boolean = true;
  DaysRBFormGroup:FormGroup;
  raidWeeks: RaidWeekModel[] = []
  reqDays: number[] = [1, 2, 3]
  selectedWeek: RaidWeekModel;
  selectedDay: number =0;
  constructor(private raidService: raidService) {
    this.DaysRBFormGroup = new FormGroup({
      dayOneRB: new FormControl(),
      dayTwoRB: new FormControl(),
      dayThreeRB: new FormControl()     ,
      daysRBGroup: new FormControl()
    })
   }

  ngOnInit(): void {
    this.raidService.getRaidWeeks().subscribe(weeks => {
      this.raidWeeks = weeks

      this.raidWeeks.forEach(week => {
        week.start_dt = moment(week.start_dt).toDate()
        week.end_dt = moment(week.end_dt).toDate()
      })
    })
  }

  ChangedSelectedRaidWeek(data: any) {
    this.selectedWeek = data.value
    this.hideWeekData = false;

    this.DaysRBFormGroup.controls['daysRBGroup'].setValue(this.selectedWeek.req_raids_for_attendance)


  }

  enableSave(event:any){
    this.selectedWeek.req_raids_for_attendance =event.value
    this.submitButtonDisabled=false;
  }
  SaveWeek() {

    console.log(this.selectedWeek)
    this.raidService.UpdateWeeks(this.selectedWeek).subscribe(data=>{
      console.log(data)
    })



    this.submitButtonDisabled=true
  }

}
