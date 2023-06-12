import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';
import { Store } from "@ngrx/store";
import { selectConfigTemplates } from "../../../store/config-template/config-template.selectors";
import { retrievedConfigTemplates } from "../../../store/config-template/config-template.actions";

@Injectable({
  providedIn: 'root'
})
export class ConfigTemplateService implements OnDestroy{

  selectConfigTemplates$ = new Subscription()
  configTemplates: any[] = []
  constructor(private http: HttpClient,
              private store: Store) {
    this.selectConfigTemplates$ = this.store.select(selectConfigTemplates).subscribe(configTemplates => {
      this.configTemplates = configTemplates
    })
  }

  ngOnDestroy(): void {
    this.selectConfigTemplates$.unsubscribe()
  }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.CONFIG_TEMPLATES, {
      params: {
        q: '(columns:!(id,name,description,configuration),filters:!((col:category,opr:eq,value:template)),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.CONFIG_TEMPLATES + id)
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CONFIG_TEMPLATES, data);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.CONFIG_TEMPLATES + id, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.CONFIG_TEMPLATES + id)
  }

  addConfiguration(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.ADD_CONFIG_TEMPLATES, data)
  }

  getWinRoles(): Observable<any> {
    return this.http.get<any>(ApiPaths.GET_FEATURES);
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CONFIG_TEMPLATES_EXPORT, data)
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CONFIG_TEMPLATE_IMPORT, data)
  }

  deleteConfiguration(id: string, data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DELETE_CONFIG_TEMPLATES + id, data);
  }

  getNodeDefaultConfiguration(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.GET_NODE_CONFIGURATION_DEFAULT, data);
  }

  putConfiguration(data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.CONFIG_TEMPLATE_UPDATE_CONFIGURATION, data)
  }

  updateConfigTemplate(newItem: any) {
    const currentState = JSON.parse(JSON.stringify(this.configTemplates))
    const newState = currentState.concat(newItem)
    this.store.dispatch(retrievedConfigTemplates({ data: newState }))
  }
}
