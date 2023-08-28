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
  addInterfaceMapLinkToPG,
  interfaceAddedMapLinkToPGSuccess,
  addInterfaceMapLinkToMap,
  randomizeIpBulk,
  randomizeIpBulkSuccess,
  removeInterfaces,
  removeInterfacesSuccess,
  restoreInterfaces,
  restoreInterfacesSuccess,
  addLogicalInterface,
  interfaceLogicalMapAddedSuccess,
  addInterfaceLogicalToMap,
  addInterfacesNotConnectPG,
  connectInterfaceToPG,
  addInterfacesLogicalToMap,
  addLogicalInterfacesByNodeId,
  logicalInterfacesAddedSuccess,
  addPhysicalInterface,
  interfacePhysicalMapAddedSuccess,
  addInterfacesToSourceNodeOrTargetNode,
  connectPhysicalInterfaces,
  physicalInterfaceUpdatedSuccess,
  addPhysicalInterfaceToMap,
  updateConnectedPhysicalInterface,
  removePhysicalInterfaceOnMap,
  removeConnectedPhysicalInterfaces,
  bulkUpdatedPhysicalInterfaceSuccess
} from './interface.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { pushNotification } from '../app/app.actions';
import { addInterfaceInNode, addPhysicalInterfaceInNode, bulkUpdateInterfaceInNode, removeInterfacesInNode, restoreInterfacesInNode, updateInterfaceInNode } from '../node/node.actions';
import { SuccessMessages } from "../../shared/enums/success-messages.enum";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";

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

  addLogicalInterface$ = createEffect(() => this.actions$.pipe(
    ofType(addLogicalInterface),
    exhaustMap(payload => this.interfaceService.add(payload.edge).pipe(
      mergeMap(res => this.interfaceService.get(res.id)),
      switchMap(res => [
        interfaceLogicalMapAddedSuccess({ edge: res.result }),
        addInterfacesNotConnectPG({ edge: res.result }),
        addInterfaceInNode({
          interfaceData: {
            id: res.id,
            ...res.result,
            netmaskName: this.helpersService.getOptionById(payload.netmasks, res.result.netmask_id).name
          }
        }),
        pushNotification({
          notification: {
            type: 'success',
            message: SuccessMessages.ADDED_NEW_EDGE_SUCCESS
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: ErrorMessages.ADD_NEW_EDGE_FAILED
        }
      })))
    ))
  ))

  addPhysicalInterface$ = createEffect(() => this.actions$.pipe(
    ofType(addPhysicalInterface),
    exhaustMap(payload => this.interfaceService.add(payload.data).pipe(
      mergeMap(res => this.interfaceService.get(res.id)),
      switchMap(res => [
        interfacePhysicalMapAddedSuccess({ edge: res.result }),
        addInterfacesToSourceNodeOrTargetNode({ edge: res.result, mode: payload.mode }),
        addPhysicalInterfaceInNode({
          interfaceData: {
            id: res.id,
            ...res.result,
            netmaskName: this.helpersService.getOptionById(payload.netmasks, res.result.netmask_id).name
          }
        }),
        pushNotification({
          notification: {
            type: 'success',
            message: SuccessMessages.ADDED_NEW_EDGE_SUCCESS
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: ErrorMessages.ADD_NEW_EDGE_FAILED
        }
      })))
    ))
  ))

  connectInterfaceToPG$ = createEffect(() => this.actions$.pipe(
    ofType(connectInterfaceToPG),
    exhaustMap((payload) => this.interfaceService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => this.interfaceService.get(payload.id)),
        switchMap((res: any) => [
          logicalInterfaceUpdatedSuccess({ interfaceData: res.result }),
          addInterfaceLogicalToMap({ id: payload.id }),
          pushNotification({
            notification: {
              type: 'success',
              message: SuccessMessages.CONNECTED_EDGE_TO_PG_SUCCESS
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: ErrorMessages.CONNECT_EDGE_TO_PG_FAILED
          }
        })))
      )),
  ));

  connectPhysicalInterfaces$ = createEffect(() => this.actions$.pipe(
    ofType(connectPhysicalInterfaces),
    exhaustMap((payload) => this.interfaceService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => this.interfaceService.get(payload.id)),
        switchMap((res: any) => [
          physicalInterfaceUpdatedSuccess({ interfaceData: res.result }),
          addPhysicalInterfaceToMap({ id: payload.id, mode: true }),
          pushNotification({
            notification: {
              type: 'success',
              message: SuccessMessages.CONNECTED_PHYSICAL_INTERFACE_SUCCESS
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: ErrorMessages.CONNECTE_PHYSICAL_INTERFACE_FAILED
          }
        })))
      )),
  ));

  removeConnectedPhysicalInterfaces$ = createEffect(() => this.actions$.pipe(
    ofType(removeConnectedPhysicalInterfaces),
    exhaustMap((payload) => {
      return forkJoin(payload.ids.map((id: any) => {
        const jsonDataValue = {
          interface_id: null,
          task: `Deleted connect interface`
        }
        return this.interfaceService.put(id, jsonDataValue)
      }))
      .pipe(
        mergeMap(res => {
          return forkJoin(payload.ids.map((id: any) => {
            return this.interfaceService.get(id).pipe(map(interfaceData => {
              this.helpersService.removePhysicalInterfaceOnMap(id);
              return interfaceData.result;
            }));
          }))
        }),
        switchMap((res: any) => [
          bulkUpdatedPhysicalInterfaceSuccess({ interfacesData: res }),
          pushNotification({
            notification: {
              type: 'success',
              message: SuccessMessages.DELETE_CONNETECD_PHYSICAL_INTERFACE_SUCCESS
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: ErrorMessages.DELETE_CONNETECD_PHYSICAL_INTERFACE_FAILED
          }
        })))
      )
    }),
  ));

  updateConnectedPhysicalInterface$ = createEffect(() => this.actions$.pipe(
    ofType(updateConnectedPhysicalInterface),
    exhaustMap((payload) => this.interfaceService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res =>  {
          if (payload.mode) {
            const data = { interface_id: null, task: 'Updated connect Interface' };
            return this.interfaceService.put(payload.currentEdgeId, data);
          } else {
            return of([]);
          }
        }),
        mergeMap(res => this.interfaceService.get(payload.id)),
        map((res: any) => {
          if (res.result.category != 'management' && !payload.mode) {
            this.helpersService.updatePhysicalInterfaceOnMap(`interface-${payload.id}`, res.result, payload.target);
            this.helpersService.showOrHideArrowDirectionOnEdge(payload.id);
          }
          return res;
        }),
        switchMap((res: any) => [
          physicalInterfaceUpdatedSuccess({ interfaceData: res.result }),
          removePhysicalInterfaceOnMap({ id: payload.currentEdgeId, mode: payload.mode }),
          addPhysicalInterfaceToMap({ id: payload.id, mode: payload.mode }),
          pushNotification({
            notification: {
              type: 'success',
              message: SuccessMessages.UPDATED_CONNECTED_PHYSICAL_INTERFACES_SUCCESS
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: ErrorMessages.UPDATED_CONNECTED_PHYSICAL_INTERFACES_FAILED
          }
        })))
      )),
  ));

  addPhysicalInterfaceToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addPhysicalInterfaceToMap),
    tap((payload) => {
      if (payload.mode) {
        this.helpersService.addPhysicalInterfaceToMap(payload.id)
      }
    })
  ), { dispatch: false })

  removePhysicalInterfaceOnMap$ = createEffect(() => this.actions$.pipe(
    ofType(removePhysicalInterfaceOnMap),
    tap((payload) => {
      if (payload.mode) {
        this.helpersService.removePhysicalInterfaceOnMap(payload.id)
      }
    })
  ), { dispatch: false })

  addInterfaceLogicalToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addInterfaceLogicalToMap),
    tap((payload) => this.helpersService.addInterfaceLogicalToMap(payload.id))
  ), { dispatch: false })

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
  ));

  addLogicalInterfacesByNodeId$ = createEffect(() => this.actions$.pipe(
    ofType(addLogicalInterfacesByNodeId),
    mergeMap((payload) => this.interfaceService.getByNode(payload.nodeId)),
    switchMap(res => [
      logicalInterfacesAddedSuccess({ edges: res.result }),
      addInterfacesLogicalToMap({ edges: res.result })
    ])
  ))

  addInterfacesLogicalToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addInterfacesLogicalToMap),
    tap((payload) => this.helpersService.addInterfacesLogicalToMap(payload.edges))
  ), { dispatch: false })

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
            this.helpersService.changeEdgeLabelById(payload.id);
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
  removeInterfaces$ = createEffect(() => this.actions$.pipe(
    ofType(removeInterfaces),
    exhaustMap(payload => of([])
      .pipe(
        switchMap(res => [
          removeInterfacesSuccess({ ids: payload.ids, mapCategory: payload.mapCategory }),
          removeInterfacesInNode({ ids: payload.ids, mapCategory: payload.mapCategory }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Edge removed!'
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Remove edge failed'
          }
        })))
      ))
  ));

  restoreInterfaces$ = createEffect(() => this.actions$.pipe(
    ofType(restoreInterfaces),
    exhaustMap(payload => of([])
      .pipe(
        switchMap(res => [
          restoreInterfacesSuccess({ ids: payload.ids, mapCategory: payload.mapCategory }),
          restoreInterfacesInNode({ ids: payload.ids, mapCategory: payload.mapCategory }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Edge restored!'
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Restore edge failed'
          }
        })))
      ))
  ));

  constructor(
    private actions$: Actions,
    private interfaceService: InterfaceService,
    private helpersService: HelpersService
  ) { }
}
