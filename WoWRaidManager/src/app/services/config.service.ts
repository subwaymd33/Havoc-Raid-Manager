import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ConfigModel } from '../models/configModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configs:ConfigModel[]=[];
  // URL which returns list of JSON items (API end-point URL)
URL = environment.CONFIG_PROCESS_SERVER_URL
  constructor(private http: HttpClient) {}

  getConfigs(){
    return this.configs;
  }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

   getConfigsFromDB(): Observable<ConfigModel[]> {
    return this.http.get<ConfigModel[]>(this.URL + '/config')
      .pipe(
        map(configs => {
          this.configs = configs;
          return configs;
        })
      );
  }

  updateConfig(char: ConfigModel): Observable<any> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(char);
    return this.http.patch<any>(this.URL + "/config", body, { 'headers': headers })
  }
}