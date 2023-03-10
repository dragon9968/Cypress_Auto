import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class LookupNamesService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.LOOKUP_NAMES);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.LOOKUP_NAMES + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_NAMES, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.LOOKUP_NAMES + id, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.LOOKUP_NAMES + id)
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_NAMES_EXPORT, data);
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_NAMES_IMPORT, data);
  }

}
