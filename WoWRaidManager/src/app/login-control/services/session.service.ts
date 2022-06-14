import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SessionModel } from '../models/sessionModel';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    constructor(private http: HttpClient) { }

    CheckSession(sess:SessionModel): Observable<SessionModel[]> {
        return this.http.get<SessionModel[]>(`http://localhost:3000/session/${sess.user_id}`).pipe(
            map(ses => {
                return ses;
              })   
        );
    }

    AddSession(sess:SessionModel): Observable<any> {
        const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
        var input = {
            user_id: sess.user_id,
            access_token: sess.access_token,
            refresh_token: sess.refresh_token,
            expiry_time: sess.expiry_time
        }
        const body = JSON.stringify(input);
        return this.http.post<any>("http://localhost:3003/insertSession", body, { 'headers': headers })

    }

    UpdateSession(sess:SessionModel): Observable<any> {
        const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
        var input = {
            user_id: sess.user_id,
            access_token: sess.access_token,
            refresh_token: sess.refresh_token,
            expiry_time: sess.expiry_time
        }
        const body = JSON.stringify(input);
        return this.http.patch<any>("http://localhost:3003/updateSession", body, { 'headers': headers })

    }
}