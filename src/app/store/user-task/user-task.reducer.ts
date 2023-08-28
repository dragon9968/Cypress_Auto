import { createReducer, on } from "@ngrx/store";
import { UserTaskState } from "./user-task.state";
import { userTasksLoadedSuccess } from "./user-task.actions";

const initialState = {} as UserTaskState;

export const userTaskReducer = createReducer(
  initialState,
  on(userTasksLoadedSuccess, (state, { userTasks }) => {
    return {
      ...state,
      userTasks
    }
  })
)
