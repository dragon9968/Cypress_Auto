import { GroupState } from "./group.state";
import { createReducer, on } from "@ngrx/store";
import { groupsLoadedSuccess, retrievedGroups, selectGroup, unSelectGroup } from "./group.actions";

const initialState = {} as GroupState;

export const groupReducer = createReducer(
  initialState,
  on(retrievedGroups, (state, { data }) => ({
    ...state,
    groups: data
  })),
  on(groupsLoadedSuccess, (state, { groups }) => {
    const g: any[] = [];
    groups.map((group: any) => {
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
      g.push({
        ...group,
        group_id: group.id,
        id: baseCyData.id,
        data: { ...baseCyData, ...group.logical_map?.map_style } 
      });
    });
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
)
