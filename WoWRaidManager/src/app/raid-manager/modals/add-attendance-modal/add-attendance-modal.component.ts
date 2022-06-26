import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-attendance-modal',
  templateUrl: './add-attendance-modal.component.html',
  styleUrls: ['./add-attendance-modal.component.css']
})
export class AddAttendanceModalComponent implements OnInit {
  char_name:string;
  constructor(public dialogRef: MatDialogRef<AddAttendanceModalComponent>,@Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  Save(){
    this.dialogRef.close({char_name: this.char_name})
  }
}
