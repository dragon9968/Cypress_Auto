import { createReducer, on } from '@ngrx/store';
import {
  mapImagesLoadedSuccess,
  retrievedImages,
  retrievedMapImages,
  selectAllMapImage,
  selectMapImage,
  unSelectAllMapImage,
  unSelectMapImage,
  clearLinkedMapImages,
  linkedMapImagesLoadedSuccess,
  mapImageAddedSuccess,
  removeMapImagesSuccess,
  restoreMapImagesSuccess
} from './map-image.actions';
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
  on(selectMapImage, (state, { id }) => {
    const mapImages = state.mapImages.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
      mapImages
    }
  }),
  on(unSelectMapImage, (state, { id }) => {
    const mapImages = state.mapImages.map(n => {
      if (n.data.id == id) return { ...n, isSelected: false };
      return n;
    })
    return {
      ...state,
      mapImages
    }
  }),
  on(selectAllMapImage, (state) => {
    const mapImages = state.mapImages.map(n => {
      return { ...n, isSelected: true };
    })
    return {
      ...state,
      mapImages
    }
  }),
  on(unSelectAllMapImage, (state) => {
    const mapImages = state.mapImages.map(n => {
      return { ...n, isSelected: false };
    })
    return {
      ...state,
      mapImages
    }
  }),
  on(mapImageAddedSuccess, (state, { mapImage }) => {
    const mapImageCY = addCyDataToMapImages(mapImage);
    const mapImages = state.mapImages.concat(mapImageCY)
    return {
      ...state,
      mapImages
    }
  }),
  on(linkedMapImagesLoadedSuccess, (state, { mapImages, mapLinkId, position }) => {
    const linkedMapImages = JSON.parse(JSON.stringify(mapImages)).map((mapImage: any) => {
      let mapImagesCY = addCyDataToMapImages(mapImage)
      mapImagesCY.data.parent_id = mapLinkId
      if (mapImagesCY.position) {
        mapImagesCY.position.x = position.x;
        mapImagesCY.position.y = position.y;
      }
      mapImagesCY.data.zIndex = 1000;
      return mapImagesCY
    });
    return {
      ...state,
      linkedMapImages
    }
  }),
  on(clearLinkedMapImages, (state) => {
    return { ...state, linkedMapImages: undefined }
  }),
  on(removeMapImagesSuccess, (state, { ids })  => {
    const mapImages = state.mapImages.map(mi => ids.includes(mi.id) ? { ...mi, isDeleted: true } : mi);
    return {
      ...state,
      mapImages
    }
  }),
  on(restoreMapImagesSuccess, (state, { ids }) => {
    const mapImages = state.mapImages.map(mi => ids.includes(mi.id) ? { ...mi, isDeleted: false } : mi);
    return {
      ...state,
      mapImages
    }
  })
);

