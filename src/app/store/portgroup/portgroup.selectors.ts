import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { PortGroupState } from 'src/app/store/portgroup/portgroup.state';

export const selectPortGroupFeature = createFeatureSelector<PortGroupState>(ReducerKeys.PORTGROUP);
export const selectPortGroups = createSelector(selectPortGroupFeature, (state: PortGroupState) => state.portgroups);

