import { HttpClient } from '@angular/common/http';
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

  getDomainByCollectionId(collectionId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.DOMAINS, {
      params: {
        q: '(columns:!(id,name,admin_user,admin_password),filters:!((col:collection_id,opr:eq,value:' + collectionId + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    })
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.DOMAINS + id);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.DOMAINS + id, data);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DOMAINS, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.DOMAINS + id);
  }
}
