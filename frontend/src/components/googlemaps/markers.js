import React, { useState } from "react";

/**
 *
 * @param {Object} places : { place_id, proposer_name, address, restaurant_name, rating, place_id, total_votes, user_voted, position }
 */
export function getMarkers(places) {
  const markers = [];
  places.forEach((place) => {
    markers.push({
      place_id: place.place_id,
      restaurant_name: place.restaurant_name,
      address: place.address,
      rating: place.rating,
      position: place.position,
    });
  });
  return markers;
}

// export function markerSelection({ place }) {
//   const [selected, setSelected] = useState(null);

//   return selected;
// }
