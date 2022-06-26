import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { accessToken } from '../models/accessToken';
import { DiscordGuildData } from '../models/DiscordGuildData';
import { DiscordGuildDetails } from '../models/DiscordGuildDetails';
import { discordUserData } from '../models/discordUserData';



@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  adminSubject = new Subject<boolean>();
  logonSubject = new Subject<boolean>()
  private _isLoggedIn:boolean;
  private _isAdmin:boolean;
  
  SetAdmin(val: boolean) {
    this._isAdmin = val;
    this.adminSubject.next(val);
  }
  SetLogon(val: boolean) {
    this._isLoggedIn=val;
    this.logonSubject.next(val);
  }
  isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  isAdmin(): boolean {
    return this._isAdmin;
  }

  constructor(private http: HttpClient) { }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

  getDiscordCode() {
    window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=985911105857658950&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fcallback&response_type=code&scope=guilds%20identify%20guilds.members.read';
  }

  GetAccessToken(code: string): Observable<accessToken> {
    return this.http.get<accessToken>(`http://localhost:3002/api/auth/discord/redirect/${code}`).pipe(
      map(token => {
        console.log(token)
        return token;
      })
    );
  }

  AuthenticateUser(token: string): Observable<discordUserData> {
    var resp = this.http.get<discordUserData>(`http://localhost:3002/api/auth/user/${token}`).pipe();
    return resp;
  }

  GetDiscordGuilds(token: string): Observable<DiscordGuildData[]> {
    return this.http.get<DiscordGuildData[]>(`http://localhost:3002/api/auth/user/guild/${token}`).pipe(
      map(guild => {
        return guild;
      })
    );


  }
  GetDiscordGuildsDetails(token: string, guild_id: string): Observable<DiscordGuildDetails> {
    return this.http.get<DiscordGuildDetails>(`http://localhost:3002/api/auth/guilds/${token}/${guild_id}`).pipe(
      map(guild => {
        return guild
      })
    );
  }

  GetDiscordGuildRoles(guild_id: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3002/api/auth/guilds/roles/${guild_id}`).pipe(
      map(guild => {
        return guild;
      })
    );


  }

  RefreshAuthentication(token: string): Observable<accessToken> {
    var resp = this.http.get<accessToken>(`http://localhost:3002/api/auth/discord/refresh/${token}`).pipe();
    return resp;
  }


}