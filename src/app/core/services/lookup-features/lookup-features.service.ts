import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class LookupFeaturesService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.LOOKUP_FEATURES);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(ApiPaths.LOOKUP_FEATURES + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_FEATURES, data);
  }

  put(id: any, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.LOOKUP_FEATURES + id, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete<any>(ApiPaths.LOOKUP_FEATURES + id);
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_FEATURES_EXPORT, data);
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_FEATURES_IMPORT, data);
  }

}
