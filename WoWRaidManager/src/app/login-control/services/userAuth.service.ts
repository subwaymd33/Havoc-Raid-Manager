import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { accessToken } from '../models/accessToken';
import { discordUserData } from '../models/discordUserData';



@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  constructor(private http: HttpClient) { }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

  getDiscordCode() {
    window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=985911105857658950&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fcallback&response_type=code&scope=identify';
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

  RefreshAuthentication(token: string): Observable<accessToken> {
    var resp = this.http.get<accessToken>(`http://localhost:3002/api/auth/discord/refresh/${token}`).pipe();
    return resp;
  }
}