import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.DEVICES);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.DEVICES + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DEVICES_ADD, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.DEVICES + id);
  }

  update(data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.DEVICES_UPDATE, data)
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DEVICES_EXPORT, data)
  }
}
