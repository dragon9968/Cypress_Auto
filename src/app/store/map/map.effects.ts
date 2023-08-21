import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, mergeMap, of } from 'rxjs';
import { catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import {
  addTemplateIntoProject,
  addTemplateItemsToMap,
  clearLinkedMap,
  loadLinkedMap,
  loadMap,
  mapLoadedDefaultPreferencesSuccess,
  reloadGroupBoxes,
  removeNodesOnMap,
  selectAllElementsOnMap,
  unSelectAllElementsOnMap
} from './map.actions';
import { MapService } from 'src/app/core/services/map/map.service';
import {
  clearLinkedMapNodes,
  linkedMapNodesLoadedSuccess,
  nodesLoadedSuccess,
  selectAllNode,
  unSelectAllNode
} from '../node/node.actions';
import {
  clearLinkedMapPGs,
  linkedMapPGsLoadedSuccess,
  PGsLoadedSuccess,
  selectAllPG,
  unselectAllPG
} from '../portgroup/portgroup.actions';
import {
  clearLinkedMapInterfaces,
  interfacesLoadedSuccess,
  linkedMapInterfacesLoadedSuccess,
  selectAllInterface,
  unSelectAllInterface
} from '../interface/interface.actions';
import { groupsLoadedSuccess, selectAllGroup, unSelectAllGroup } from '../group/group.actions';
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
  mapImagesLoadedSuccess,
  selectAllMapImage,
  unSelectAllMapImage
} from '../map-image/map-image.actions';
import { MapLinkService } from "../../core/services/map-link/map-link.service";
import {
  addLinkedElementsToMap,
  mapLinksLoadedSuccess,
  selectAllMapLink,
  unSelectAllMapLink
} from "../map-link/map-link.actions";
import { ProjectService } from 'src/app/project/services/project.service';
import { domainsLoadedSuccess } from "../domain/domain.actions";
import { DomainService } from "../../core/services/domain/domain.service";
import { SuccessMessages } from "../../shared/enums/success-messages.enum";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";

@Injectable()
export class MapEffects {

  loadMap$ = createEffect(() => this.actions$.pipe(
    ofType(loadMap),
    exhaustMap((payload) => forkJoin([
      this.projectService.get(payload.projectId),
      this.nodeService.getNodesByProjectId(payload.projectId),
      this.portGroupService.getByProjectId(payload.projectId),
      this.interfaceService.getByProjectId(payload.projectId),
      this.groupService.getGroupByProjectId(payload.projectId),
      this.mapImageService.getMapImageByProjectId(payload.projectId),
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

  addTemplateIntoProject$ = createEffect(() => this.actions$.pipe(
    ofType(addTemplateIntoProject),
    exhaustMap(payload => this.mapService.addTemplateIntoMap(payload.data).pipe(
      mergeMap(res => forkJoin([
        this.domainService.getDomainByProjectId(payload.data.project_id),
        this.groupService.getGroupByProjectId(payload.data.project_id),
        this.nodeService.getNodesByProjectId(payload.data.project_id),
        this.portGroupService.getByProjectId(payload.data.project_id),
        this.interfaceService.getByProjectId(payload.data.project_id),
        this.mapImageService.getMapImageByProjectId(Number(payload.data.project_id)),
        of(res.result)
      ])),
      switchMap(([domainRes, groupRes, nodeRes, portGroupRes, edgeRes, mapImageRes, newItemIds]) => [
        domainsLoadedSuccess({ domains: domainRes.result }),
        groupsLoadedSuccess({ groups: groupRes.result }),
        nodesLoadedSuccess({ nodes: nodeRes.result }),
        PGsLoadedSuccess({ portgroups: portGroupRes.result }),
        interfacesLoadedSuccess({ interfaces: edgeRes.result, nodes: nodeRes.result }),
        mapImagesLoadedSuccess({ mapImages: mapImageRes.result }),
        addTemplateItemsToMap({ newItemIds, newPosition: payload.newPosition }),
        pushNotification({
          notification: {
            type: 'success',
            message: SuccessMessages.ADDED_TEMPLATE_TO_PROJECT_SUCCESS
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'success',
          message: ErrorMessages.ADD_TEMPLATE_TO_PROJECT_FAILED
        }
      })))
    ))
  ))

  addTemplateItemsToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addTemplateItemsToMap),
    tap((payload) => this.helpersService.addTemplateItemsToMap(payload.newItemIds, payload.newPosition))
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

  selectAllElementsOnMap$ = createEffect(() => this.actions$.pipe(
    ofType(selectAllElementsOnMap),
    switchMap(() => [
      selectAllNode(),
      selectAllPG(),
      selectAllInterface(),
      selectAllMapImage(),
      selectAllMapLink(),
      selectAllGroup(),
    ])
  ))

  unSelectAllElementsOnMap$ = createEffect(() => this.actions$.pipe(
    ofType(unSelectAllElementsOnMap),
    switchMap(() => [
      unSelectAllNode(),
      unselectAllPG(),
      unSelectAllInterface(),
      unSelectAllMapImage(),
      unSelectAllMapLink(),
      unSelectAllGroup()
    ])
  ))

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
    private projectService: ProjectService,
    private domainService: DomainService,
  ) { }
}
