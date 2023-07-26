import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { logicalInterfaceUpdatedSuccess, interfacesLoadedSuccess, loadInterfaces, updateLogicalInterface } from './interface.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { pushNotification } from '../app/app.actions';
import { updateInterfaceInNode } from '../node/node.actions';

@Injectable()
export class InterfacesEffects {

  loadInterfaces$ = createEffect(() => this.actions$.pipe(
    ofType(loadInterfaces),
    exhaustMap((payload) => this.interfaceService.getByProjectId(payload.projectId)
      .pipe(
        map(res => (interfacesLoadedSuccess({ interfaces: res.result, nodes: [] }))),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load Interfaces failed!'
          }
        })))
      ))
  )
  );

  updateLogicalInterface$ = createEffect(() => this.actions$.pipe(
    ofType(updateLogicalInterface),
    exhaustMap((payload) => this.interfaceService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => this.interfaceService.get(payload.id)),
        map((res: any) => {
          if (res.result.category != 'management') {
            this.helpersService.updateInterfaceOnMap(`interface-${payload.id}`, res.result);
            this.helpersService.showOrHideArrowDirectionOnEdge(payload.id);
          }
          return res.result;
        }),
        switchMap((interfaceData: any) => [
          logicalInterfaceUpdatedSuccess({ interfaceData }),
          updateInterfaceInNode({
            interfaceData: { 
              ...interfaceData,
              netmaskName: this.helpersService.getOptionById(payload.netmasks, interfaceData.netmask_id).name
            }
          }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Port group details updated!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Update Port group failed!'
          }
        })))
      )),
  ));

  constructor(
    private actions$: Actions,
    private interfaceService: InterfaceService,
    private helpersService: HelpersService
  ) { }
}