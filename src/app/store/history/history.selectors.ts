import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { HistoryState } from "./history.state";

export const selectHistoriesFeature = createFeatureSelector<HistoryState>(ReducerKeys.HISTORIES);
export const selectHistories= createSelector(selectHistoriesFeature, (state: HistoryState) => state.histories);


