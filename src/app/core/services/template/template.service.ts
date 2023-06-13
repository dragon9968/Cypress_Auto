import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';
import { Store } from "@ngrx/store";
import { HelpersService } from "../helpers/helpers.service";
import { selectTemplates } from "../../../store/template/template.selectors";
import { retrievedTemplates } from "../../../store/template/template.actions";

@Injectable({
  providedIn: 'root'
})
export class TemplateService implements OnDestroy {

  templates: any[] = []
  selectTemplates$ = new Subscription()
  constructor(
    private store: Store,
    private http: HttpClient,
    private helpersService: HelpersService
  ) {
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe(templates => this.templates = templates)
  }

  ngOnDestroy(): void {
     this.selectTemplates$.unsubscribe()
  }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.TEMPLATES)
    }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.TEMPLATES, data)
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.TEMPLATES + id)
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.TEMPLATES + id)
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.TEMPLATES + id, data)
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.TEMPLATES_EXPORT, data)
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.TEMPLATE_IMPORT, data)
  }

  updateTemplateStore(newItem: any) {
    const currentState: any[] = JSON.parse(JSON.stringify(this.templates)) || []
    const newState = this.helpersService.sortListByKeyInObject(currentState.concat(newItem))
    this.store.dispatch(retrievedTemplates({ data: newState }))
  }
}
