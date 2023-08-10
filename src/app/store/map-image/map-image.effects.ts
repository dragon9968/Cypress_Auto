import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { pushNotification } from '../app/app.actions';
import {
  addNewMapImage,
  addNewMapImageToMap,
  mapImageAddedSuccess,
  loadMapImages,
  mapImagesLoadedSuccess,
  removeMapImages,
  removeMapImagesSuccess,
  restoreMapImages, restoreMapImagesSuccess
} from './map-image.actions';
import { MapImageService } from 'src/app/core/services/map-image/map-image.service';
import { of } from 'rxjs';
import { SuccessMessages } from "../../shared/enums/success-messages.enum";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { reloadGroupBoxes } from '../map/map.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';

@Injectable()
export class MapImagesEffects {

  loadMapImages$ = createEffect(() => this.actions$.pipe(
    ofType(loadMapImages),
    exhaustMap((payload) => this.mapImageService.getMapImageByProjectId(Number(payload.projectId))
      .pipe(
        map(res => (mapImagesLoadedSuccess({ mapImages: res.result }))),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: ErrorMessages.LOAD_MAP_IMAGE_FAILED
          }
        })))
      ))
  )
  );
  addNewMapImage$ = createEffect(() => this.actions$.pipe(
    ofType(addNewMapImage),
    exhaustMap(payload => this.mapImageService.add(payload.mapImage)
      .pipe(
        mergeMap((res: any) => this.mapImageService.get(Number(res.id))),
        switchMap((res: any) => [
          mapImageAddedSuccess({ mapImage: res.result }),
          addNewMapImageToMap({ id: res.id }),
          reloadGroupBoxes(),
          pushNotification({
            notification: {
              type: 'success',
              message: SuccessMessages.ADDED_MAP_IMAGE_SUCCESS
            }
          })
        ]),
        catchError(e => of(pushNotification({
          notification: {
            type: 'error',
            message: ErrorMessages.ADD_MAP_IMAGE_FAILED
          }
        })))
    ))
  ));

  addNewMapImageToMap$ = createEffect(() => this.actions$.pipe(
    ofType(addNewMapImageToMap),
    tap(payload => this.helpersService.addMapImageToMap(payload.id))
  ), { dispatch: false })

  removeMapImages$ = createEffect(() => this.actions$.pipe(
    ofType(removeMapImages),
    exhaustMap(payload => of([]).pipe(
      switchMap(() => [
        removeMapImagesSuccess({ ids: payload.ids }),
        pushNotification({
          notification: {
            type: 'success',
            message: SuccessMessages.REMOVE_MAP_IMAGE_SUCCESS
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: ErrorMessages.REMOVE_MAP_IMAGE_FAILED
        }
      })))
    ))
  ))

  restoreMapImages$ = createEffect(() => this.actions$.pipe(
    ofType(restoreMapImages),
    exhaustMap(payload => of([]).pipe(
      switchMap(() => [
        restoreMapImagesSuccess({ ids: payload.ids }),
        pushNotification({
          notification: {
            type: 'success',
            message: SuccessMessages.RESTORE_MAP_IMAGE_SUCCESS
          }
        })
      ]),
      catchError(e => of(pushNotification({
        notification: {
          type: 'error',
          message: ErrorMessages.RESTORE_MAP_IMAGE_FAILED
        }
      })))
      )
    )
  ))

  constructor(
    private actions$: Actions,
    private mapImageService: MapImageService,
    private helpersService: HelpersService
  ) { }
}
