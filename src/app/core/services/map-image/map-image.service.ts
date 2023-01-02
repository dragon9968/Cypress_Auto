import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class MapImageService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.MAP_IMAGE);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.MAP_IMAGE + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.MAP_IMAGE, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.MAP_IMAGE + id);
  }

  put(data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.MAP_IMAGE, data)
  }
}
