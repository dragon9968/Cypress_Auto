import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiPaths } from "../../enums/api-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.GROUP);
  }

  getGroupByCollectionId(collectionId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.GROUP, {
      params: {
        q: '(columns:!(id,name,collection,collection_id,description,domain,domain_id,category,nodes,port_groups),filters:!((col:collection_id,opr:eq,value:' + collectionId + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  get(groupId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.GROUP + groupId);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.GROUP, data);
  }

  put(groupId: string, data: any): Observable<any> {
    const params = new HttpParams().set('group_id', groupId);
    return this.http.put<any>(ApiPaths.UPDATE_GROUP, data, { params });
  }

  delete(groupId: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.GROUP + groupId);
  }
}
