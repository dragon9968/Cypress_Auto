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

  getGroupByProjectId(projectId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.GROUP, {
      params: {
        q: '(filters:!((col:project_id,opr:eq,value:' + projectId + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  get(groupId: number): Observable<any> {
    return this.http.get<any>(ApiPaths.GROUP + groupId);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.GROUP + 'add', data);
  }

  put(groupId: number, data: any): Observable<any> {
    const params = new HttpParams().set('group_id', groupId);
    return this.http.put<any>(ApiPaths.UPDATE_GROUP, data, { params });
  }

  delete(groupId: number): Observable<any> {
    return this.http.delete<any>(ApiPaths.GROUP + groupId);
  }
}
