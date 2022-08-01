import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { PortGroupModel } from '../../models/portgroup.model';

export const selectPortGroupFeature = createFeatureSelector<PortGroupModel>(ReducerKeys.PORTGROUP);
export const selectPortGroups = createSelector(selectPortGroupFeature, (state: PortGroupModel) => state.portgroups);

