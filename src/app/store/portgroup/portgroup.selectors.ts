import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { PortGroupState } from 'src/app/store/portgroup/portgroup.state';

export const selectPortGroupFeature = createFeatureSelector<PortGroupState>(ReducerKeys.PORTGROUP);
export const selectMapPortGroups = createSelector(selectPortGroupFeature, (state: PortGroupState) => state.portgroups?.filter(pg => !pg.isDeleted));
export const selectManagementPGs = createSelector(selectPortGroupFeature, (state: PortGroupState) => state.managementPGs?.filter(pg => !pg.isDeleted));
export const selectPortGroups = createSelector(selectMapPortGroups, selectManagementPGs, (selectMapPortGroups, selectManagementPGs) => selectMapPortGroups?.concat(selectManagementPGs));
export const selectSelectedPortGroups = createSelector(selectPortGroups, (selectPortGroups) => selectPortGroups?.filter(pg => pg.isSelected));
export const selectIsSelectedFlag = createSelector(selectPortGroupFeature, (state: PortGroupState) => state.isSelectedFlag);
export const selectLinkedMapPortGroups = createSelector(selectPortGroupFeature, (state: PortGroupState) => state.linkedMapPortGroups);
export const selectDeletedMapPortGroups = createSelector(selectPortGroupFeature, (state: PortGroupState) => state.portgroups?.filter(pg => pg.isDeleted));
export const selectDeletedManagementPGs = createSelector(selectPortGroupFeature, (state: PortGroupState) => state.managementPGs?.filter(pg => pg.isDeleted));
export const selectDeletedPortGroups = createSelector(selectDeletedMapPortGroups, selectDeletedManagementPGs, (selectDeletedMapPortGroups, selectDeletedManagementPGs) => selectDeletedMapPortGroups?.concat(selectDeletedManagementPGs));


