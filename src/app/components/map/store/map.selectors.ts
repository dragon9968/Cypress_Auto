import { createFeatureSelector } from '@ngrx/store';
import { MapDataModel } from '../models/map-data.model';
 
export const selectMap = createFeatureSelector<MapDataModel>('map');