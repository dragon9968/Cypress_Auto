import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.ICONS);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.ICONS + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.ICONS_ADD, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.ICONS_UPDATE + id, data)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.ICONS + id);
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.ICONS_EXPORT, data)
  }
}
