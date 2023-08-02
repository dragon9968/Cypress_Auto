import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiPaths } from "../../enums/api-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class MapLinkService {

  constructor(
    private http: HttpClient
  ) { }

  getAll():Observable<any> {
    return this.http.get<any>(ApiPaths.MAP_LINK);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(ApiPaths.MAP_LINK + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.MAP_LINK, data);
  }

  put(id: any, data: any): Observable<any> {
    return this.http.put(ApiPaths.MAP_LINK + id, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>(ApiPaths.MAP_LINK + id);
  }

  getMapLinksByProjectId(projectId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.MAP_LINK, {
      params: {
        q: '(filters:!((col:project_id,opr:eq,value:' + projectId +')),keys:!(list_columns),page:0,page_size:1000)'
      }
    })
  }
}
