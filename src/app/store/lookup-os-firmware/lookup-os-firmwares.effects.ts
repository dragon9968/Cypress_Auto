import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap } from 'rxjs';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import { LookupOsFirmwareService } from "../../core/services/lookup-os-firmware/lookup-os-firmware.service";
import {
  addedNewOSFirmwareSuccess,
  addNewOSFirmware,
  deleteOSFirmwares, exportOSFirmwares, importOSFirmware,
  loadedLookupOSFirmwareSuccess,
  loadLookupOSFirmwares,
  updateOSFirmware,
  updateOSFirmwareSuccess
} from "./lookup-os-firmwares.actions";
import { pushNotification } from "../app/app.actions";
import { HelpersService } from "../../core/services/helpers/helpers.service";

@Injectable()
export class LookupOsFirmwaresEffects {

  loadLookupOSFirmwares$ = createEffect(() => this.actions$.pipe(
    ofType(loadLookupOSFirmwares),
    exhaustMap(() => this.lookupOSFirmwareService.getAll().pipe(
      map(res => loadedLookupOSFirmwareSuccess({osFirmwares: res.result})),
      catchError(() => of(pushNotification({
        notification: {
          type: 'error',
          message: 'Load look up OS/Firmware failed!'
        }
      })))
    ))
  ));

  updateOSFirmware$ = createEffect(() => this.actions$.pipe(
    ofType(updateOSFirmware),
    exhaustMap(payload => {
      const {id, ...putData} = payload.osFirmware
      return this.lookupOSFirmwareService.put(id as number, putData).pipe(
        switchMap(res => [
          updateOSFirmwareSuccess({osFirmware: {id, ...res.result}}),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Updated OS/Firmware successfully!'
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Update OS/Firmware failed!'
          }
        })))
      )
    })
  ))

  deletesOSFirmware$ = createEffect(() => this.actions$.pipe(
    ofType(deleteOSFirmwares),
    exhaustMap(payload => (this.lookupOSFirmwareService.delete(payload.pks).pipe(
      switchMap(res => [
        loadLookupOSFirmwares(),
        pushNotification({
          notification: {
            type: 'success',
            message: 'Delete OS/Firmware(ies) successfully!'
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: 'Delete OS/Firmware(ies) failed!'
        }
      })))
    )))
  ))

  importOSFirmware$ = createEffect(() => this.actions$.pipe(
    ofType(importOSFirmware),
    exhaustMap(payload => (this.lookupOSFirmwareService.import(payload.importData).pipe(
      switchMap(res => [
        loadLookupOSFirmwares(),
        pushNotification({
          notification: {
            type: 'success',
            message: 'Imported OS/Firmware(ies) successfully!'
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: 'Import OS/Firmware(ies) failed!'
        }
      })))
    )))
  ))

  exportOSFirmware$ = createEffect(() => this.actions$.pipe(
    ofType(exportOSFirmwares),
    exhaustMap(payload => (this.lookupOSFirmwareService.export(payload.pks).pipe(
      map(res => {
        this.helpersService.downloadBlobWithData(res, 'LookupOSFirmware-Export.json');
        return res
      }),
      map(res => pushNotification({
        notification: {
          type: 'success',
          message: 'Export OS/Firmware(ies) successfully!'
        }
      })),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: 'Export OS/Firmware(ies) failed!'
        }
      })))
    )))
  ))

  addNewLookupOSFirmware$ = createEffect(() => this.actions$.pipe(
    ofType(addNewOSFirmware),
    exhaustMap((payload) => this.lookupOSFirmwareService.add(payload.newOSFirmware)
      .pipe(
        switchMap(res => [
          addedNewOSFirmwareSuccess({newOSFirmware: {id: res.id, ...res.result}}),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Added a new lookup OS/Firmware!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'success',
            message: 'Adda new lookup OS/Firmware failed!'
          }
        })))
      ))
    )

  );

  constructor(
    private actions$: Actions,
    private helpersService: HelpersService,
    private lookupOSFirmwareService: LookupOsFirmwareService
  ) {}
}
