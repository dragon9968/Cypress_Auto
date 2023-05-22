import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class PortGroupService {

  constructor(private http: HttpClient) { }

  genData(projectId: string, category: string): Observable<any> {
    return this.http.post<any>(ApiPaths.GEN_PG_DATA, {
      project_id: projectId,
      category
    });
  }

  getByProjectId(projectId: string): Observable<any> {
    return this.http.get<any>(ApiPaths.PORTGROUP, {
      params: {
        q: '(columns:!(id,name,subnet,vlan,project_id,domain_id),' +
           'filters:!((col:project_id,opr:eq,value:' + projectId + ')),' +
           'keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  getByProjectIdAndCategory(projectId: string, category: string): Observable<any> {
    return this.http.get<any>(ApiPaths.PORTGROUP, {
      params: {
        q: '(filters:!((col:project_id,opr:eq,value:' + projectId +'),(col:category,opr:eq,value:' + category + '))' +
           ',keys:!(list_columns),page:0,page_size:1000)'
      }
    })
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

  randomizeSubnet(id: string, projectId: string): Observable<any> {
    const params = new HttpParams().set('project_id', projectId);
    return this.http.get<any>(ApiPaths.PORTGROUP_RANDOMIZE_SUBNET + id, {
      params
    });
  }

  validate(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_VALIDATE, data);
  }

  editBulk(data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.PORTGROUP + 'bulk_edit', data);
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_EXPORT, data);
  }

  randomizeSubnetBulk(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_RANDOMIZE_SUBNET_BULK, data);
  }

  getPortGroupCommon(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_COMMON, data);
  }
}
