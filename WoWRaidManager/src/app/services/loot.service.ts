import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Items } from '../loot-manager/loot-config/models/items';
import { ItemToSpec } from '../loot-manager/loot-config/models/ItemToSpec';
import { specData } from '../loot-manager/loot-config/models/specData';
import { rawSheetDataRow } from '../loot-manager/loot-config/models/rawSheetDataRow';
import { sheetLockModel } from '../loot-manager/loot-config/models/sheetLockModel';
import { MasterLootSheetModel } from '../loot-manager/loot-config/models/MasterLootSheetModel';
import { environment } from 'src/environments/environment';
import { approvalModel } from '../loot-sheet-approval/models/approvalModel';


@Injectable({
  providedIn: 'root'
})
export class LootService {
  private items: Items[] = [];
  private specData: specData[];
  private masterLootSheet: MasterLootSheetModel[]=[];
  constructor(private http: HttpClient) { }

  URL = environment.BACKEND_SERVER_URL

  getItems() {
    return this.items;
  }
  getSpecData() {
    return this.specData;
  }

  getItemsFromDB(): Observable<Items[]> {
    return this.http.get<Items[]>(this.URL + '/getItems')
      .pipe(
        map(items => {
          this.items = (items)
          return items;
        })
      );
  }

  getSpecToItem(): Observable<ItemToSpec[]> {
    return this.http.get<ItemToSpec[]>(this.URL + '/getSpectoItems')
      .pipe(
        map(items => {
          return items;
        })
      );
  }

  getSpecDataFromDB(): Observable<specData[]> {
    return this.http.get<specData[]>(this.URL + '/getSpecData')
      .pipe(
        map(specData => {
          this.specData = specData;
          return specData;
        })
      );
  }

  addSpecToItemMap(data: ItemToSpec[], item_id: number): Observable<any> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    if (data.length == 0) {
      data.push(new ItemToSpec(item_id, 0))
    }
    const body = JSON.stringify(data);
    return this.http.post<any>(this.URL + "/insertItemtoSpec", body, { 'headers': headers })
  }

  UpdateItemRankingAndSheetLimit(data: Items): Observable<any> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(data);
    return this.http.patch<any>(this.URL + "/updateSheetLimitandRanking", body, { 'headers': headers })
  }

  getLootSheetByCharName(char_name: string): Observable<rawSheetDataRow[]> {
    return this.http.get<rawSheetDataRow[]>(this.URL + `/getLootSheet/${char_name}`)
      .pipe(
        map(rawSheetDataRow => {
          return rawSheetDataRow;
        })
      );
  }

  saveLootSheet(data: rawSheetDataRow[]): Observable<any> {

    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(data);
    return this.http.post<any>(this.URL + "/insertLootSheet", body, { 'headers': headers })

  }

  getSheetLock(char_name: string): Observable<sheetLockModel[]> {
    return this.http.get<sheetLockModel[]>(this.URL + `/getSheetLock/${char_name}`)
      .pipe(
        map(sheetLock => {
          return sheetLock;
        })
      );
  }
  updateSheetLock(sheetLockModel: sheetLockModel[]): Observable<any[]> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(sheetLockModel);
    return this.http.post<any>(this.URL + "/insertSheetLock", body, { 'headers': headers })
  }

  getMasterLootsheet(){
    return this.masterLootSheet;
  }
  getMasterLootsheetFromDB(): Observable<MasterLootSheetModel[]> {
    return this.http.get<MasterLootSheetModel[]>(this.URL + `/getMasterLootsheet`)
      .pipe(
        map(mls => {
          this.masterLootSheet=mls
          return mls;
        })
      );
  }

  deleteLootsheet(char_name: string) {
    const deleteHeaders = { 'content-type': 'application/json', 'responseType': 'application/json' }
    return this.http.delete<any>(this.URL + "/deleteLootsheet/" + char_name, { 'headers': deleteHeaders })
  }

  getSheetLockForApproval(): Observable<sheetLockModel[]> {
    return this.http.get<sheetLockModel[]>(this.URL + `/getSheetLockForApproval`)
      .pipe(
        map(sheetLock => {
          return sheetLock;
        })
      );
  }

  approveOrDenySheetLock(approvalModel: approvalModel): Observable<any[]> {
    const headers = { 'content-type': 'application/json', 'responseType': 'application/json' }
    const body = JSON.stringify(approvalModel);
    return this.http.patch<any>(this.URL + "/updateSheetlock", body, { 'headers': headers })
  }


}