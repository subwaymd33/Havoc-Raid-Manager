import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Items } from '../models/items';
import { ItemToSpec } from '../models/ItemToSpec';
import { specData } from '../models/specData';
import { rawSheetDataRow } from '../models/rawSheetDataRow';
import { sheetLockModel } from '../models/sheetLockModel';
import { MasterLootSheetModel } from '../models/MasterLootSheetModel';


@Injectable({
  providedIn: 'root'
})
export class LootService {


  constructor(private http: HttpClient) { }

  // create a method named: resolveRoster()
  // this method returns list-of-items in form of Observable
  // every HTTTP call returns Observable object

  getItems(): Observable<Items[]> {
    return this.http.get<Items[]>('http://localhost:3005/getItems')
      .pipe(
        map(items => {
          return items;
        })
      );
  }

  getSpecToItem(): Observable<ItemToSpec[]> {
    return this.http.get<ItemToSpec[]>('http://localhost:3005/getSpectoItems')
      .pipe(
        map(items => {
          return items;
        })
      );
  }

  getSpecData(): Observable<specData[]> {
    return this.http.get<specData[]>('http://localhost:3005/getSpecData')
      .pipe(
        map(specData => {
          return specData;
        })
      );
  }

  addSpecToItemMap(data: ItemToSpec[], item_id:number): Observable<any> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    if (data.length==0){
        data.push(new ItemToSpec(item_id,0))
    }
    const body = JSON.stringify(data);
    return this.http.post<any>("http://localhost:3005/insertItemtoSpec", body, { 'headers': headers })
  }

  UpdateItemRankingAndSheetLimit(data: Items): Observable<any>{
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(data);
    return this.http.patch<any>("http://localhost:3005/updateSheetLimitandRanking", body, { 'headers': headers })
  }

  getLootSheetByCharName(charName:string): Observable<rawSheetDataRow[]> {
    return this.http.get<rawSheetDataRow[]>(`http://localhost:3005/getLootSheet/${charName}`)
      .pipe(
        map(rawSheetDataRow => {
          return rawSheetDataRow;
        })
      );
  }

  saveLootSheet(data: rawSheetDataRow[]): Observable<any> {

    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(data);
    return this.http.post<any>("http://localhost:3005/insertLootSheet", body, { 'headers': headers })

  }

  getSheetLock(charUID:number):Observable<sheetLockModel[]>{
    return this.http.get<sheetLockModel[]>(`http://localhost:3005/getSheetLock/${charUID}`)
      .pipe(
        map(sheetLock => {
          return sheetLock;
        })
      );
  }
  updateSheetLock(sheetLockModel:sheetLockModel[]):Observable<any[]>{
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(sheetLockModel);
    return this.http.post<any>("http://localhost:3005/insertSheetLock", body, { 'headers': headers })
  }

  getMasterLootsheet():Observable<MasterLootSheetModel[]>{
    return this.http.get<MasterLootSheetModel[]>(`http://localhost:3005/getMasterLootsheet`)
      .pipe(
        map(mls => {
          return mls;
        })
      );
  }
}