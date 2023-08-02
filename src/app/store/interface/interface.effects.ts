import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of, tap } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import {
  logicalInterfaceUpdatedSuccess,
  interfacesLoadedSuccess,
  loadInterfaces,
  updateLogicalInterface,
  bulkEditLogicalInterface,
  bulkEditlogicalInterfaceSuccess,
  addInterfaceMapLinkToPG, interfaceAddedMapLinkToPGSuccess, addInterfaceMapLinkToMap, randomizeIpBulk, randomizeIpBulkSuccess
} from './interface.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { pushNotification } from '../app/app.actions';
import { bulkUpdateInterfaceInNode, updateInterfaceInNode } from '../node/node.actions';

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

  addInterfaceMapLinkToPG$ = createEffect(() => this.actions$.pipe(
    ofType(addInterfaceMapLinkToPG),
    exhaustMap(payload => this.interfaceService.add(payload.edge).pipe(
      switchMap(res => [
        interfaceAddedMapLinkToPGSuccess({ edge: { id: res.id , ...res.result} }),
        addInterfaceMapLinkToMap({ id: res.id }),
        pushNotification({
          notification: {
            type: 'success',
            message: 'Linked Project Successfully!'
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: 'Linked Project Failed!'
        }
      })))
    ))
  ))

  addInterfaceMapLinkToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addInterfaceMapLinkToMap),
    tap((payload) => this.helpersService.addInterfaceMapLinkToMap(payload.id))
  ), { dispatch: false })

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
              message: 'Edge details updated!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Update Edge failed!'
          }
        })))
      )),
  ));

  bulkEditLogicalInterface$ = createEffect(() => this.actions$.pipe(
    ofType(bulkEditLogicalInterface),
    exhaustMap((payload) => this.interfaceService.editBulk(payload.data)
      .pipe(
        mergeMap(res => {
          return forkJoin(payload.ids.map((id: any) => {
            return this.interfaceService.get(id).pipe(map(interfaceData => {
              if (res.result.category != 'management') {
                this.helpersService.updateInterfaceOnMap(`interface-${id}`, interfaceData.result);
                this.helpersService.showOrHideArrowDirectionOnEdge(id);
                return interfaceData.result;
              }
            }))
          }))
        }),
        switchMap((interfacesData: any) => [
          bulkEditlogicalInterfaceSuccess({ interfacesData }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Bulk edit edge successfully!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Bulk edit edge failed!'
          }
        })))
      )),
  ));

  randomizeIpBulk$ = createEffect(() => this.actions$.pipe(
    ofType(randomizeIpBulk),
    exhaustMap((payload) => this.interfaceService.randomizeIpBulk(payload)
      .pipe(
        map(res => {
          res.result.map((ele: any) => {
            this.helpersService.updateInterfaceOnMap(`interface-${ele.id}`, ele);
            this.helpersService.showOrHideArrowDirectionOnEdge(ele.id);
          })
          return res
        }),
        switchMap((res: any) => [
          randomizeIpBulkSuccess({interfacesData: res.result}),
          bulkUpdateInterfaceInNode({
            interfacesData: { 
              interfacesData: res.result,
              netmasks: payload.netmasks
            }
          }),
          pushNotification({
            notification: {
              type: 'success',
              message: res.message
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: `${e.error.message}`
          }
        })))
      )
    )
  ))

  constructor(
    private actions$: Actions,
    private interfaceService: InterfaceService,
    private helpersService: HelpersService
  ) { }
}
