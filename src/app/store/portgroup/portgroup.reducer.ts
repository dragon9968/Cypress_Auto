import { createReducer, on } from '@ngrx/store';
import { PortGroupState } from 'src/app/store/portgroup/portgroup.state';
import { PGsLoadedSuccess, removePG, retrievedPortGroups, selectPG, unSelectPG } from './portgroup.actions';

const initialState = {} as PortGroupState;

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
        const baseCyData = {
          pg_id: pg.id,
          elem_category: "port_group",
          id: `pg-${pg.id}`,
          layout: { name: "preset" },
          zIndex: 999,
          updated: false,
        }
        pgs.push({
          ...pg,
          pg_id: pg.id,
          id: `pg-${pg.id}`,
          data: { ...pg, ...baseCyData, ...pg.logical_map?.map_style },
          position: pg.logical_map?.position,
          groups: pg.groups,
          interfaces: pg.interfaces,
          locked: pg.logical_map?.locked
        });
      } else if (pg.category == 'management') {
        managementPGs.push(pg);
      }
    });
    return {
      ...state,
      portgroups: pgs,
      managementPGs,
    }
  }),
  on(selectPG, (state, { id }) => {
    const portgroups = state.portgroups.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
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
      portgroups
    }
  }),
  on(removePG, (state, { id }) => {
    const portgroups = state.portgroups.filter(ele => ele.pg_id !== id);
    return {
      ...state,
      portgroups
    }
  }),
);
