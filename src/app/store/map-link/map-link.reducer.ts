import { MapLinkState } from "./map-link.state";
import { createReducer, on } from "@ngrx/store";
import {
  selectMapLink,
  unSelectMapLink,
  mapLinkUpdatedSuccess,
  removeMapLink,
  mapLinkAddedSuccess,
  mapLinksLoadedSuccess, clearMapLinks,
} from "./map-link.actions";
import { environment } from "../../../environments/environment";

const initialState = {} as MapLinkState;

const addCYDataToMapLink = (mapLink: any, isLogicalMapLink: boolean) => {
  const mapData = isLogicalMapLink ? mapLink.logical_map : mapLink.physical_map;
  const baseCyData = {
    id: `project-link-${mapLink.id}`,
    map_link_id: mapLink.id,
    updated: false,
    new: false,
    deleted: false,
    zIndex: 999,
    elem_category: 'map_link',
    icon: environment.apiBaseUrl +  '/static/img/icons/default_icon.png',
    collapsed: Boolean(mapData.collapsed)
  }
  return {
    ...mapLink,
    project_id: mapLink.project ? mapLink.project.id : mapLink.project_id,
    data: { ...mapLink, ...baseCyData, ...mapData?.map_style },
    position: mapData?.position,
    locked: mapData?.locked
  }
}

export const mapLinkReducer = createReducer(
  initialState,
  on(mapLinksLoadedSuccess, (state, { mapLinks }) => {
    let mapLinksCY: any[] = [];
    mapLinks.map(mapLink => {
      mapLinksCY.push(addCYDataToMapLink(mapLink, true))
    })
    return {
      ...state,
      mapLinks: mapLinksCY
    }
  }),
  on(clearMapLinks, (state) => {
    return {
      ...state,
      mapLinks: []
    }
  }),
  on(selectMapLink, (state, { id }) => {
    const mapLinks = state.mapLinks.map(m => (m.data.id === id) ? { ...m, isSelected: true } : m)
    return {
      ...state,
      mapLinks
    }
  }),
  on(unSelectMapLink, (state, { id }) => {
    const mapLinks = state.mapLinks.map(m => (m.data.id === id) ? { ...m, isSelected: false } : m)
    return {
      ...state,
      mapLinks
    }
  }),
  on(mapLinkAddedSuccess, (state, { mapLink }) => {
    const mapLinks = JSON.parse(JSON.stringify(state.mapLinks))
    const mapLinkCYData = addCYDataToMapLink(mapLink, true)
    mapLinks.push(mapLinkCYData)
    return {
      ...state,
      mapLinks
    }
  }),
  on(removeMapLink, (state, { id }) => {
    const mapLinks = state.mapLinks.filter(n => n.id !== id)
    return {
      ...state,
      mapLinks
    }
  })
)

