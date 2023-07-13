import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';
import {
  PortGroupAddModel,
  PortGroupEditBulkModel,
  PortGroupExportModel,
  PortGroupGetCommonModel,
  PortGroupGetRandomModel, PortGroupPutModel,
  PortGroupRandomizeSubnetModel, PortGroupValidateModel
} from "../../models/port-group.model";

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
        q: '(columns:!(id,name,subnet,vlan,project_id,domain_id,domain,category),' +
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

  add(data: PortGroupAddModel): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP, data);
  }

  put(id: string, data: PortGroupPutModel): Observable<any> {
    return this.http.put<any>(ApiPaths.PORTGROUP + id, data);
  }

  validate(data: PortGroupValidateModel): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_VALIDATE, data);
  }

  editBulk(data: PortGroupEditBulkModel): Observable<any> {
    return this.http.put<any>(ApiPaths.PORTGROUP + 'bulk_edit', data);
  }

  export(data: PortGroupExportModel): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_EXPORT, data);
  }

  randomizeSubnetBulk(data: PortGroupRandomizeSubnetModel): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_RANDOMIZE_SUBNET_BULK, data);
  }

  getPortGroupCommon(data: PortGroupGetCommonModel): Observable<any> {
    return this.http.post<any>(ApiPaths.PORTGROUP_COMMON, data);
  }

  getRandomSubnet(data: PortGroupGetRandomModel): Observable<any> {
    return this.http.post<any>(ApiPaths.PORT_GROUP_GET_RANDOM_SUBNET, data)
  }
}
