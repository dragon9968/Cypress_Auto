import { createReducer, on } from '@ngrx/store';
import { PortGroupState } from 'src/app/store/portgroup/portgroup.state';
import { PGsLoadedSuccess, retrievedPortGroups } from './portgroup.actions';

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
      const baseCyData = {
        pg_id: pg.id,
        elem_category: "port_group",
        id: `pg-${pg.id}`,
        layout: { name: "preset" },
        zIndex: 999,
        updated: pg.logical_map.position ? true : false,
        locked: pg.logical_map.locked
      }
      if (pg.category != 'management') {
        pgs.push({
          ...pg,
          pg_id: pg.id,
          id: `pg-${pg.id}`,
          data: { ...pg, ...baseCyData, ...pg.logical_map.map_style },
          position: pg.logical_map.position,
          groups: pg.groups,
          interfaces: pg.interfaces,
          locked: pg.logical_map.locked
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
  })
);
