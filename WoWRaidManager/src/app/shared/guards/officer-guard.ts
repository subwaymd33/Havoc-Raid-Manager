import { Injectable } from "@angular/core";
import {  CanActivate } from "@angular/router";
import { UserAuthService } from "src/app/services/userAuth.service";

@Injectable({
  providedIn: 'root'
})
export class OfficerGuardService implements CanActivate {

  constructor(private userAuthService:UserAuthService){

  }
  canActivate() {
    
    return this.userAuthService.isAdmin()
  }
}
