import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class MapPrefService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.MAP_PREF);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.MAP_PREF + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.MAP_PREF, data)
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.MAP_PREF + id, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.MAP_PREF + id)
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.MAP_PREF_EXPORT, data)
  }
}
