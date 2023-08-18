import { createAction, props } from "@ngrx/store";
import { TaskAddModel } from "../../core/models/task.model";

export const loadUserTasks = createAction(
  'loadUserTasks'
)

export const userTasksLoadedSuccess = createAction(
  'userTasksLoadedSuccess',
  props<{ userTasks: any }>()
)

export const addTask = createAction(
  'addTask',
  props<{ task: TaskAddModel }>()
)

export const rerunTasks = createAction(
  'rerunTasks',
  props<{ pks: number[] }>()
)

export const revokeTasks = createAction(
  'revokeTasks',
  props<{ pks: number[] }>()
)

export const postTasks = createAction(
  'postTasks',
  props<{ pks: number[] }>()
)

export const refreshTasks = createAction(
  'refreshTasks'
)

export const deleteTasks = createAction(
  'deleteTasks',
  props<{ pks: number[] }>()
)
