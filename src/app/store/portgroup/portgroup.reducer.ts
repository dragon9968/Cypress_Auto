import { createReducer, on } from '@ngrx/store';
import { PortGroupState } from 'src/app/store/portgroup/portgroup.state';
import {
  PGsLoadedSuccess,
  pgUpdatedSuccess,
  bulkUpdatedPGSuccess,
  removePGsSuccess,
  restorePGsSuccess,
  retrievedPortGroups,
  selectAllPG,
  selectPG,
  unSelectPG,
  unselectAllPG,
  updateDomainInPG,
  clearLinkedMapPGs,
  linkedMapPGsLoadedSuccess,
  portGroupAddedSuccess,
  randomizeSubnetPortGroupsSuccess
} from './portgroup.actions';

const initialState = {} as PortGroupState;

const addCYDataToPG = (portGroup: any) => {
  const baseCyData = {
    pg_id: portGroup.id,
    elem_category: "port_group",
    id: `pg-${portGroup.id}`,
    layout: { name: "preset" },
    zIndex: 999,
    updated: false,
  }
  return {
    ...portGroup,
    data: { ...portGroup, ...baseCyData, ...portGroup.logical_map?.map_style },
    position: portGroup.logical_map?.position,
    groups: portGroup.groups,
    interfaces: portGroup.interfaces,
    locked: portGroup.logical_map?.locked
  }
}

export const portGroupReducer = createReducer(
  initialState,
  on(retrievedPortGroups, (state, { data }) => ({
    ...state,
    portgroups: data,
  })),
  on(PGsLoadedSuccess, (state, { portgroups }) => {
    const pgs: any[] = [];
    const managementPGs: any[] = [];
    portgroups.map((pg: any) => {
      if (pg.category != 'management') {
        const pgCY = addCYDataToPG(pg)
        pgs.push(pgCY);
      } else if (pg.category == 'management') {
        managementPGs.push(pg);
      }
    });
    return {
      ...state,
      isSelectedFlag: false,
      portgroups: pgs,
      managementPGs,
    }
  }),
  on(linkedMapPGsLoadedSuccess, (state, { portgroups, mapLinkId, position }) => {
    const linkedMapPortGroups: any[] = [];
    JSON.parse(JSON.stringify(portgroups)).map((pg: any) => {
      const baseCyData = {
        pg_id: pg.id,
        elem_category: "port_group",
        id: `pg-${pg.id}`,
        layout: { name: "preset" },
        zIndex: 999,
        updated: false,
        parent_id: mapLinkId,
      }
      if (pg.category != 'management') {
        if (pg.logical_map?.position) {
          pg.logical_map.position.x += position.x
          pg.logical_map.position.y += position.y
        }
        linkedMapPortGroups.push({
          ...pg,
          data: { ...pg, ...baseCyData, ...pg.logical_map?.map_style },
          position: pg.logical_map?.position,
          groups: pg.groups,
          interfaces: pg.interfaces,
          locked: pg.logical_map?.locked
        });
      }
    });
    return {
      ...state,
      linkedMapPortGroups
    }
  }),
  on(clearLinkedMapPGs, (state) => {
    return {
      ...state,
      linkedMapPortGroups: undefined
    }
  }),
  on(selectPG, (state, { id }) => {
    const portgroups = state.portgroups.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
      isSelectedFlag: true,
      portgroups
    }
  }),
  on(unSelectPG, (state, { id }) => {
    const portgroups = state.portgroups.map(n => {
      if (n.data.id == id) return { ...n, isSelected: false };
      return n;
    })
    return {
      ...state,
      isSelectedFlag: true,
      portgroups
    }
  }),
  on(removePGsSuccess, (state, { ids }) => {
    const portgroups = state.portgroups.map(pg => ids.includes(pg.id) ? { ...pg, isDeleted: true } : pg);
    return {
      ...state,
      isSelectedFlag: false,
      portgroups,
    };
  }),
  on(restorePGsSuccess, (state, { ids }) => {
    const portgroups = state.portgroups.map(pg => ids.includes(pg.id) ? { ...pg, isDeleted: false } : pg);
    return {
      ...state,
      isSelectedFlag: false,
      portgroups,
    };
  }),
  on(pgUpdatedSuccess, (state, { portgroup }) => {
    if (portgroup.category == 'management') {
      const managementPGs = state.managementPGs.map((pg: any) => (pg.id == portgroup.id) ? { ...pg, ...portgroup } : pg);
      return {
        ...state,
        isSelectedFlag: false,
        managementPGs
      };
    } else {
      const portgroups = state.portgroups.map((pg: any) => (pg.id == portgroup.id) ? { ...pg, ...portgroup } : pg);
      return {
        ...state,
        isSelectedFlag: false,
        portgroups
      };
    }
  }),
  on(updateDomainInPG, (state, { domain }) => {
    const portgroups = state.portgroups.map((pg: any) => {
      if (domain.id == pg.domain_id) {
        return {
          ...pg,
          domain
        };
      } else {
        return pg;
      }
    });
    return {
      ...state,
      isSelectedFlag: false,
      portgroups,
    };
  }),
  on(bulkUpdatedPGSuccess, (state, { portgroups }) => {
    const portgroupsData = state.portgroups.map((pg: any) => {
      const updatedPG = portgroups.find((n: any) => n.id == pg.id);
      return updatedPG ? { ...pg, ...updatedPG } : pg
    });
    return {
      ...state,
      isSelectedFlag: false,
      portgroups: portgroupsData,
    };
  }),
  on(selectAllPG, (state) => {
    const portgroups = state.portgroups.map(n => ({ ...n, isSelected: true }))
    return {
      ...state,
      isSelectedFlag: true,
      portgroups
    }
  }),
  on(portGroupAddedSuccess, (state, { portGroup }) => {
    const portGroupCY = addCYDataToPG(portGroup);
    const portgroups = state.portgroups.concat(portGroupCY)
    return {
      ...state,
      portgroups
    }
  }),
  on(unselectAllPG, (state) => {
    const portgroups = state.portgroups.map(n => ({ ...n, isSelected: false }))
    return {
      ...state,
      isSelectedFlag: true,
      portgroups
    }
  }),
  on(randomizeSubnetPortGroupsSuccess, (state, { portGroups }) => {
    const portgroups = state.portgroups.map((pg: any) => {
      const updatedPG = portGroups.find((i: any) => i.id == pg.id);
      return updatedPG ? {...pg, ...updatedPG} : pg
    });
    return {
      ...state,
      isSelectedFlag: false,
      portgroups
    }
  }) 
);
