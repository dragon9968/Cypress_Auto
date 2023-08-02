import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { loadMap, mapLoadedDefaultPreferencesSuccess, reloadGroupBoxes } from './map.actions';
import { MapService } from 'src/app/core/services/map/map.service';
import { nodesLoadedSuccess } from '../node/node.actions';
import { PGsLoadedSuccess } from '../portgroup/portgroup.actions';
import { interfacesLoadedSuccess } from '../interface/interface.actions';
import { groupsLoadedSuccess } from '../group/group.actions';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { GroupService } from 'src/app/core/services/group/group.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { pushNotification } from '../app/app.actions';
import { MapImageService } from 'src/app/core/services/map-image/map-image.service';
import { mapImagesLoadedSuccess } from '../map-image/map-image.actions';
import { ProjectService } from 'src/app/project/services/project.service';

@Injectable()
export class MapEffects {

  loadMap$ = createEffect(() => this.actions$.pipe(
    ofType(loadMap),
    exhaustMap((payload) => forkJoin([
      this.projectService.get(Number(payload.projectId)),
      this.nodeService.getNodesByProjectId(payload.projectId),
      this.portGroupService.getByProjectId(payload.projectId),
      this.interfaceService.getByProjectId(payload.projectId),
      this.groupService.getGroupByProjectId(payload.projectId),
      this.mapImageService.getMapImageByProjectId(Number(payload.projectId)),
    ]).pipe(
      switchMap(([defaultPreferences, nodesData, portgroupsData, interfacesData, groupsData, mapImagesData]) => [
        nodesLoadedSuccess({ nodes: nodesData.result }),
        PGsLoadedSuccess({ portgroups: portgroupsData.result }),
        interfacesLoadedSuccess({ interfaces: interfacesData.result, nodes: nodesData.result }),
        groupsLoadedSuccess({ groups: groupsData.result }),
        mapImagesLoadedSuccess({ mapImages: mapImagesData.result }),
        mapLoadedDefaultPreferencesSuccess({ data: defaultPreferences.result })
      ]),
      catchError((e) => of(pushNotification({
        notification: {
          type: 'error',
          message: 'Load Map failed!'
        }
      })))
    ))
  ));

  reloadGroupBoxes$ = createEffect(() => this.actions$.pipe(
    ofType(reloadGroupBoxes),
    tap((payload) => this.helpersService.reloadGroupBoxes())
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private mapService: MapService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
    private groupService: GroupService,
    private helpersService: HelpersService,
    private mapImageService: MapImageService,
    private projectService: ProjectService
  ) { }
}