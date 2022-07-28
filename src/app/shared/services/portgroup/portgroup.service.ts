import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/shared/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class PortGroupService {

  constructor(private http: HttpClient) { }

  getGenNodeData(collectionId: string, category: string): Observable<any> {
    return this.http.post<any>(ApiPaths.GET_GEN_PG_DATA, {
      collection_id: collectionId,
      category
    });
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.PORTGROUP + id);
  }

  add(newNodeData: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP, newNodeData);
  }
}
