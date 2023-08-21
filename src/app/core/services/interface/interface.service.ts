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

  get(id: number): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.INTERFACE, data);
  }

  put(id: number, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.INTERFACE + id, data);
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

  getByNodeAndNotConnected(nodeId: any): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE, {
      params: {
        q: `(filters:!((col:node_id,opr:eq,value:${nodeId}),(col:interface_id,opr:eq,value:null)),page:0,page_size:1000)`
      }
    });
  }

  getByNodeAndConnectedToInterface(nodeId: any): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE, {
      params: {
        q: `(filters:!((col:node_id,opr:eq,value:${nodeId}),(col:interface_id,opr:neq,value:null)),page:0,page_size:1000)`
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

  getByProjectId(projectId: number): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE, {
      params: {
        q: `(filters:!((col:project_id,opr:eq,value:${projectId})),page:0,page_size:1000)`
      }
    })
  }

  getByProjectIdAndHwNode(projectId: any): Observable<any> {
    return this.http.get<any>(ApiPaths.INTERFACE_DATA_BY_HW_NODE + projectId)
  }
}
