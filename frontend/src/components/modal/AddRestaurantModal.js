import React from "react";
import Modal from "react-bootstrap/Modal";

import PlaceSearchModal from "./PlaceSearchModal";

export default function AddRestaurantModal({ show, onHide, data, setData }) {
  return (
    // <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className=" ">
    //   <Modal.Header closeButton></Modal.Header>
    //   <Modal.Body className=""></Modal.Body>
    //   {/* <Modal.Footer>
    //       <h5>
    //         <span className=" text-muted fw-medium">Total: </span>
    //       </h5>
    //     </Modal.Footer> */}
    //   <h5>Total suggested restaurants:</h5>
    //   <h5>Total suggested schedules:</h5>
    // </Modal>

    <PlaceSearchModal show={show} onHide={onHide} setSelected={setData} />
  );
}
