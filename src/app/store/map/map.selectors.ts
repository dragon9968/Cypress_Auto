import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { MapState } from 'src/app/store/map/map.state';

export const selectMapFeature = createFeatureSelector<MapState>(ReducerKeys.MAP);
export const selectMapItems = createSelector(selectMapFeature, (state: MapState) => state.mapItems);
export const selectMapProperties = createSelector(selectMapFeature, (state: MapState) => state.mapProperties);
export const selectDefaultPreferences = createSelector(selectMapFeature, (state: MapState) => state.defaultPreferences);
export const selectNodes = createSelector(selectMapFeature, (state: MapState) => state.nodes);
export const selectInterfaces = createSelector(selectMapFeature, (state: MapState) => state.interfaces);
export const selectGroupBoxes= createSelector(selectMapFeature, (state: MapState) => state.groupBoxes);
export const selectMapBackgrounds = createSelector(selectMapFeature, (state: MapState) => state.mapBackgrounds);
