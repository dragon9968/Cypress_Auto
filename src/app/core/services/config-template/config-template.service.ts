import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class ConfigTemplateService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.CONFIG_TEMPLATES, {
      params: {
        q: '(columns:!(id,name,description),filters:!((col:category,opr:eq,value:template)),keys:!(list_columns),page:0,page_size:1000)'
      }
    });
  }
}