import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class LdapConfigService {

  constructor(private http: HttpClient) { 
    
  }
  
  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.LDAP_CONFIG);
  }

  updateConfig(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LDAP_CONFIG, data);
  }
}
