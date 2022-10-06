import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaths } from "../../enums/api-paths.enum";

@Injectable({
  providedIn: 'root'
})
export class ServerConnectService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.SERVER_CONNECT);
  }
}
