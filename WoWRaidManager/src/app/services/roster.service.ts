import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ICharacter } from '../shared/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RosterService {

  // URL which returns list of JSON items (API end-point URL)
  private readonly URL = environment.CHARACTER_PROCESS_SERVER_URL

  constructor(private http: HttpClient) { }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

  getRoster(): Observable<ICharacter[]> {
    return this.http.get<ICharacter[]>(this.URL + '/processRoster')
      .pipe(
        map(characters => {
          return characters;
        })
      );
  }

  getRosterforUser(user_id:string): Observable<ICharacter[]> {
    return this.http.get<ICharacter[]>(this.URL + `/processRoster/${user_id}`)
      .pipe(
        map(characters => {
          return characters;
        })
      );
  }

  deleteCharacter(charUID: number): Observable<any> {
    const deleteHeaders = { 'content-type': 'application/json', 'responseType': 'application/json' }
    return this.http.delete<any>(this.URL + "/deleteCharacter/" + charUID, { 'headers': deleteHeaders })
  }

  addCharacter(char: ICharacter): Observable<any> {

    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(char);
    return this.http.post<any>(this.URL + "/insertCharacter", body, { 'headers': headers })

  }

  updateCharacter(char: ICharacter): Observable<any> {

    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(char);
    return this.http.patch<any>(this.URL + "/updateCharacter", body, { 'headers': headers })

  }

  getCharUIDByCharName(charName:string): Observable<any[]> {
    return this.http.get<any[]>(this.URL + `/getCharUID/${charName}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
}