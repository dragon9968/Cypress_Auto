import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiPaths } from "../../enums/api-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class ServerConnectService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.SERVER_CONNECT);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(ApiPaths.SERVER_CONNECT + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.SERVER_CONNECT, data);
  }

  put(id: number, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.SERVER_CONNECT + id, data);
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete<any>(ApiPaths.SERVER_CONNECT + id);
  }

  clearParameters(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CLEAR_PARAMETERS, data)
  }

  exportJson(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CONNECTION_EXPORT, data)
  }

  pingTest(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PING_TEST, data);
  }

  loginCheck(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOGIN_CHECK, data)
  }
}
