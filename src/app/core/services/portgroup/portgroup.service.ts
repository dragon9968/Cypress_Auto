import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class PortGroupService {

  constructor(private http: HttpClient) { }

  genData(collectionId: string, category: string): Observable<any> {
    return this.http.post<any>(ApiPaths.GEN_PG_DATA, {
      collection_id: collectionId,
      category
    });
  }

  getByCollectionId(collectionId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.PORTGROUP, {
      params: {
        q: '(columns:!(id,name,subnet,vlan,collection_id),filters:!((col:collection_id,opr:eq,value:' + collectionId + ')),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.PORTGROUP + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.PORTGROUP + id, data);
  }

  randomizeSubnet(id: string, collectionId: string): Observable<any> {
    const params = new HttpParams().set('collection_id', collectionId);
    return this.http.get<any>(ApiPaths.PORTGROUP_RANDOMIZE_SUBNET + id, {
      params
    });
  }
  
  validate(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_VALIDATE, data);
  }
}
