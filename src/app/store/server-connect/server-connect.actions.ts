import { createAction, props } from "@ngrx/store";

export const retrievedServerConnect = createAction(
  'retrievedServerConnect',
  props<{data: any}>()
)

export const retrievedIsHypervisorConnect = createAction(
  'retrievedIsHypervisorConnect',
  props<{data: any}>()
)

export const retrievedIsDatasourceConnect = createAction(
  'retrievedIsDatasourceConnect',
  props<{data: any}>()
)

export const retrievedIsConfiguratorConnect = createAction(
  'retrievedIsConfiguratorConnect',
  props<{data: any}>()
)

