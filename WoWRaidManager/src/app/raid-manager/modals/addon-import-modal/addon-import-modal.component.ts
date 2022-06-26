import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RaidModel } from '../../models/RaidModel';

@Component({
  selector: 'app-addon-import-modal',
  templateUrl: './addon-import-modal.component.html',
  styleUrls: ['./addon-import-modal.component.css'],
})
export class AddonImportModalComponent implements OnInit {
  InputFormGroup: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddonImportModalComponent>, @Inject(MAT_DIALOG_DATA) public data: RaidModel) {

    this.InputFormGroup = new FormGroup({
      phase_selector: new FormControl('', Validators.required),
      name: new FormControl("", Validators.required),
      import_string: new FormControl('', Validators.required)
    })

  }

  ngOnInit(): void {
  }

  CloseDialog() {
    this.dialogRef.close()
  }

  Import() {
    this.dialogRef.close({ raid_name: this.InputFormGroup.controls['name'].value, inputString: this.InputFormGroup.controls['import_string'].value, phase: this.InputFormGroup.controls['phase_selector'].value })
  }

}
