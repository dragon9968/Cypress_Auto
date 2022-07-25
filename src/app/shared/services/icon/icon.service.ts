import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.ICONS);
  }
}
