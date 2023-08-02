import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, switchMap, tap } from 'rxjs/operators';
import {
  mapLinkUpdatedSuccess,
  updateMapLink,
  addNewMapLink,
  mapLinkAddedSuccess,
  addNewMapLinkToMap,
  loadMapLinks, mapLinksLoadedSuccess, addLinkedElementsToMap
} from './map-link.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { pushNotification } from '../app/app.actions';
import { MapLinkService } from "../../core/services/map-link/map-link.service";
import { removeProjectNotLink } from "../project/project.actions";
import { loadLinkedMap } from "../map/map.actions";

@Injectable()
export class MapLinkEffects {

  loadMapLinks$ = createEffect(() => this.actions$.pipe(
    ofType(loadMapLinks),
    exhaustMap((payload) => this.mapLinkService.getMapLinksByProjectId(payload.projectId)
      .pipe(
        map(res => mapLinksLoadedSuccess({ mapLinks: res.result })),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load map links failed!'
          }
        })))
      ))
  ));

  addLinkedElementsToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addLinkedElementsToMap),
    tap((payload) => this.helpersService.addLinkedElementsToMap())
  ), { dispatch: false });

  addNewMapLink$ = createEffect(() => this.actions$.pipe(
    ofType(addNewMapLink),
    exhaustMap(payload => this.mapLinkService.add(payload.mapLink).pipe(
      switchMap(res => [
        mapLinkAddedSuccess({ mapLink: { id: res.id, ...res.result } }),
        addNewMapLinkToMap({ id: res.id }),
        loadLinkedMap({
          projectId: res.result.linked_project_id,
          mapCategory: 'logical',
          mapLinkId: res.id,
          position: res.result.logical_map.position
        }),
        removeProjectNotLink({ projectNotLinkId: res.result.linked_project_id }),
        pushNotification({
          notification: {
            type: 'success',
            message: 'Add project link successfully'
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: 'Add project link failed!'
        }
      })))
    ))
  ))

  addNewMapLinkToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addNewMapLinkToMap),
    tap(payload => this.helpersService.addNewMapLinkToMap(payload.id))
  ), { dispatch: false })

  constructor(
    private actions$: Actions,
    private helpersService: HelpersService,
    private mapLinkService: MapLinkService
  ) { }
}
