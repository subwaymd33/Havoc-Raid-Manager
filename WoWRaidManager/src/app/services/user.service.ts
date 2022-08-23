import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { discordUserData } from '../login-control/models/discordUserData';
import { userCheckModel } from '../login-control/models/userCheckModel';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    URL = environment.BACKEND_SERVER_URL

    CheckUser(id: string): Observable<userCheckModel[]> {
        return this.http.get<userCheckModel[]>(this.URL + `/checkUser/${id}`).pipe(   
            map(user => {
                return user;
              })            
        )
    }

    AddUser(userData: discordUserData): Observable<any> {
        console.log(userData)
        const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
        var input = {
            user_id: userData.id,
            user_name: userData.username,
            role: userData.role
        }
        const body = JSON.stringify(input);
        return this.http.post<any>(this.URL + "/insertUser", body, { 'headers': headers })

    }

    GetOfficers():  Observable<string[]>{
        return this.http.get<string[]>(this.URL+`/getOfficers`).pipe(   
            map(user => {
               
                return user;
              })            
        )
    }
}