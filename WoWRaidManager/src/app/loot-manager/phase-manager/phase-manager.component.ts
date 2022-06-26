import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ConfigModel } from 'src/app/models/configModel';
import { ConfigService } from 'src/app/service/config.service';

@Component({
  selector: 'app-phase-manager',
  templateUrl: './phase-manager.component.html',
  styleUrls: ['./phase-manager.component.css']
})
export class PhaseManagerComponent implements OnInit {

  PhaseFormGroup: FormGroup;
  configs: ConfigModel[] = [];

  p1_enable_cb_changed = false
  p2_enable_cb_changed = false
  p3_enable_cb_changed = false
  p4_enable_cb_changed = false
  p1_show_in_master_cb_changed = false
  p2_show_in_master_cb_changed = false
  p3_show_in_master_cb_changed = false
  p4_show_in_master_cb_changed = false

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 5;

  constructor(private configService: ConfigService, private _snackBar: MatSnackBar) {
    this.PhaseFormGroup = new FormGroup({
      p1_enable_cb: new FormControl(false),
      p1_show_in_master_cb: new FormControl(false),
      p2_enable_cb: new FormControl(false),
      p2_show_in_master_cb: new FormControl(false),
      p3_enable_cb: new FormControl(false),
      p3_show_in_master_cb: new FormControl(false),
      p4_enable_cb: new FormControl(false),
      p4_show_in_master_cb: new FormControl(false),
    })
  }

  ngOnInit(): void {

    this.configService.getConfig().subscribe(data => {
      this.configs = data;
      this.resetForm();
    })
  }


  formSubmit() {
    if (this.p1_enable_cb_changed) {
      this.configService.updateCharacter(this.configs.find(conf => (conf.name === "p1_enable_cb"))!).subscribe(data => {
        console.log(data)
      })
    }
    if (this.p2_enable_cb_changed) {
      this.configService.updateCharacter(this.configs.find(conf => (conf.name === "p2_enable_cb"))!).subscribe(data => {
        console.log(data)
      })
    }
    if (this.p3_enable_cb_changed) {
      this.configService.updateCharacter(this.configs.find(conf => (conf.name === "p3_enable_cb"))!).subscribe(data => {
        console.log(data)
      })
    }
    if (this.p4_enable_cb_changed) {
      this.configService.updateCharacter(this.configs.find(conf => (conf.name === "p4_enable_cb"))!).subscribe(data => {
        console.log(data)
      })
    }
    if (this.p1_show_in_master_cb_changed) {
      this.configService.updateCharacter(this.configs.find(conf => (conf.name === "p1_show_in_master_cb"))!).subscribe(data => {
        console.log(data)
      })
    }
    if (this.p2_show_in_master_cb_changed) {
      this.configService.updateCharacter(this.configs.find(conf => (conf.name === "p2_show_in_master_cb"))!).subscribe(data => {
        console.log(data)
      })
    }
    if (this.p3_show_in_master_cb_changed) {
      this.configService.updateCharacter(this.configs.find(conf => (conf.name === "p3_show_in_master_cb"))!).subscribe(data => {
        console.log(data)
      })
    }
    if (this.p4_show_in_master_cb_changed) {
      this.configService.updateCharacter(this.configs.find(conf => (conf.name === "p4_show_in_master_cb"))!).subscribe(data => {
        console.log(data)
      })
    }
    this.openSnackBar();
  }

