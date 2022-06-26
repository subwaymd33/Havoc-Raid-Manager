import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { UserAuthService } from "src/app/login-control/services/userAuth.service";

@Injectable({
  providedIn: 'root'
})
export class OfficerGuardService implements CanActivate {

  constructor(private userAuthService:UserAuthService){

  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    return this.userAuthService.isAdmin()
  }
}
