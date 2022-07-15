import { mapReducer } from "./map/store/map.reducer";
import { projectReducer } from "./project/store/project.reducer";
import { ReducerKeys } from "./shared/enums/reducer-keys.enum";

export const reducers = {
    [ReducerKeys.MAP]: mapReducer,
    [ReducerKeys.PROJECT]: projectReducer
}