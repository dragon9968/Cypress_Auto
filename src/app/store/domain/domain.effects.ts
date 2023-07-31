import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { domainUpdatedSuccess, domainsLoadedSuccess, loadDomains, updateDomain } from './domain.actions';
import { DomainService } from 'src/app/core/services/domain/domain.service';
import { pushNotification } from '../app/app.actions';
import { updateDomainInNode } from '../node/node.actions';
import { updateDomainInPG } from '../portgroup/portgroup.actions';

@Injectable()
export class DomainsEffects {

  loadDomains$ = createEffect(() => this.actions$.pipe(
    ofType(loadDomains),
    exhaustMap((data) => this.domainService.getDomainByProjectId(data.projectId)
      .pipe(
        map(res => (domainsLoadedSuccess({ domains: res.result }))),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Load domains failed!'
          }
        })))
      ))
    )
  );

  updateDomain$ = createEffect(() => this.actions$.pipe(
    ofType(updateDomain),
    exhaustMap((payload) => this.domainService.put(payload.id, payload.data)
      .pipe(
        mergeMap(res => this.domainService.get(payload.id)),
        switchMap((res: any) => [
          domainUpdatedSuccess({ domain: res.result }),
          updateDomainInNode({ domain: res.result }),
          updateDomainInPG({ domain: res.result }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Domain details updated!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Update domain failed!'
          }
        })))
      )),
  ));

  constructor(
    private actions$: Actions,
    private domainService: DomainService
  ) {}
}