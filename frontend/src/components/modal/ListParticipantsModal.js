import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

// import axios from "axios";
// import server from "../../utils/constants/server";

export default function ListParticipantsModal({
  show,
  onHide,
  setSelected,
  participants,
}) {
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className=" "
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3>All Participants</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <ListGroup className=" fw-medium text-zinc-950 max-h-96 w-auto overflow-y-scroll">
            {participants &&
              participants.map((participant, index) => (
                <ListGroup.Item
                  key={index}
                  className=" hover:bg-indigo-50 text-lg"
                >
                  {participant.name}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <h5>
            <span className=" text-muted fw-medium">Total: </span>
            <span className=" text-muted fw-bold">{participants.length}</span>
          </h5>
        </Modal.Footer>
      </Modal>
    </>
  );
}
