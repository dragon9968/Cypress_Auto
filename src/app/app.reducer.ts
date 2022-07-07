import { mapReducer } from "./map/store/map.reducer";
import { projectReducer } from "./project/store/project.reducer";

export const reducers = {
    map: mapReducer,
    project: projectReducer
}