import React, { useContext, useEffect } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import GlobalStoreContext from '../store';
import L from 'leaflet';
import {
  AddRegion_Transaction,
  DeleteRegion_Transaction,
  AddVertex_Transaction,
  DeleteVertex_Transaction,
} from '../transactions';
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
const mapData = require('../test/MapEditingInfo.json');
const usData = require('../test/us.json');

export default function MapLayer({
  onEachFeature,
  setVertexEnabled,
  setTempSelectedVert,
  georef,
  setScreenshot,
  setMapref,
}) {
  const countryStyle = {
    fillColor: 'yellow',
    color: 'black',
    weight: 1,
    height: '100%',
  };

  const { store } = useContext(GlobalStoreContext);
  const map = useMap();
  store.mapObject = map;
  map.doubleClickZoom.disable();
  useEffect(()=>{
    setScreenshot(L.simpleMapScreenshoter().addTo(map));
    setMapref(map);
  },[]);
  map.on('pm:create', (e) => {
    const { layer } = e;
    e.layer.options.pmIgnore = false;
    const trans = store.tps.transactions[store.tps.mostRecentTransaction];
    if (trans instanceof AddRegion_Transaction) {
      // HANDLE DUPLICATES
      if (trans.layer !== layer) {
        layer.feature = {
          type: 'Feature',
          properties: {},
        };
        layer.feature.properties.AtlasCraftRegionID = Math.random();
        store.addAddRegionTransaction(layer);
      }
    } else {
      layer.feature = {
        type: 'Feature',
        properties: {},
      };
      layer.feature.properties.AtlasCraftRegionID = Math.random();
      store.addAddRegionTransaction(layer);
    }
  });

  map.on('pm:remove', (e) => {
    const { layer } = e;
    e.layer.options.pmIgnore = false;
    const trans = store.tps.transactions[store.tps.mostRecentTransaction];
    if (trans instanceof DeleteRegion_Transaction) {
      // HANDLE DUPLICATES
      if (trans.layer !== layer) {
        store.addDeleteRegionTransaction(layer);
      }
    } else {
      store.addDeleteRegionTransaction(layer);
    }
  });

  map.pm.setGlobalOptions({
    limitMarkersToCount: 10,
    pathOptions: countryStyle,
  });

  map.pm.addControls({
    position: 'topleft',
    drawCircle: false,
    drawMarker: false,
    drawCircleMarker: false,
    drawPolyline: false,
    drawRectangle: false,
    drawPolygon: false,
  });

  function findGeoIndex(props) {
    for (let i = 0; i < store.geojson.features.length; i++) {
      if (
        store.geojson.features[i].properties.AtlasCraftRegionID ==
        props.AtlasCraftRegionID
      ) {
        return i;
      }
    }
    return -1;
  }

  map.on('layeradd', (e) => {
    if (e.layer && e.layer._latlngs) {
      // console.log(e);
      const { layer } = e;
      // console.log(layer);
      layer.on('pm:edit', (e) => {
        const { layer } = e;
        layer.on('pm:vertexadded', (e) => {
          const { indexPath, latlng, marker } = e;
          marker.pm.enable({ draggable: true });
          const trans = store.tps.transactions[store.tps.mostRecentTransaction];
          if (trans instanceof AddVertex_Transaction) {
            // HANDLE DUPLICATES
            if (trans.latlng !== latlng) {
              store.addAddVertexTransaction(indexPath, latlng, layer);
            }
          } else {
            store.addAddVertexTransaction(indexPath, latlng, layer);
          }

          marker.on('pm:dragend', (e) => {
            console.log('pm:dragend');
            console.log(e);
          });
        });
        layer.on('pm:change', (e) => {
          // console.log(e);
        });

        layer.on('pm:vertexremoved', (e) => {
          const { indexPath, marker } = e;
          const trans = store.tps.transactions[store.tps.mostRecentTransaction];
          if (trans instanceof DeleteVertex_Transaction) {
            // HANDLE DUPLICATES
            if (trans.latlng !== marker._latlng) {
              store.addDeleteVertexTransaction(
                indexPath,
                marker._latlng,
                layer
              );
              console.log('Delete Vertex');
              console.log(e);
              console.log(e.marker._latlng);
            }
          } else {
            store.addDeleteVertexTransaction(indexPath, marker._latlng, layer);
            console.log('Delete Vertex');
            console.log(e);
            console.log(e.marker._latlng);
          }
        });
        //TODO add split feature to new layer
        // layer.on('pm:vertexclick', (e) => {
        //   console.log(e.indexPath);
        //   if(e.indexPath){//if it is a proper vertex click event
        //     // console.log(e.layer.feature.geometry.coordinates)
        //     let featuresIndex = findGeoIndex(e.layer.feature.properties);
        //     e.indexPath.unshift(featuresIndex);
        //     //NOTE: some may be 4 elements and others may be 3, account for this later using loop
        //     //The First element will always be the features index

        //     setTempSelectedVert(e.indexPath);

        //   }
        // });
      });

      //SELECT REGION
      layer.on('dblclick', (e) => {
        const layer = e.target;
        console.log('Layer Clicked');
        if (layer) {
          if (store.selectedRegion.includes(layer)) {
            store.selectedRegion = store.selectedRegion.filter(
              (l) => l !== layer
            );
            layer.setStyle({ fillColor: 'yellow' });
          }
          console.log(store.selectedRegion);
        }
      });

      // DELTE
      layer.on('contextmenu', (e) => {
        const layer = e.target;
        console.log('Context Menu Clicked');
        if (layer) {
          if (!store.selectedRegion.includes(layer)) {
            if (store.editSelection === 'properties') {
              store.selectedRegion.forEach((region) => {
                region.setStyle({ fillColor: 'yellow' });
              });
              store.selectedRegion = [];
            }
            store.selectedRegion.push(layer);
            layer.setStyle({ fillColor: 'orange' });
          }
        }
      });
    }
  });

  map.on('layerremove', (e) => {
    if (e.layer && e.layer._latlngs) {
      // console.log(e);
      map.pm.disableDraw();
    }
  });
  console.log('Store Geojson');
  console.log(store.geojson);

  return (
    <GeoJSON
      data={store.geojson || usData || mapData.geojson}
      style={countryStyle}
      onEachFeature={onEachFeature}
      key={store.mapKey}
      ref={georef}
    />
  );
}
