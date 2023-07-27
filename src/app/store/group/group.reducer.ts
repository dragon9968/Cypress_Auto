import { GroupState } from "./group.state";
import { createReducer, on } from "@ngrx/store";
import { groupUpdatedSuccess, groupsLoadedSuccess, retrievedGroups, selectGroup, unSelectGroup } from "./group.actions";

const initialState = {} as GroupState;

const addCyDataToGroup = (group: any) => {
  const baseCyData = {
    domain: group.domain?.name,
    domain_id: group.domain_id,
    elem_category: "group",
    group_category: group.category,
    group_id: group.id,
    group_opacity: 0.2,
    id: `group-${group.id}`,
    name: group.name,
    label: "group_box",
    zIndex: 997,
    updated: false
  }
  return {
    ...group,
    data: { ...baseCyData, ...group.logical_map?.map_style }
  }
}

export const groupReducer = createReducer(
  initialState,
  on(retrievedGroups, (state, { data }) => ({
    ...state,
    groups: data
  })),
  on(groupsLoadedSuccess, (state, { groups }) => {
    const g = groups.map((group: any) => addCyDataToGroup(group));
    return {
      ...state,
      groups: g,
    }
  }),
  on(selectGroup, (state, { id }) => {
    const groups = state.groups.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
      groups
    }
  }),
  on(unSelectGroup, (state, { id }) => {
    const groups = state.groups.map(n => {
      if (n.data.id == id) return { ...n, isSelected: false };
      return n;
    })
    return {
      ...state,
      groups
    }
  }),
  on(groupUpdatedSuccess, (state, { group }) => {
    const groups = state.groups.map((g: any) => (g.id == group.id) ? {
      ...g,
      ...group,
      data: {
        ...g.data,
        name: group.name,
        category: group.category,
        description: group.description,
        nodes: group.nodes,
        port_groups: group.port_groups,
      }
    } : g);
    return {
      ...state,
      groups,
    };
  }),
)
