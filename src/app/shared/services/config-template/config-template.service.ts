import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class ConfigTemplateService {

  constructor(private http: HttpClient) { }

  getConfigTemplates(): Observable<any> {
    return this.http.get<any>(ApiPaths.GET_CONFIG_TEMPLATES);
  }
}
