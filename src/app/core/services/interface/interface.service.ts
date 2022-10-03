import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {

  constructor(private http: HttpClient) { }

  genData(nodeId: string, portgroupId: string): Observable<any> {
    return this.http.post<any>(ApiPaths.GEN_INTERFACE_DATA, {
      node_id: nodeId,
      pg_id: portgroupId
    });
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.INTERFACE, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.INTERFACE + id, data);
  }

  randomizeIP(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE_RANDOMIZE_IP + id);
  }

  validate(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.INTERFACE_VALIDATE, data);
  }

  editBulk(data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.INTERFACE + 'bulk_edit', data);
  }
}
