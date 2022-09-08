import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private http: HttpClient) { }

  genData(collectionId: string, deviceId: string, templateId: string): Observable<any> {
    return this.http.post<any>(ApiPaths.GEN_NODE_DATA, {
      collection_id: collectionId,
      device_id: deviceId,
      template_id: templateId 
    });
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.NODE + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.NODE, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.NODE + id, data);
  }

  clone(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.CLONE_NODE + id);
  }

  validate(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.VALIDATE_NODE, data);
  }
}