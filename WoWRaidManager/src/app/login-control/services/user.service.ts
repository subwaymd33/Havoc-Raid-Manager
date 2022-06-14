import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { discordUserData } from '../models/discordUserData';
import { userCheckModel } from '../models/userCheckModel';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    CheckUser(id: string): Observable<userCheckModel[]> {
        return this.http.get<userCheckModel[]>(`http://localhost:3000/user/${id}`).pipe(   
            map(user => {
                return user;
              })            
        )
    }

    AddUser(userData: discordUserData): Observable<any> {

        const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
        var input = {
            user_id: userData.id,
            user_name: userData.username
        }
        const body = JSON.stringify(input);
        return this.http.post<any>("http://localhost:3003/insertUser", body, { 'headers': headers })

    }
}