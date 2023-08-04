import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { addDomain, deleteDomains, domainAddedSuccess, domainUpdatedSuccess, domainsDeletedSuccess, domainsLoadedSuccess, loadDomains, updateDomain } from './domain.actions';
import { DomainService } from 'src/app/core/services/domain/domain.service';
import { pushNotification } from '../app/app.actions';
import { updateDomainInNode } from '../node/node.actions';
import { updateDomainInPG } from '../portgroup/portgroup.actions';
import { loadGroups } from '../group/group.actions';

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

  addDomain$ = createEffect(() => this.actions$.pipe(
    ofType(addDomain),
    exhaustMap((payload) => this.domainService.add(payload.data)
      .pipe(
        mergeMap(res => this.domainService.get(res.id)),
        switchMap((res: any) => [
          domainAddedSuccess({ domain: res.result }),
          loadGroups({ projectId: res.result.project_id }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Domain details added!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Add domain failed!'
          }
        })))
      )),
  ));

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

  deleteDomains$ = createEffect(() => this.actions$.pipe(
    ofType(deleteDomains),
    exhaustMap((payload) => forkJoin(payload.ids.map(id => this.domainService.delete(id)))
      .pipe(
        switchMap((res: any) => [
          domainsDeletedSuccess({ ids: payload.ids }),
          loadGroups({ projectId: payload.projectId }),
          pushNotification({
            notification: {
              type: 'success',
              message: 'Domains deleted!'
            }
          })
        ]),
        catchError((e) => of(pushNotification({
          notification: {
            type: 'error',
            message: 'Delete domains failed!'
          }
        })))
      )),
  ));

  constructor(
    private actions$: Actions,
    private domainService: DomainService
  ) {}
}