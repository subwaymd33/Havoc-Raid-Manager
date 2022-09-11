import { Injectable } from "@angular/core";
import {  CanActivate } from "@angular/router";
import { ConnectableObservable } from "rxjs";
import { UserAuthService } from "src/app/services/userAuth.service";



@Injectable({
  providedIn: 'root'
})
export class LogonGuardService implements CanActivate {


  constructor(private userAuthService: UserAuthService) { }

  canActivate(): boolean {
    console.log("checking activate")
    try {
      let isloggedin = this.userAuthService.isLoggedIn()
      console.log(isloggedin)
      return isloggedin
    } catch (error) {
      return false
    }
  }

}

