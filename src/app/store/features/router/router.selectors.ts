import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import { AppStoreFeatures } from '../../app-store-features.enum';

export const selectRouter = createFeatureSelector<
  fromRouter.RouterReducerState
>(AppStoreFeatures.ROUTER);

export const {
  selectCurrentRoute,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
} = fromRouter.getSelectors(selectRouter);
