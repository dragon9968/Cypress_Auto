import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.HARDWARES);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.HARDWARES + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.HARDWARES, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.HARDWARES + id);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.HARDWARES + id, data);
  }

  export(format: string, data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.HARDWARE_EXPORT + format, data);
  }
}
