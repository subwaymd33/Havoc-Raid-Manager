import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { raidService } from 'src/app/services/raid.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { RaidWeekModel } from '../models/RaidWeekModel';


@Component({
  selector: 'app-raid-week-manager',
  templateUrl: './raid-week-manager.component.html',
  styleUrls: ['./raid-week-manager.component.css']
})
export class RaidWeekManagerComponent implements OnInit {
  submitButtonDisabled: boolean = true;
  hideWeekData: boolean = true;
  DaysRBFormGroup: FormGroup;
  AltDaysRBFormGroup:FormGroup;
  raidWeeks: RaidWeekModel[] = []
  reqDays: number[] = [1, 2, 3]
  selectedWeek: RaidWeekModel;
  selectedDay: number = 0;
  constructor(private raidService: raidService, private snackBarService:SnackbarService) {
    this.DaysRBFormGroup = new FormGroup({
      dayOneRB: new FormControl(),
      dayTwoRB: new FormControl(),
      dayThreeRB: new FormControl(),
      daysRBGroup: new FormControl()
    })
    this.AltDaysRBFormGroup = new FormGroup({
      altDayOneRB: new FormControl(),
      altDayTwoRB: new FormControl(),
      altDayThreeRB: new FormControl(),
      altDaysRBGroup: new FormControl()
    })
  }

  ngOnInit(): void {
    this.raidWeeks = this.raidService.getWeeks();
    console.log(this.raidWeeks)

    this.raidWeeks.forEach(week => {
      week.start_dt = moment(week.start_dt).toDate()
      week.end_dt = moment(week.end_dt).toDate()
    })
  }

  ChangedSelectedRaidWeek(data: any) {
    this.selectedWeek = data.value
    this.hideWeekData = false;

    this.DaysRBFormGroup.controls['daysRBGroup'].setValue(this.selectedWeek.req_raids_for_attendance)
    this.AltDaysRBFormGroup.controls['altDaysRBGroup'].setValue(this.selectedWeek.alt_req_raids_for_attendance)

  }

  enableSave(event: any) {
    this.selectedWeek.req_raids_for_attendance = event.value
    this.submitButtonDisabled = false;
  }
  altEnableSave(event: any) {
    this.selectedWeek.alt_req_raids_for_attendance = event.value
    this.submitButtonDisabled = false;
  }
  SaveWeek() {
    console.log(this.selectedWeek)
    this.raidService.UpdateWeeks(this.selectedWeek).subscribe(data => {
       this.submitButtonDisabled = true
       this.snackBarService.openSnackBar("Week Values Updated")
    })
  }

}
