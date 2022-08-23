import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionModel } from '../login-control/models/sessionModel';

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    constructor(private http: HttpClient) { }

URL = environment.BACKEND_SERVER_URL

    CheckSession(sess:SessionModel): Observable<SessionModel[]> {
        console.log(sess)
        return this.http.get<SessionModel[]>(this.URL + `/checkSession/${sess.user_id}`).pipe(
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
        return this.http.post<any>(this.URL + "/insertSession", body, { 'headers': headers })

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
        return this.http.patch<any>(this.URL + "/updateSession", body, { 'headers': headers })

    }
}