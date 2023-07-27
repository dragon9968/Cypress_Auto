import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiPaths } from "../../enums/api-paths.enum";
import { OSFirmwareModel } from "../../models/os-firmware.model";

@Injectable({
  providedIn: 'root'
})
export class LookupOsFirmwareService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.LOOKUP_OS_FIRMWARE);
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(ApiPaths.LOOKUP_OS_FIRMWARE + id);
  }

  add(data: OSFirmwareModel): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_OS_FIRMWARE, data);
  }

  put(id: number, data: OSFirmwareModel): Observable<any> {
    return this.http.put<any>(ApiPaths.LOOKUP_OS_FIRMWARE + id, data);
  }

  delete(pks: number[]): Observable<any> {
    return this.http.delete<any>(ApiPaths.LOOKUP_OS_FIRMWARE_DELETE, {body: {pks}});
  }

  export(pks: number[]): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_OS_FIRMWARE_EXPORT, {pks});
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOOKUP_OS_FIRMWARE_IMPORT, data);
  }

}
