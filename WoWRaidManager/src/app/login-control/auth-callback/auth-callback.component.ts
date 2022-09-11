import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { accessToken } from '../models/accessToken';
import { DiscordGuildDetails } from '../models/DiscordGuildDetails';
import { discordUserData } from '../models/discordUserData';
import { SessionModel } from '../models/sessionModel';
import { SessionService } from '../../services/session.service';
import { UserAuthService } from 'src/app/services/userAuth.service';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css'],
  providers: [CookieService]
})
export class AuthCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute,private _router:Router, private authService: UserAuthService, private userService: UserService, private sessionService: SessionService, private cookieService: CookieService) { }

  ngOnInit(): void {
    const discordCode = this.route.snapshot.queryParamMap.get('code')!.toString();
    var userData: discordUserData;
    var access: accessToken;

    this.authService.GetAccessToken(discordCode.toString()).subscribe((retAccessToken: accessToken) => {
      access = retAccessToken
      this.authService.AuthenticateUser(access.access_token.toString()).subscribe((data: discordUserData) => {

        userData = data
   
        //this.cookieService.set("isLogon", "true")
        this.cookieService.set("username", userData.username)
        this.cookieService.set("isLogon", "true")

        this.authService.GetDiscordGuilds(access.access_token.toString()).subscribe((data) => {
          data.forEach(guild => {
            if (guild.id == '822219949284130839') {
              this.authService.GetDiscordGuildsDetails(access.access_token.toString(), guild.id).subscribe(guildData => {
                var discordRolesArray: DiscordGuildDetails = guildData
                discordRolesArray.roles.forEach((role: string) => {
                  if (role == "827304261725192232") {
                    this.authService.SetAdmin(true)
                    userData.role = "officer"
                  }
                })
                this.userService.CheckUser(userData.id).subscribe(checkdata => {
                  if (checkdata.length == 0) {
                    //insert new user

                    this.userService.AddUser(userData).subscribe(data => {
                    })
                  }

                  this.cookieService.set("dID", userData.id)
                  this.cookieService.set("username", userData.username)

                  //localStorage.setItem("dID", userData.id);
                  //localStorage.setItem("username", userData.username)
                  this.authService.SetLogon(true);

                  var exp_date = new Date()
                  exp_date.setSeconds(exp_date.getSeconds() + access.expires_in)
                  var currentSession = new SessionModel(userData.id, access.access_token, exp_date, access.refresh_token)

                  this.sessionService.CheckSession(currentSession).subscribe(sessionCheckData => {
                    if (sessionCheckData.length == 0) {
                      //if no item was found just add new
                      this.sessionService.AddSession(currentSession).subscribe(data => {
                      })
                    } else {
                      //update DB row with new values from full auth flow
                      this.sessionService.UpdateSession(currentSession).subscribe(data => {
                      })
                    }
                  })
            
                  this._router.navigate(['/userPage'])
                
                })
              })
            }
          })
        })
      })
    })
  }

}
