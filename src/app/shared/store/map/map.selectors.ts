import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { MapModel } from '../../models/map.model';

export const selectMapFeature = createFeatureSelector<MapModel>(ReducerKeys.MAP);
export const selectMapItems = createSelector(selectMapFeature, (state: MapModel) => state.mapItems);
export const selectMapProperties = createSelector(selectMapFeature, (state: MapModel) => state.mapProperties);
export const selectDefaultPreferences = createSelector(selectMapFeature, (state: MapModel) => state.defaultPreferences);
export const selectNodes = createSelector(selectMapFeature, (state: MapModel) => state.nodes);
export const selectInterfaces = createSelector(selectMapFeature, (state: MapModel) => state.interfaces);
export const selectGroupBoxes= createSelector(selectMapFeature, (state: MapModel) => state.groupBoxes);
export const selectMapBackgrounds = createSelector(selectMapFeature, (state: MapModel) => state.mapBackgrounds);
