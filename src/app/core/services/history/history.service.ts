import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { ApiPaths } from "../../enums/api-paths.enum";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.HISTORIES);
  }
}
