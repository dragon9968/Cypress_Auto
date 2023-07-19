import { GroupState } from "./group.state";
import { createReducer, on } from "@ngrx/store";
import { groupsLoadedSuccess, retrievedGroups } from "./group.actions";

const initialState = {} as GroupState;

export const groupReducer = createReducer(
  initialState,
  on(retrievedGroups, (state, { data }) => ({
    ...state,
    groups: data
  })),
  on(groupsLoadedSuccess, (state, { groups }) => {
    const logicalGroups: any[] = [];
    // const physicalGroups: any[] = [];
    groups.map((g: any) => {
      const baseCyData = {
        domain: g.domain.name,
        domain_id: g.domain_id,
        elem_category: "group",
        group_category: g.category,
        group_id: g.id,
        group_opacity: 0.2,
        id: `group-${g.id}`,
        name: g.name,
        label: "group_box",
        zIndex: 997
      }
      logicalGroups.push({ ...g, data: { ...baseCyData, ...g.logical_map.map_style } });
      // physicalGroups.push({ ...g, data: { ...baseCyData, ...g.physical_map.map_style } });
    });
    return {
      ...state,
      groups: logicalGroups,
      // physicalGroups
    }
  })
)
