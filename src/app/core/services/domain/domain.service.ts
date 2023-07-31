import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.DOMAINS);
  }

  getDomainByProjectId(projectId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.DOMAINS, {
      params: {
        q: '(filters:!((col:project_id,opr:eq,value:' + projectId + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    })
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(ApiPaths.DOMAINS + id);
  }

  put(id: number, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.DOMAINS + id, data);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DOMAINS, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.DOMAINS + id);
  }

  addDomainUser(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DOMAINS_CREATE_USERS, data);
  }

  editBulk(data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.DOMAINS_BULK_EDIT, data);
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DOMAINS_EXPORT, data);
  }

  validate(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DOMAINS_VALIDATE, data);
  }
}
