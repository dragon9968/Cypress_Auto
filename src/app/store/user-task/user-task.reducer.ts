import { createReducer, on } from "@ngrx/store";
import { UserTaskState } from "./user-task.state";
import { retrievedUserTasks } from "./user-task.actions";

const initialState = {} as UserTaskState;

export const userTaskReducer = createReducer(
  initialState,
  on(retrievedUserTasks, (state, {data}) => ({
    ...state,
    userTasks: data
  }))
)
