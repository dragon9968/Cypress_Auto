import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/shared/enums/api/api-paths.enums';
import { MapDataModel } from '../models/map-data.model';

@Injectable({
  providedIn: 'root'
})
export class MapEditorService {

  constructor(private http: HttpClient) { }

  getMapData(category: string, collectionId: number): Observable<MapDataModel> {
    const url = ApiPaths.GET_MAP_DATA + '/' + category;
    const params = new HttpParams().set('collection_id', collectionId);
    return this.http.get<MapDataModel>(url, {
      params
    });
  }

}
