import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { NetmaskState } from './netmask.state';

export const selectNetmaskFeature = createFeatureSelector<NetmaskState>(ReducerKeys.NETMASKS);
export const selectNetmasks= createSelector(selectNetmaskFeature, (state: NetmaskState) => state.netmasks);


