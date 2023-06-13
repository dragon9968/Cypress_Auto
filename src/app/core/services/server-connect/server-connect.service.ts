import { Observable, Subscription } from "rxjs";
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiPaths } from "../../enums/api-paths.enum";
import { LocalStorageService } from "../../storage/local-storage/local-storage.service";
import { LocalStorageKeys } from "../../storage/local-storage/local-storage-keys.enum";
import { Store } from "@ngrx/store";
import { selectServerConnects } from "../../../store/server-connect/server-connect.selectors";
import { retrievedServerConnect } from "../../../store/server-connect/server-connect.actions";

@Injectable({
  providedIn: 'root'
})
export class ServerConnectService implements OnDestroy {

  selectServerConnects$ = new Subscription()
  serverConnects: any[] = []
  constructor(
    private store: Store,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.selectServerConnects$ = this.store.select(selectServerConnects).subscribe(serverConnects => {
      this.serverConnects = serverConnects
    })
  }

  ngOnDestroy(): void {
    this.selectServerConnects$.unsubscribe()
  }

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

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.CONNECTION_IMPORT, data)
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

  updateConnectionStore(newServerConnect: any) {
    const currentState: any[] = JSON.parse(JSON.stringify(this.serverConnects)) || []
    const newState = currentState.concat(newServerConnect).sort((a: any, b: any) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0
    })
    this.store.dispatch(retrievedServerConnect({data: newState }))
  }
}
