import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/shared/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  getMapData(mapCategory: string, collectionId: number): Observable<any> {
    const url = ApiPaths.GET_MAP_DATA + '/' + mapCategory;
    const params = new HttpParams().set('collection_id', collectionId);
    return this.http.get<any>(url, {
      params
    });
  }

}
