import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accessToken } from '../models/accessToken';
import { discordUserData } from '../models/discordUserData';
import { SessionModel } from '../models/sessionModel';
import { userCheckModel } from '../models/userCheckModel';
import { SessionService } from '../services/session.service';
import { UserService } from '../services/user.service';
import { UserAuthService } from '../services/userAuth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private authService: UserAuthService, private userService: UserService, private sessionService: SessionService) { }

  ngOnInit(): void {
    const discordCode = this.route.snapshot.queryParamMap.get('code')!.toString();

    console.log(discordCode)
    var userData: discordUserData;
    var access: accessToken;

    var resp = this.authService.GetAccessToken(discordCode.toString()).subscribe((retAccessToken: accessToken) => {
      access = retAccessToken
      var userDataResp = this.authService.AuthenticateUser(access.access_token.toString()).subscribe((data: discordUserData) => {
        userData = data
        console.log(userData)
        sessionStorage.setItem("isLogon", "true")
        sessionStorage.setItem("username", userData.username)
        

        this.userService.CheckUser(userData.id).subscribe(checkdata => {
          console.log(checkdata)
          if (checkdata.length == 0) {
            //insert new user
            this.userService.AddUser(userData).subscribe(data => {
              console.log('added user:' + data)
            })
          } else {
            //user exists ---- do nothing
            console.log("doing nothing user exists")
          }

          localStorage.setItem("dID", userData.id);
          localStorage.setItem("username", userData.username)

          var exp_date = new Date()
          console.log(exp_date)
          exp_date.setSeconds(exp_date.getSeconds() + access.expires_in)
          console.log(exp_date)
          var currentSession = new SessionModel(userData.id, access.access_token, exp_date, access.refresh_token)

          this.sessionService.CheckSession(currentSession).subscribe(sessionCheckData => {
            console.log(sessionCheckData)
            if (sessionCheckData.length == 0) {
              //if no item was found just add new
                this.sessionService.AddSession(currentSession).subscribe(data => {
                  console.log('added session to DB:' + data)
                })
            } else {
                //update DB row with new values from full auth flow
                this.sessionService.UpdateSession(currentSession).subscribe(data => {
                  console.log('updated session in DB:' + data)
                })
            }
          })

        }
        )



      })
    })


    // this.router.navigate(['./userPage']);
  }

}
