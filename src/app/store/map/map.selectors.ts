import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { MapState } from 'src/app/store/map/map.state';

export const selectMapFeature = createFeatureSelector<MapState>(ReducerKeys.MAP);
export const selectDefaultPreferences = createSelector(selectMapFeature, (state: MapState) => state.defaultPreferences);
// export const selectNodes = createSelector(selectMapFeature, (state: MapState) => state.nodes);
// export const selectPortgroups = createSelector(selectMapFeature, (state: MapState) => state.portgroups);
// export const selectInterfaces = createSelector(selectMapFeature, (state: MapState) => state.interfaces);
// export const selectGroups = createSelector(selectMapFeature, (state: MapState) => state.groups);
export const selectIsMapOpen = createSelector(selectMapFeature, (state: MapState) => state.isMapOpen);
export const selectIsFinishLoadedElements = createSelector(selectMapFeature, (state: MapState) => state.IsFinishLoadedElements);
