import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, mergeMap, of } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { clearLinkedMap, loadLinkedMap, loadMap, mapLoadedDefaultPreferencesSuccess, reloadGroupBoxes, removeNodesOnMap } from './map.actions';
import { MapService } from 'src/app/core/services/map/map.service';
import { clearLinkedMapNodes, linkedMapNodesLoadedSuccess, nodesLoadedSuccess } from '../node/node.actions';
import { clearLinkedMapPGs, linkedMapPGsLoadedSuccess, PGsLoadedSuccess } from '../portgroup/portgroup.actions';
import {
  clearLinkedMapInterfaces,
  interfacesLoadedSuccess,
  linkedMapInterfacesLoadedSuccess
} from '../interface/interface.actions';
import { groupsLoadedSuccess } from '../group/group.actions';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { GroupService } from 'src/app/core/services/group/group.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { pushNotification } from '../app/app.actions';
import { MapImageService } from 'src/app/core/services/map-image/map-image.service';
import {
  clearLinkedMapImages,
  linkedMapImagesLoadedSuccess,
  mapImagesLoadedSuccess
} from '../map-image/map-image.actions';
import { MapLinkService } from "../../core/services/map-link/map-link.service";
import { addLinkedElementsToMap, mapLinksLoadedSuccess } from "../map-link/map-link.actions";
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
      this.mapLinkService.getMapLinksByProjectId(payload.projectId)
    ]).pipe(
      switchMap(([
        defaultPreferences,
        nodesData,
        portgroupsData,
        interfacesData,
        groupsData,
        mapImagesData,
        mapLinkData,
      ]) => [
        mapLinksLoadedSuccess({ mapLinks: mapLinkData.result }),
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

  loadLinkedMap$ = createEffect(() => this.actions$.pipe(
    ofType(loadLinkedMap),
    mergeMap((payload) => forkJoin([
      this.nodeService.getNodesByProjectId(payload.projectId),
      this.portGroupService.getByProjectId(payload.projectId),
      this.interfaceService.getByProjectId(payload.projectId),
      this.mapImageService.getMapImageByProjectId(Number(payload.projectId)),
    ]).pipe(
      switchMap(([ nodesData, portgroupsData, interfacesData, mapImagesData ]) => [
        linkedMapNodesLoadedSuccess({
          nodes: nodesData.result,
          mapLinkId: payload.mapLinkId,
          position: payload.position
        }),
        linkedMapPGsLoadedSuccess({
          portgroups: portgroupsData.result,
          mapLinkId: payload.mapLinkId,
          position: payload.position
        }),
        linkedMapInterfacesLoadedSuccess({
          interfaces: interfacesData.result,
          nodes: nodesData.result
        }),
        linkedMapImagesLoadedSuccess({
          mapImages: mapImagesData.result,
          mapLinkId: payload.mapLinkId,
          position: payload.position
        }),
        addLinkedElementsToMap()
      ]),
      catchError((e) => of(pushNotification({
        notification: {
          type: 'error',
          message: 'Load Map Link failed!'
        }
      })))
    ))
  ));

  clearLinkedMaps = createEffect(() => this.actions$.pipe(
    ofType(clearLinkedMap),
    switchMap(() => [
      clearLinkedMapNodes(),
      clearLinkedMapPGs(),
      clearLinkedMapImages(),
      clearLinkedMapInterfaces()
    ])
  ))
  removeNodesOnMap$ = createEffect(() => this.actions$.pipe(
    ofType(removeNodesOnMap),
    tap((payload) => this.helpersService.removeNodesOnMap(payload.ids))
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
    private mapLinkService: MapLinkService,
    private projectService: ProjectService
  ) { }
}
