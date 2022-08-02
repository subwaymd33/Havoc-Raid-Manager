import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RaidModel } from '../raid-manager/models/RaidModel';
import { RaidWeekModel } from '../raid-manager/models/RaidWeekModel';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class raidService {
  private weeks: RaidWeekModel[] = [];
  private raids: RaidModel[] = [];



  constructor(private http: HttpClient) { }

URL = environment.RAID_PROCESS_SERVER_URL

  getWeeks() {
    return this.weeks;
  }

  getRaids() {
    return this.raids;
  }
  getRaidsFromDB(): Observable<RaidModel[]> {
    return this.http.get<RaidModel[]>(this.URL + '/getRaids')
      .pipe(
        map(raids => {
          this.raids = raids
          return raids;
        })
      );
  }
  insertNewRaid(raidModel: RaidModel): Observable<any> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(raidModel)
    return this.http.post<any>(this.URL + "/insertRaid", body, { 'headers': headers })
  }


  getRaidWeeksFromDB(): Observable<RaidWeekModel[]> {
    return this.http.get<RaidWeekModel[]>(this.URL + '/getRaidWeeks')
      .pipe(
        map(weeks => {
          this.weeks = weeks;
          return weeks;
        })
      );
  }
  UpdateWeeks(selectedWeek: RaidWeekModel): Observable<RaidWeekModel[]> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(selectedWeek)
    return this.http.patch<any>(this.URL + "/updateRaidWeek", body, { 'headers': headers })
  }
}