import { mapReducer } from "./components/map/store/map.reducer";
import { projectReducer } from "./components/project/store/project.reducer";

export const reducers = {
    map: mapReducer,
    project: projectReducer
}