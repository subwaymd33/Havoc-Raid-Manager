
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';



@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    constructor(private _snackbar: MatSnackBar) { }
    
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    durationInSeconds = 5;
    
    openSnackBar(text:string) {
      this._snackbar.open(text, 'OK', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000
      });
    }
}