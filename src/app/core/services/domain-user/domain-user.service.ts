import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiPaths } from "../../enums/api-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class DomainUserService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.DOMAIN_USER);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(ApiPaths.DOMAIN_USER + id);
  }

  getDomainUserByDomainId(domainId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.DOMAIN_USER, {
      params: {
        q: '(filters:!((col:domain_id,opr:eq,value:' + domainId + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  put(id: any, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.DOMAIN_USER + id, data);
  }

  delete(domainUserId: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.DOMAIN_USER + domainUserId);
  }

}
