import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class LoginProfileService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.LOGIN_PROFILES);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(ApiPaths.LOGIN_PROFILES + id)
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.LOGIN_PROFILES + id, data)
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOGIN_PROFILES, data)
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.LOGIN_PROFILES + id)
  }

  exportCSV(data: any): Observable<any> {
    const options = {responseType: 'text' as 'json'};
    return this.http.post<any>(ApiPaths.LOGIN_PROFILE_EXPORT_CSV, data, options);
  }

  exportJson(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOGIN_PROFILE_EXPORT_JSON, data)
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.IMPORT_LOGIN_PROFILES, data);
  }
}
