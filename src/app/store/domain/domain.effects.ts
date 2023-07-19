import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { domainsLoadedSuccess, loadDomains } from './domain.actions';
import { DomainService } from 'src/app/core/services/domain/domain.service';

@Injectable()
export class DomainsEffects {

  loadDomains$ = createEffect(() => this.actions$.pipe(
    ofType(loadDomains),
    exhaustMap((data) => this.domainService.getDomainByProjectId(data.projectId)
      .pipe(
        map(res => (domainsLoadedSuccess({ domains: res.result }))),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private domainService: DomainService
  ) {}
}