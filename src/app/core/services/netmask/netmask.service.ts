import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class NetmaskService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.NETMASK);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.NETMASK + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.NETMASK, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.NETMASK + id, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.NETMASK + id);
  }

}
