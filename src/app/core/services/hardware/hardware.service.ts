import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiPaths } from 'src/app/core/enums/api-paths.enum';
import { Store } from "@ngrx/store";
import { selectHardwares } from "../../../store/hardware/hardware.selectors";
import { retrievedHardwares } from "../../../store/hardware/hardware.actions";

@Injectable({
  providedIn: 'root'
})
export class HardwareService implements OnDestroy {

  hardware: any[] = []
  selectHardware$ = new Subscription()

  constructor(
    private store: Store,
    private http: HttpClient
  ) {
    this.selectHardware$ = this.store.select(selectHardwares).subscribe(hardware => this.hardware = hardware)
  }

  ngOnDestroy(): void {
    this.selectHardware$.unsubscribe()
  }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.HARDWARES);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.HARDWARES + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.HARDWARES, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.HARDWARES + id);
  }

  put(id: string, data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.HARDWARES + id, data);
  }

  export(format: string, data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.HARDWARE_EXPORT + format, data);
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.HARDWARE_IMPORT, data);
  }

  updateHardwareStore(newServerConnect: any) {
    const currentState: any[] = JSON.parse(JSON.stringify(this.hardware)) || []
    const newState = currentState.concat(newServerConnect)
    this.store.dispatch(retrievedHardwares({data: newState }))
  }
}
