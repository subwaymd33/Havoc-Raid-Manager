import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Characters } from '../roster/models/Characters';
import { ICharacter } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  // URL which returns list of JSON items (API end-point URL)
  private readonly URL = 'http://localhost:3001/processRoster';

  constructor(private http: HttpClient) { }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

  getRoster(): Observable<ICharacter[]> {
    return this.http.get<ICharacter[]>(this.URL)
      .pipe(
        map(characters => {
          return characters;
        })
      );
  }

  deleteCharacter(char: ICharacter): Observable<any> {
    const deleteHeaders = { 'content-type': 'application/json', 'responseType': 'application/json' }
    return this.http.delete<any>("http://localhost:3001/deleteCharacter/" + char.charName, { 'headers': deleteHeaders })
  }

  addCharacter(char: ICharacter): Observable<any> {

    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(char);
    return this.http.post<any>("http://localhost:3001/insertCharacter", body, { 'headers': headers })

  }

  updateCharacter(char: ICharacter): Observable<any> {

    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(char);
    return this.http.patch<any>("http://localhost:3001/updateCharacter", body, { 'headers': headers })

  }
}