import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/shared/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private http: HttpClient) { }

  getGenNodeData(collectionId: string, deviceId: string, templateId: string): Observable<any> {
    return this.http.post<any>(ApiPaths.GET_GEN_NODE_DATA, {
      collection_id: collectionId,
      device_id: deviceId,
      template_id: templateId 
    });
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.NODE + id);
  }

  add(newNodeData: any): Observable<any> {
    return this.http.post<any>(ApiPaths.NODE, newNodeData);
  }
}
