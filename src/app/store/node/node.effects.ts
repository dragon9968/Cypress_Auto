import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { NodeService } from 'src/app/core/services/node/node.service';
import { loadNodes, nodeUpdatedSuccess, nodesLoadedSuccess, updateNode } from './node.actions';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { pushNotification } from '../app/app.actions';
import { updateNodeInInterfaces } from '../interface/interface.actions';

@Injectable()
export class NodesEffects {

  loadNodes$ = createEffect(() => this.actions$.pipe(
    ofType(loadNodes),
    exhaustMap((payload) => this.nodeService.getNodesByProjectId(payload.projectId)
      .pipe(
        map(res => nodesLoadedSuccess({ nodes: res.result })),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load node failed!'
          }
        })))
      ))
  ));

  updateNode$ = createEffect(() => this.actions$.pipe(
    ofType(updateNode),
    exhaustMap((payload) => this.nodeService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => {
          if (payload.configTemplate) {
            const configData = { pk: payload.id, config_ids: payload.configTemplate };
            return this.nodeService.associate(configData);
          } else {
            return of([]);
          }
        }),
        mergeMap(res => {
          if (payload.configDefaultNode) {
            return this.configTemplateService.putConfiguration(payload.configDefaultNode);
          } else {
            return of([]);
          }
        }),
        mergeMap(res => this.nodeService.get(payload.id)),
        map((res: any) => {
          this.helpersService.updateNodeOnMap(`node-${payload.id}`, res.result);
          this.helpersService.reloadGroupBoxes();
          return res.result;
        }),
        switchMap((node: any) => [
          nodeUpdatedSuccess({ node }),
          updateNodeInInterfaces({ node }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Node details updated!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Update node failed!'
          }
        })))
      )),
  ));

  constructor(
    private actions$: Actions,
    private nodeService: NodeService,
    private configTemplateService: ConfigTemplateService,
    private helpersService: HelpersService,
  ) { }
}