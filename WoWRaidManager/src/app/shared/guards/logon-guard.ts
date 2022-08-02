import { Injectable } from "@angular/core";
import {  CanActivate } from "@angular/router";
import { UserAuthService } from "src/app/services/userAuth.service";



@Injectable({
  providedIn: 'root'
})
export class LogonGuardService implements CanActivate {


  constructor(private userAuthService: UserAuthService) { }

  canActivate(): boolean {

    return this.userAuthService.isLoggedIn();
  }

}

