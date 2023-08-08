import { GroupState } from "./group.state";
import { createReducer, on } from "@ngrx/store";
import {
  removeNodesInGroup,
  groupAddedSuccess,
  groupUpdatedSuccess,
  groupsLoadedSuccess,
  retrievedGroups,
  selectGroup,
  unSelectGroup,
  updateNodeInGroup,
  restoreNodesInGroup,
  removePGsInGroup,
  restorePGsInGroup,
  selectAllGroup,
  unSelectAllGroup,
  groupDeletedSuccess,
  groupsDeletedSuccess,
  updatePGInGroup
} from "./group.actions";

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
  on(selectAllGroup, (state) => {
    const groups = state.groups.map(n => {
      return { ...n, isSelected: true };
    })
    return {
      ...state,
      groups
    }
  }),
  on(unSelectAllGroup, (state) => {
    const groups = state.groups.map(n => {
      return { ...n, isSelected: false };
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
  on(updateNodeInGroup, (state, { node }) => {
    const groups = state.groups.map((g: any) => {
      if (g.id == node.groups[0]?.id) {
        return {
          ...g,
          nodes: [...g.nodes, node]
        }
      } else {
        return g
      }
    });
    return {
      ...state,
      groups,
    };
  }),
  on(updatePGInGroup, (state, { portGroup }) => {
    const groups = state.groups.map((g: any) => {
      if (g.id == portGroup.groups[0].id) {
        return {
          ...g,
          port_groups: [...g.port_groups, portGroup]
        }
      } else {
        return g
      }
    })
    return {
      ...state,
      groups
    }
  }),
  on(groupAddedSuccess, (state, { group }) => {
    const groups = [...state.groups, addCyDataToGroup(group)];
    return {
      ...state,
      groups,
    };
  }),
  on(groupDeletedSuccess, (state, { id }) => {
    const groups = state.groups.filter(g => g.id !== id);
    return {
      ...state,
      groups,
    };
  }),
  on(groupsDeletedSuccess, (state, { ids }) => {
    const groups = state.groups.filter(g => !ids.includes(g.id));
    return {
      ...state,
      groups,
    };
  }),
  on(removeNodesInGroup, (state, { ids }) => {
    const groups = state.groups.map((g: any) => {
      return {
        ...g,
        nodes: g.nodes.map((n: any) => ids.includes(n.id) ? { ...n, isDeleted: true } : n)
      }
    });
    return {
      ...state,
      groups,
    };
  }),
  on(restoreNodesInGroup, (state, { ids }) => {
    const groups = state.groups.map((g: any) => {
      return {
        ...g,
        nodes: g.nodes.map((n: any) => ids.includes(n.id) ? { ...n, isDeleted: false } : n)
      }
    });
    return {
      ...state,
      groups,
    };
  }),
  on(removePGsInGroup, (state, { ids }) => {
    const groups = state.groups.map((g: any) => {
      return {
        ...g,
        port_groups: g.port_groups.map((pg: any) => ids.includes(pg.id) ? { ...pg, isDeleted: true } : pg)
      }
    });
    return {
      ...state,
      groups,
    };
  }),
  on(restorePGsInGroup, (state, { ids }) => {
    const groups = state.groups.map((g: any) => {
      return {
        ...g,
        port_groups: g.port_groups.map((pg: any) => ids.includes(pg.id) ? { ...pg, isDeleted: false } : pg)
      }
    });
    return {
      ...state,
      groups,
    };
  }),
)
