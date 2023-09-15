import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";

import axios from "axios";
import server from "../../utils/constants/server";
import PlacesSearchBar from "../searchbar/placeSearchBar";

export default function PlaceSearchModal({ show, onHide, addedPlaces, setAddedPlaces, data, setData }) {
  const [placeId, setPlaceId] = useState("");
  const [selected, setSelected] = useState({});

  const reset = () => {
    setPlaceId("");
    setSelected({});
  };

  const handleAdd = async () => {
    try {
      let response = await axios.get(server.url + "/googleMaps/details/" + placeId);
      console.log("restaurant info: " + JSON.stringify(response.data));
      const info = response.data;
      // let restaurantInfo = { placeId: placeId, restaurant_name: response.data.name, ...response.data };
      let restaurantInfo = {
        place_id: placeId,
        restaurant_name: info.name,
        address: info.vicinity,
        rating: info.rating,
        position: info.geometry.location,
      };

      setData(restaurantInfo);
      onHide();
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          onHide();
          reset();
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3>Select a place to add it</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mb-5">
          {selected ? (
            <div className="mb-4">
              <h5 className=" text-gray-400">
                Selected: <span className="text-gray-500">{selected.description}</span>
              </h5>
            </div>
          ) : null}
          <PlacesSearchBar setPlace={setPlaceId} setSelected={setSelected} />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="text-white bg-gradient-to-r  from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-800 hover:via-indigo-700 hover:to-indigo-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-md"
            onClick={handleAdd}
          >
            Add
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
