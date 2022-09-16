import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.USER + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.USER, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.USER + id, data);
  }
}
