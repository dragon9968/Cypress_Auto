import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaths } from "../../enums/api-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(
    private httpClient: HttpClient
  ) { }

  add(data: any): Observable<any>{
    return this.httpClient.post<any>(ApiPaths.TOOL, data);
  }
}
