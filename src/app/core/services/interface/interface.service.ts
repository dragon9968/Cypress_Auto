import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {

  constructor(private http: HttpClient) { }

  genData(nodeId: string, portgroupId: any, category = 'wired'): Observable<any> {
    return this.http.post<any>(ApiPaths.GEN_INTERFACE_DATA, {
      node_id: nodeId,
      pg_id: portgroupId,
      category: category
    });
  }

  genDataConnectPG(interfaceId: any, nodeId: string, portgroupId: any): Observable<any> {
    return this.http.post<any>(ApiPaths.GEN_INTERFACE_DATA_CONNECT_PG, {
      interface_id: interfaceId,
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

  randomizeIpBulk(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.INTERFACE_RANDOMIZE_IP_BULK, data);
  }

  getDataByPks(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.INTERFACE_BY_PKS, data);
  }

  getByNode(nodeId: any): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE, {
      params: {
        q: `(filters:!((col:node_id,opr:eq,value:${nodeId})),page:0,page_size:1000)`
      }
    });
  }

  getByNodeAndNotConnectToPG(nodeId: any): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE, {
      params: {
        q: `(filters:!((col:node_id,opr:eq,value:${nodeId}),(col:port_group_id,opr:eq,value:null)),page:0,page_size:1000)`
      }
    });
  }

  getByNodeAndConnectedToPG(nodeId: any): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE, {
      params: {
        q: `(filters:!((col:node_id,opr:eq,value:${nodeId}),(col:port_group_id,opr:neq,value:null)),page:0,page_size:1000)`
      }
    });
  }

  getByPortGroup(portGroupId: any): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE, {
      params: {
        q: `(filters:!((col:port_group_id,opr:eq,value:${portGroupId})),page:0,page_size:1000)`
      }
    });
  }

  getByProjectIdAndCategory(projectId: any, category: string): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE_DATA_CATEGORY + projectId + '/' + category)
  }
}
