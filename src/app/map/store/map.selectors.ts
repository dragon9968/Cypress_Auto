import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { MapDataModel } from '../models/map-data.model';

export const selectMap = createFeatureSelector<MapDataModel>(ReducerKeys.MAP);
export const selectMapCategory = createSelector(selectMap, (state: MapDataModel) => state.mapCategory);
export const selectCollectionId = createSelector(selectMap, (state: MapDataModel) => state.collectionId);
export const selectMapItems = createSelector(selectMap, (state: MapDataModel) => state.mapItems);
export const selectMapProperties = createSelector(selectMap, (state: MapDataModel) => state.mapProperties);
export const selectDefaultPreferences = createSelector(selectMap, (state: MapDataModel) => state.defaultPreferences);
export const selectNodes = createSelector(selectMap, (state: MapDataModel) => state.nodes);
export const selectInterfaces = createSelector(selectMap, (state: MapDataModel) => state.interfaces);
export const selectGroupBoxes= createSelector(selectMap, (state: MapDataModel) => state.groupBoxes);
export const selectMapBackgrounds = createSelector(selectMap, (state: MapDataModel) => state.mapBackgrounds);