  p1_enable_cb_change(data: any) {
    this.p1_enable_cb_changed = true
    var conf = this.configs.find(conf => (conf.name === "p1_enable_cb"))!
    conf.value = data.checked.toString()
  }
  p1_show_in_master_cb_change(data: any) {
    this.p1_show_in_master_cb_changed = true
    var conf = this.configs.find(conf => (conf.name === "p1_show_in_master_cb"))!
    conf.value = data.checked.toString()
  }
  p2_enable_cb_change(data: any) {
    this.p2_enable_cb_changed = true
    var conf = this.configs.find(conf => (conf.name === "p2_enable_cb"))!
    conf.value = data.checked.toString()
  }
  p2_show_in_master_cb_change(data: any) {
    this.p2_show_in_master_cb_changed = true
    var conf = this.configs.find(conf => (conf.name === "p2_show_in_master_cb"))!
    conf.value = data.checked.toString()
  }
  p3_enable_cb_change(data: any) {
    this.p3_enable_cb_changed = true
    var conf = this.configs.find(conf => (conf.name === "p3_enable_cb"))!
    conf.value = data.checked.toString()
  }
  p3_show_in_master_cb_change(data: any) {
    this.p3_show_in_master_cb_changed = true
    var conf = this.configs.find(conf => (conf.name === "p3_show_in_master_cb"))!
    conf.value = data.checked.toString()
  }
  p4_enable_cb_change(data: any) {
    this.p4_enable_cb_changed = true
    var conf = this.configs.find(conf => (conf.name === "p4_enable_cb"))!
    conf.value = data.checked.toString()
  }
  p4_show_in_master_cb_change(data: any) {
    this.p4_show_in_master_cb_changed = true
    var conf = this.configs.find(conf => (conf.name === "p4_show_in_master_cb"))!
    conf.value = data.checked.toString()
  }

  resetForm() {
    this.p1_enable_cb_changed = false
    this.p2_enable_cb_changed = false
    this.p3_enable_cb_changed = false
    this.p4_enable_cb_changed = false
    this.p1_show_in_master_cb_changed = false
    this.p2_show_in_master_cb_changed = false
    this.p3_show_in_master_cb_changed = false
    this.p4_show_in_master_cb_changed = false
    this.configs.forEach(config => {
      if (config.name == "p1_enable_cb") {
        if (config.value == 'false') {
          this.PhaseFormGroup.controls['p1_enable_cb'].setValue(false)
        } else {
          this.PhaseFormGroup.controls['p1_enable_cb'].setValue(true)
        }

      }
      if (config.name == "p1_show_in_master_cb") {
        if (config.value == 'false') {
          this.PhaseFormGroup.controls['p1_show_in_master_cb'].setValue(false)
        } else {
          this.PhaseFormGroup.controls['p1_show_in_master_cb'].setValue(true)
        }
      }
      if (config.name == "p2_enable_cb") {
        if (config.value == 'false') {
          this.PhaseFormGroup.controls['p2_enable_cb'].setValue(false)
        } else {
          this.PhaseFormGroup.controls['p2_enable_cb'].setValue(true)
        }
      }
      if (config.name == "p2_show_in_master_cb") {
        if (config.value == 'false') {
          this.PhaseFormGroup.controls['p2_show_in_master_cb'].setValue(false)
        } else {
          this.PhaseFormGroup.controls['p2_show_in_master_cb'].setValue(true)
        }
      }
      if (config.name == "p3_enable_cb") {
        if (config.value == 'false') {
          this.PhaseFormGroup.controls['p3_enable_cb'].setValue(false)
        } else {
          this.PhaseFormGroup.controls['p3_enable_cb'].setValue(true)
        }
      }
      if (config.name == "p3_show_in_master_cb") {
        if (config.value == 'false') {
          this.PhaseFormGroup.controls['p3_show_in_master_cb'].setValue(false)
        } else {
          this.PhaseFormGroup.controls['p3_show_in_master_cb'].setValue(true)
        }
      }
      if (config.name == "p4_enable_cb") {
        if (config.value == 'false') {
          this.PhaseFormGroup.controls['p4_enable_cb'].setValue(false)
        } else {
          this.PhaseFormGroup.controls['p4_enable_cb'].setValue(true)
        }
      }
      if (config.name == "p4_show_in_master_cb") {
        if (config.value == 'false') {
          this.PhaseFormGroup.controls['p4_show_in_master_cb'].setValue(false)
        } else {
          this.PhaseFormGroup.controls['p4_show_in_master_cb'].setValue(true)
        }
      }
    })
  }


  openSnackBar() {
    this._snackBar.open('Saved', 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000
    });
  }
}
