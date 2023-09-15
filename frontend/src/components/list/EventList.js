import React, { useState } from "react";
// import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
// import CloseButton from "react-bootstrap/CloseButton";

// import EventModal from "../modal/EventModal";
import { useNavigate } from "react-router-dom";

/**
 *
 * @param {*} events: [{ firstname, lastname, event_id, event_name, event_description, host_id, duration, total_participants }, ...]
 * @param {*} isOwnHost: True if user created the event, False otherwise
 * @returns
 */
export default function EventList({ events, isOwnHost }) {
  console.log("EventList props: ", events, isOwnHost);
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleEventClick = (item) => {
    console.log("clicked on event: " + item.event_name);
    // setShowModal(true);

    // Changed /events/ to /event/ to match backend - Ryan July 27, 2023
    navigate("/event/" + item.event_id);
  };

  return (
    <div>
      <ListGroup className="overflow-auto" style={{ maxHeight: "520px" }}>
        <ListGroup.Item>
          <Container>
            <Row className="">
              <Col className="fw-bold">Event Title</Col>
              {isOwnHost ? <Col className="fw-bold">Host</Col> : null}
              {/* <Col className="fw-bold">Time Period</Col> */}
              <Col className="fw-bold">Total Participants</Col>
              {/* <Col className="fw-bold text-center">Status</Col> */}
            </Row>
          </Container>
        </ListGroup.Item>
        <div className="h-50 scroll-auto bg-blue">
          {events &&
            events.map((event, index) => {
              return (
                <ListGroup.Item key={index} action onClick={() => handleEventClick(event)}>
                  <Container>
                    <Row>
                      <Col>{event.event_name}</Col>
                      {isOwnHost ? <Col>{event.firstname + " " + event.lastname}</Col> : null}
                      {/* <Col>{event.timeframe}</Col> */}
                      <Col>{event.total_participants}</Col>
                      {/* <Col>{}</Col> */}
                    </Row>
                  </Container>
                </ListGroup.Item>
              );
            })}
        </div>
      </ListGroup>

      {/* <EventModal show={showModal} onHide={() => setShowModal(false)} /> */}
    </div>
  );
}

// const testData = [
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
//   { event_name: "aaaa", total_participants: 4, firstname: "John", lastname: "Leo" },
// ];
