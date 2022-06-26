import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, ConnectableObservable, map, Observable } from 'rxjs';
import { ConfigModel } from '../models/configModel';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // URL which returns list of JSON items (API end-point URL)
  private readonly URL = 'http://localhost:3001/processRoster';
  constructor(private http: HttpClient) { 

  }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

   getConfig(): Observable<ConfigModel[]> {
    return this.http.get<ConfigModel[]>('http://localhost:3006/config')
      .pipe(
        map(configs => {
          return configs;
        })
      );
  }

  updateCharacter(char: ConfigModel): Observable<any> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(char);
    return this.http.patch<any>("http://localhost:3006/config", body, { 'headers': headers })
  }
}