import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class AppPrefService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.APP_PREF);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.APP_PREF + id);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.APP_PREF + id, data);
  }

  getByCategory(category: string): Observable<any> {
    return this.http.get<any>(ApiPaths.APP_PREF, {
      params: {
        q: `(filters:!((col:category,opr:eq,value:'${category}')),keys:!(list_columns),page:0,page_size:1000)`
      }
    });
  }
}
