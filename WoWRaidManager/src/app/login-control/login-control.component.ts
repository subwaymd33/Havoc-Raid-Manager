import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionModel } from './models/sessionModel';
import { SessionService } from '../services/session.service';
import { UserAuthService } from '../services/userAuth.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login-control',
  templateUrl: './login-control.component.html',
  styleUrls: ['./login-control.component.css']
})
export class LoginControlComponent implements OnInit {
  data = "";


  constructor(public authService: UserAuthService, private sessionService: SessionService, private userService:UserService, private router:Router) { }

  ngOnInit(): void {
  }

  logon() {
    if (localStorage.getItem("dID") == null) {
      this.authService.getDiscordCode()
      this.authService.SetLogon(true);
    } else {
      //this route will be if we already know the users dicord ID
      this.LogonwithKnownDiscordID()
      this.userService.GetOfficers().subscribe(data=>{
        var arr:String[] = data
        arr.forEach(item=>{
          if(localStorage.getItem("dID")==item){
            this.authService.SetAdmin(true)
          }
        })
        this.authService.SetLogon(true);
        this.router.navigate(['/userPage'])
      })
    }
  }

  LogonwithKnownDiscordID() {
    var discordID = localStorage.getItem("dID")!.toString()

    var currentSession = new SessionModel(discordID, '', new Date, '')

    this.sessionService.CheckSession(currentSession).subscribe(sessionCheckData => {
      console.log(sessionCheckData)
      if (sessionCheckData.length == 0) {
        //did not find a session. This is unexpected
        console.log("uhoh")
      } else {
        //session exists in database. Check the time to see if we need a new auth key, nmeed to refresh, or are good
        var expyDateMinusTwoDays = new Date(sessionCheckData[0].expiry_time);
        expyDateMinusTwoDays = this.addDays(expyDateMinusTwoDays, -2)
        console.log(expyDateMinusTwoDays)
        if (new Date < sessionCheckData[0].expiry_time) {
          //the current date is greater then the expiry time and we need a whole new token
          this.authService.getDiscordCode()
        } else if (new Date > sessionCheckData[0].expiry_time && new Date < expyDateMinusTwoDays) {
          //the current token will expire in less than 2 days and should be refreshed
          this.authService.RefreshAuthentication(sessionCheckData[0].refresh_token)
        } else {
          //no action needed token is good for long enough
        }
      }
      sessionStorage.setItem("isLogon", "true")
    })

  }
  addDays = (date: Date, days: number): Date => {
    date.setDate(date.getDate() + days);
    return date;
  };


}
