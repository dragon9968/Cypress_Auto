import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, forkJoin } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { loadMap, mapLoadedSuccess, retrievedMap } from './map.actions';
import { MapService } from 'src/app/core/services/map/map.service';
import { nodesLoadedSuccess } from '../node/node.actions';
import { PGsLoadedSuccess } from '../portgroup/portgroup.actions';
import { interfacesLoadedSuccess } from '../interface/interface.actions';
import { groupsLoadedSuccess } from '../group/group.actions';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { GroupService } from 'src/app/core/services/group/group.service';

@Injectable()
export class MapEffects {

  loadMap$ = createEffect(() => this.actions$.pipe(
    ofType(loadMap),
    exhaustMap((data) => forkJoin([
      this.mapService.getMapData(data.mapCategory, data.projectId),
      this.nodeService.getNodesByProjectId(data.projectId),
      this.portGroupService.getByProjectId(data.projectId),
      this.interfaceService.getByProjectId(data.projectId),
      this.groupService.getGroupByProjectId(data.projectId),
    ]).pipe(
      switchMap(([map, nodesData, portgroupsData, interfacesData, groupsData]) => [
        nodesLoadedSuccess({ nodes: nodesData.result }),
        PGsLoadedSuccess({ portgroups: portgroupsData.result }),
        interfacesLoadedSuccess({ interfaces: interfacesData.result, nodes: nodesData.result }),
        groupsLoadedSuccess({ groups: groupsData.result }),
        mapLoadedSuccess({ data: map })
      ]),
      catchError(() => EMPTY)
    ))
  ));

  constructor(
    private actions$: Actions,
    private mapService: MapService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
    private groupService: GroupService,
  ) { }
}