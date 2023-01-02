import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaths } from "../../enums/api-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class DeviceCategoryService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.DEVICE_CATEGORY)
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DEVICE_CATEGORY, data);
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(ApiPaths.DEVICE_CATEGORY + id);
  }

  put(id: number,data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.DEVICE_CATEGORY + id, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(ApiPaths.DEVICE_CATEGORY + id);
  }
}
