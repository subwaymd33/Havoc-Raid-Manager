import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { UserAuthService } from "src/app/login-control/services/userAuth.service";


@Injectable({
  providedIn: 'root'
})
export class LogonGuardService implements CanActivate {


  constructor(private userAuthService: UserAuthService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    return this.userAuthService.isLoggedIn();
  }

}

