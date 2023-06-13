import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiPaths } from '../../enums/api-paths.enum';
import { Store } from "@ngrx/store";
import { selectDevices } from "../../../store/device/device.selectors";
import { retrievedDevices } from "../../../store/device/device.actions";
import { HelpersService } from "../helpers/helpers.service";

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements OnDestroy {
  devices: any[] = []
  selectDevices$ = new Subscription()
  constructor(
    private store: Store,
    private http: HttpClient,
    private helpersService: HelpersService
  ) {
    this.selectDevices$ = this.store.select(selectDevices).subscribe(devices => this.devices = devices)
  }

  ngOnDestroy(): void {
    this.selectDevices$.unsubscribe()
  }

  getAll(): Observable<any> {
    return this.http.get<any>(ApiPaths.DEVICES);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(ApiPaths.DEVICES + id);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DEVICES_ADD, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(ApiPaths.DEVICES + id);
  }

  put(data: any): Observable<any> {
    return this.http.put<any>(ApiPaths.DEVICES_UPDATE, data)
  }

  export(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DEVICES_EXPORT, data)
  }

  import(data: any): Observable<any> {
    return this.http.post<any>(ApiPaths.DEVICE_IMPORT, data)
  }

  updateDeviceStore(newItem: any) {
    const currentState = JSON.parse(JSON.stringify(this.devices))
    const newState = this.helpersService.sortListByKeyInObject(currentState.concat(newItem))
    this.store.dispatch(retrievedDevices({ data: newState }))
  }
}
