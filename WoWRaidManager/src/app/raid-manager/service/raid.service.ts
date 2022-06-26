import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, ConnectableObservable, map, Observable } from 'rxjs';
import { RaidModel } from '../models/RaidModel';
import { RaidWeekModel } from '../models/RaidWeekModel';

@Injectable({
  providedIn: 'root'
})
export class raidService {



  constructor(private http: HttpClient) { 

  }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

   getRaids(): Observable<RaidModel[]> {
    return this.http.get<RaidModel[]>('http://localhost:3010/getRaids')
      .pipe(
        map(raids => {
          return raids;
        })
      );
  }
  insertNewRaid(raidModel: RaidModel): Observable<any> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(raidModel)
    return this.http.post<any>("http://localhost:3010/insertRaid", body, { 'headers': headers })
  }
  getRaidWeeks(): Observable<RaidWeekModel[]> {
    return this.http.get<RaidWeekModel[]>('http://localhost:3010/getRaidWeeks')
    .pipe(
      map(weeks => {
        return weeks;
      })
    );
  }
  UpdateWeeks(selectedWeek: RaidWeekModel):Observable<RaidWeekModel[]> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(selectedWeek)
    return this.http.patch<any>("http://localhost:3010/updateRaidWeek", body, { 'headers': headers })
  }
}