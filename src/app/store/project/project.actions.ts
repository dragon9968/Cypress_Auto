import { createAction, props } from '@ngrx/store';

export const retrievedProjects = createAction(
    'retrievedProjects',
    props<{ data: any }>()
);

export const retrievedVMStatus = createAction(
  'retrievedVMStatus',
  props<{ vmStatus: boolean }>()
);
