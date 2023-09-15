import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, InfoWindow, Marker } from "@react-google-maps/api";
import { BsFillStarFill } from "react-icons/bs";

import { getMarkers } from "./markers";
/**
 *
 * @param {[Object]} places [{ place_id, restaurant_name, address, rating, position }, ...]
 * @param {Object} selected { place_id, restaurant_name, address, rating, position }
 */

export function Map({ places, selected }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const containerStyle = {
    width: "100%",
    height: "100%",
    // position: "absolute",
    // top: 0,
    // right: 0,
    // bottom: 0,
    // left: 0,
    // width: "850px",
    // height: "900px",
  };

  const [map, setMap] = useState(null);
  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Burnaby Lake
  const center = {
    lat: 49.242,
    lng: -122.9441,
  };

  // Markers
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    let m = getMarkers(places);
    setMarkers(m);
  }, [places]);

  useEffect(() => {
    if (!map) return;

    function getNewBounds() {
      if (selected) return; // Don't let fitBounds override existing zoom level

      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(({ position }) => bounds.extend(position));
      map.fitBounds(bounds);
      // console.log("zoom lvl: ", map.getZoom());

      if (markers.length === 1) {
        map.setZoom(12);
        map.setCenter(markers[0].position);
      } else if (map.getZoom() > 14) {
        map.setZoom(12);
      }
    }

    if (markers && markers.length > 0) {
      getNewBounds();
    } else {
      //   const bounds = new window.google.maps.LatLngBounds(center);
      //   map.fitBounds([]);
    }
  }, [markers, map, selected]);

  const [activeMarkerId, setActiveMarkerId] = useState(null);

  const handleActiveMarker = (markerId) => {
    if (markerId === activeMarkerId) {
      return;
    }
    setActiveMarkerId(markerId);
  };

  useEffect(() => {
    if (!map) return;
    console.log("MAPS SELECTION CALLED");
    if (selected) {
      handleActiveMarker(selected.place_id);
      map.setZoom(14);
      // map.setCenter(selected.position);
      map.panTo(selected.position);
    } else {
      if (activeMarkerId) setActiveMarkerId(null);
      map.setZoom(11);
      map.panTo(center);

      // map.setCenter(center);
    }
  }, [selected]);

  return isLoaded ? (
    <GoogleMap
      center={center}
      zoom={11}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={() => setActiveMarkerId(null)}
      mapContainerStyle={containerStyle}
    >
      {markers &&
        markers.length > 0 &&
        markers.map(({ place_id, restaurant_name, address, rating, position }, index) => (
          <Marker key={place_id} position={position} onClick={() => handleActiveMarker(place_id)}>
            {activeMarkerId === place_id ? (
              <InfoWindow onCloseClick={() => setActiveMarkerId(null)}>
                <div>
                  <p className="p-0 m-0 text-base fw-medium">{restaurant_name}</p>
                  <p className="p-0 m-0 text-sm fw-medium">{address}</p>
                  <p className="p-0 m-0 text-sm ">
                    <span className=" inline-flex align-items-center ">
                      <span className="fw-medium text-muted">Rating: </span>
                      <span className=" text-indigo-600 underline ml-1">{rating}</span>
                      <span className=" ml-0.5">
                        <BsFillStarFill color="orange" />
                      </span>
                    </span>
                  </p>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

/** FOR MANUAL TESTING */

// export function Map2() {
//   const containerStyle = {
//     // width: "100%",
//     // position: "absolute",
//     // top: 0,
//     // right: 0,
//     // bottom: 0,
//     // left: 0,

//     width: "850px",
//     height: "900px",
//   };

//   const [activeMarker, setActiveMarker] = useState(null);

//   const handleActiveMarker = (marker) => {
//     if (marker === activeMarker) {
//       return;
//     }
//     setActiveMarker(marker);
//   };

//   const handleOnLoad = (map) => {
//     const bounds = new window.google.maps.LatLngBounds();
//     testMarkers.forEach(({ position }) => bounds.extend(position));
//     map.fitBounds(bounds);
//   };

//   // Burnaby Lake
//   const center = {
//     lat: 49.242,
//     lng: -122.9441,
//   };

//   return (
//     <GoogleMap
//       center={center}
//       zoom={11}
//       onLoad={handleOnLoad}
//       onClick={() => setActiveMarker(null)}
//       mapContainerStyle={containerStyle}
//     >
//       {testMarkers.map(({ id, place_id, restaurant_name, address, rating, position }) => {
//         console.log("place_id", place_id);
//         return (
//           <Marker key={id} position={position} onClick={() => handleActiveMarker(id)}>
//             {activeMarker === id ? (
//               <InfoWindow onCloseClick={() => setActiveMarker(null)}>
//                 <div>
//                   <p className="p-0 m-0 text-base fw-medium">{restaurant_name}</p>
//                   <p className="p-0 m-0 text-sm fw-medium">{address}</p>
//                   <p className="p-0 m-0 text-sm ">
//                     <span className=" inline-flex align-items-center ">
//                       <span className="fw-medium text-muted">Rating: </span>
//                       <span className=" text-indigo-600 underline ml-1">{rating}</span>
//                       <span className=" ml-0.5">
//                         <BsFillStarFill color="orange" />
//                       </span>
//                     </span>
//                   </p>
//                 </div>
//               </InfoWindow>
//             ) : null}
//           </Marker>
//         );
//       })}
//     </GoogleMap>
//   );
// }

// const testMarkers = [
//   {
//     id: 1,
//     place_id: 1,
//     restaurant_name: "Chicago, Illinois",
//     position: { lat: 49.2276, lng: -123.0076 },
//     address: "123 Main St",
//     rating: 4.2,
//   },
//   {
//     id: 2,
//     place_id: 2,
//     restaurant_name: "Denver, Colorado",
//     position: { lat: 49.2291, lng: -123.0048 },
//     address: "45 Avenue St",
//     rating: 3.2,
//   },
//   {
//     id: 3,
//     place_id: 3,
//     restaurant_name: "Los Angeles, California",
//     position: { lat: 49.2781, lng: -122.9199 },
//     address: "15 Waterfront St",
//     rating: 4.7,
//   },
// ];

export default Map;
