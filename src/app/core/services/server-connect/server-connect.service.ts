import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaths } from "../../enums/api-paths.enum";
import { LocalStorageService } from "../../storage/local-storage/local-storage.service";
import { LocalStorageKeys } from "../../storage/local-storage/local-storage-keys.enum";

@Injectable({
  providedIn: 'root'
})
export class ServerConnectService {

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.SERVER_CONNECT);
  }

  get(id: number): Observable<any> {
    return this.http.get<any>(ApiPaths.SERVER_CONNECT + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.SERVER_CONNECT, data);
  }

  updateFile(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.ADD_UPDATE_SERVER_CONNECT_FILE, data);
  }

  put(id: number, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.SERVER_CONNECT + id, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(ApiPaths.SERVER_CONNECT + id);
  }

  clearParameters(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CLEAR_PARAMETERS, data)
  }

  exportJson(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CONNECTION_EXPORT, data)
  }

  pingTest(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.PING_TEST, data);
  }

  loginCheck(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.LOGIN_CHECK, data)
  }

  connect(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CONNECT_TO_SERVER, data);
  }

  disconnect(category: string, data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DISCONNECT_FROM_SERVER, data);
  }

  removeConnection(category: string) {
    const connections = this.getAllConnection()
    if (connections) {
      delete connections[category]
      this.localStorageService.setItem(LocalStorageKeys.CONNECTIONS, JSON.stringify(connections));
    }
  }

  getAllConnection() {
    return JSON.parse(<any>this.localStorageService.getItem(LocalStorageKeys.CONNECTIONS))
  }

  getConnection(category: string): any {
    const connections = this.getAllConnection();
    if (connections) {
      return connections[category];
    }
    return connections
  }

  setConnection(category: string, connection: any) {
    let connections = this.getAllConnection() ? this.getAllConnection() : {};
    connections[category] = connection;
    this.localStorageService.setItem(LocalStorageKeys.CONNECTIONS, JSON.stringify(connections));
  }
}
