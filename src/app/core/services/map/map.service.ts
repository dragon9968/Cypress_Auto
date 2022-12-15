import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) { }

  getMapData(mapCategory: string, collectionId: string): Observable<any> {
    const url = ApiPaths.GET_MAP_DATA + '/' + mapCategory;
    const params = new HttpParams().set('collection_id', collectionId);
    return this.http.get<any>(url, { params });
  }

  saveMap(collectionId: string, mapCategory: string, data: any): Observable<any> {
    const params = new HttpParams()
      .set('collection_id', collectionId)
      .set('map_category', mapCategory);
    return this.http.post<any>(ApiPaths.SAVE_MAP, data, { params });
  }

  getVMStatus(projectId: number, connectionId: number): Observable<any> {
    const params = new HttpParams()
      .set('project_id', projectId)
      .set('connection_id', connectionId);
    return this.http.get<any>(ApiPaths.MAP_STATUS, { params });
  }

  // saveVMStatus(data: any, value: string): Observable<any> {
  //   const url = ApiPaths.SAVE_VM_STATUS + '/' + value;
  //   return this.http.post<any>(url, data);
  // }
}
