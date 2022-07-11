import { mapReducer } from "./map/editor/store/map-editor.reducer";
import { projectReducer } from "./project/store/project.reducer";

export const reducers = {
    map: mapReducer,
    project: projectReducer
}