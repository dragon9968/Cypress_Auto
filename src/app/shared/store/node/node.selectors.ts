import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { NodeModel } from '../../models/node.model';

export const selectNodeFeature = createFeatureSelector<NodeModel>(ReducerKeys.NODE);
export const selectNodeAdd = createSelector(selectNodeFeature, (state: NodeModel) => state.nodeAdd);

