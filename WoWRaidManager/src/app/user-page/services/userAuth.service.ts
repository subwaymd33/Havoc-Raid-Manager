import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  // URL which returns list of JSON items (API end-point URL)
  private readonly URL = 'http://localhost:5000/callback';

  constructor(private http: HttpClient) { }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

  authenticateUser(): Observable<string> {
    return this.http.get<string>(this.URL)
      .pipe(
        map(data => {
          return data;
        })
      );
  }
}