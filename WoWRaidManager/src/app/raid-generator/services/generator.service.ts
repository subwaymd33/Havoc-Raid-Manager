import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ICharacter } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(private http: HttpClient) { }

  processRaidComp(roster: ICharacter[], raidSize: number, tankCount:number,healerCount:number,rDPSCount:number,mDPSCount:number): Observable<any> {
    console.log(roster)
    let toSend  = {
      roster,
      raidSize,
      tankCount,
      healerCount,
      rDPSCount,
      mDPSCount
    }
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(toSend);
    return this.http.post<any>("http://localhost:3001/processRaidComp", body, { 'headers': headers }).pipe(
      map(characters => {
        return characters;
      })
    );

  }


}