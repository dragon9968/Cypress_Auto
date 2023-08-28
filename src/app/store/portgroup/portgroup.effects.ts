import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import {
  PGsLoadedSuccess,
  bulkEditPG,
  bulkUpdatedPGSuccess,
  loadPGs,
  pgUpdatedSuccess,
  removePGs,
  removePGsSuccess,
  restorePGs,
  restorePGsSuccess,
  updatePG,
  addNewPG,
  portGroupAddedSuccess,
  addNewPGToMap,
  randomizeSubnetPortGroups,
  randomizeSubnetPortGroupsSuccess,
  updateInterfaceIPBasedOnPGId
} from './portgroup.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { updatePGInInterfaces } from '../interface/interface.actions';
import { pushNotification } from '../app/app.actions';
import { reloadGroupBoxes } from '../map/map.actions';
import { removePGsInGroup, restorePGsInGroup } from '../group/group.actions';
import { updatePGInGroup } from "../group/group.actions";
import { InfoPanelService } from 'src/app/core/services/info-panel/info-panel.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';

@Injectable()
export class PortGroupsEffects {

  loadPGs$ = createEffect(() => this.actions$.pipe(
    ofType(loadPGs),
    exhaustMap((payload) => this.portGroupService.getByProjectId(payload.projectId)
      .pipe(
        map(res => (PGsLoadedSuccess({ portgroups: res.result }))),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load Portgroups failed!'
          }
        })))
      ))
  )
  );

  addNewPG$ = createEffect(() => this.actions$.pipe(
    ofType(addNewPG),
    exhaustMap(payload => this.portGroupService.add(payload.portGroup)
      .pipe(
        mergeMap(res => this.portGroupService.get(res.id)),
        switchMap(res => [
          portGroupAddedSuccess({ portGroup: res.result }),
          updatePGInGroup({ portGroup: res.result }),
          addNewPGToMap({ id: res.id }),
          reloadGroupBoxes(),
          pushNotification({
            notification: {
              type: 'success',
              message: payload.message ? payload.message : 'Port Group details added!'
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Add New Port Group failed!'
          }
        })))
      ))
  ))

  addNewNodeToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addNewPGToMap),
    tap(payload => this.helpersService.addPGToMap(payload.id))
  ), { dispatch: false })

  updatePG$ = createEffect(() => this.actions$.pipe(
    ofType(updatePG),
    exhaustMap((payload) => this.portGroupService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => this.portGroupService.get(payload.id)),
        map((res: any) => {
          if (res.result.category != 'management') {
            this.helpersService.updatePGOnMap(`pg-${payload.id}`, res.result);
            this.helpersService.changePGLabelById(payload.id);
            this.helpersService.reloadGroupBoxes();
          }
          return res.result;
        }),
        switchMap((portgroup: any) => [
          pgUpdatedSuccess({ portgroup }),
          updatePGInInterfaces({ portgroup }),
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

  bulkEditPG$ = createEffect(() => this.actions$.pipe(
    ofType(bulkEditPG),
    exhaustMap((payload) => this.portGroupService.editBulk(payload.data)
      .pipe(
        mergeMap(res => {
          return forkJoin(payload.ids.map((id: any) => {
            return this.portGroupService.get(id).pipe(map(pgData => {
              this.helpersService.updatePGOnMap(`pg-${id}`, pgData.result);
              return pgData.result
            }))
          }))
        }),
        switchMap((portgroups: any) => [
          bulkUpdatedPGSuccess({ portgroups }),
          reloadGroupBoxes(),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Bulk edit port group successfully!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Bulk edit port group failed!'
          }
        })))
      )),
  ));

  removePGs$ = createEffect(() => this.actions$.pipe(
    ofType(removePGs),
    exhaustMap(payload => of([])
      .pipe(
        switchMap(res => [
          removePGsSuccess({ ids: payload.ids }),
          removePGsInGroup({ ids: payload.ids }),
          reloadGroupBoxes(),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Portgroup removed!'
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Remove portgroup failed'
          }
        })))
      ))
  ));

  restorePGs$ = createEffect(() => this.actions$.pipe(
    ofType(restorePGs),
    exhaustMap(payload => of([])
      .pipe(
        switchMap(res => [
          restorePGsSuccess({ ids: payload.ids }),
          restorePGsInGroup({ ids: payload.ids }),
          reloadGroupBoxes(),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Portgroup restored!'
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Restore portgroup failed'
          }
        })))
      ))
  ));

  randomizeSubnetPortGroups$ = createEffect(() => this.actions$.pipe(
    ofType(randomizeSubnetPortGroups),
    exhaustMap(payload => this.portGroupService.randomizeSubnetBulk(payload.data)
      .pipe(
        map(res => {
          res.result.map((ele: any) => {
            this.helpersService.updateSubnetPgOnMap(ele)
          })
          return res
        }),
        switchMap((res: any) => [
          updateInterfaceIPBasedOnPGId({ ids: payload.pks }),
          randomizeSubnetPortGroupsSuccess({ portGroups: res.result }),
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
      ))
  ))

  updateInterfaceIPBasedOnPGId$ = createEffect(() => this.actions$.pipe(
    ofType(updateInterfaceIPBasedOnPGId),
    tap((payload) => this.infoPanelService.updateInterfaceIPBasedOnPGId(payload.ids))
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private portGroupService: PortGroupService,
    private helpersService: HelpersService,
    private interfaceService: InterfaceService,
    private infoPanelService: InfoPanelService
  ) { }
}
