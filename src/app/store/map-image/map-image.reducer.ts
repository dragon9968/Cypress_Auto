import { createReducer, on } from '@ngrx/store';
import { mapImagesLoadedSuccess, retrievedImages, retrievedMapImages } from './map-image.actions';
import { MapImageState } from './map-image.state';

const initialState = {} as MapImageState;

const addCyDataToMapImages = (mapImage: any) => {
  const image = `/static/img/uploads/${mapImage.image.photo}` ? mapImage.image : ""
  const baseCyData = {
    id: `map_image-${mapImage.id}`,
    map_image_id: mapImage.id,
    updated: false,
    elem_category: "bg_image",
    groups: mapImage.groups,
    layout: {"name": "preset"},
    zIndex: 998,
    image: image,
    src: image,
    locked: mapImage.logical_map?.locked
  }
  return {
    ...mapImage,
    data: { ...baseCyData, ...mapImage.logical_map?.map_style },
    position: mapImage.logical_map?.position,
  }
}

export const mapImagesReducer = createReducer(
  initialState,
  on(retrievedMapImages, (state, { mapImage }) => ({
    ...state,
    mapImages: mapImage,
  })),
  on(retrievedImages, (state, { data }) => ({
    ...state,
    images: data,
  })),
  on(mapImagesLoadedSuccess, (state, { mapImages }) => {
    const mi = mapImages.map((mapImage: any) => addCyDataToMapImages(mapImage));
    return {
      ...state,
      mapImages: mi,
    }
  }),
);