import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/Row";
// import Stack from "react-bootstrap/esm/Stack";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/esm/Container";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import server from "../../src/utils/constants/server";
import EventList from "../components/list/EventList";

import { UserAuth } from "../contexts/AuthContext";
import EventsList from "../components/EventsList";

const DEFAULT_TAB_SELECTION = "invitedEvents";

function Home({ }) {
  const navigate = useNavigate();
  const [tabSelect, setTabSelect] = useState(DEFAULT_TAB_SELECTION);

  const [name, setName] = useState("");
  const [invitedEvents, setInvitedEvents] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);

  // Debug - Ryan July 26, 2023
  // API call works, but it appears that state is not being updated when you switch tabs
  // const [events, setEvents] = useState([]);

  const { user, logout } = UserAuth();

  useEffect(() => {
    async function retrieveName() {
      try {
        console.log("user uid: " + user.uid);
        let uid = user.uid;
        let response = await axios.get(server.url + `/users/name/${uid}`);
        let data = response.data;
        setName(data ? data.firstname + " " + data.lastname : "");
      } catch (err) {
        console.log(err);
      }
    }

    if (!user) {
      navigate("/");
    }

    if (user) {
      retrieveName();
    }
  }, [user]);


  // Get by user id
  // router.get("/api/events/user/:uid", eventsController.getEventsByUserID);
  useEffect(() => {
    async function retrieveEvents(type) {
      try {
        let uid = user.uid;
        const retrieveEvent_url = server.url + `/events/list/${type}/${uid}`;
        // let response = await axios.get(server.url + `/events/list/${type}/${uid}`);
        console.log("retrieveEvents: ", retrieveEvent_url); // add this line
        let response = await axios.get(retrieveEvent_url);
        console.log("Retrieved events: ", response.data); // and this line

        // Debug, explicitly set events by type - Ryan July 26, 2023
        // setEvents(response.data);
        if (type === 'invited') {
          setInvitedEvents(response.data);
        } else {
          setHostedEvents(response.data);
        }

      } catch (err) {
        console.log(err);
      }
    }

    if (user) {
      let listType = tabSelect === "invitedEvents" ? "invited" : "hosted";
      retrieveEvents(listType);
    }
  }, [user, tabSelect]);

  const handleCreateEvent = () => {
    navigate("/eventform");
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  console.log("invitedEvents state in Home: ", invitedEvents);
  console.log("hostedEvents state in Home: ", hostedEvents);

  return (
    <>
      <div className="w-100 bg-gradient-to-tl from-indigo-600 via-indigo-800 to-indigo-600 text-white shadow-lg">
        <h1 className="display-3 text-center p-3">Restaurant Planner</h1>
      </div>

      <Container className="d-flex justify-content-end">
        <Row className="mt-1">
          <Button type="button" className="btn btn-danger" onClick={handleSignOut}>
            Log Out
          </Button>
        </Row>
      </Container>

      <div className="d-flex justify-content-center">
        <Row className="mt-5">
          <h2>Welcome, {name}!</h2>
        </Row>
      </div>

      <Container className="d-flex justify-content-center">
        <Row className="mt-5 w-auto h-16">
          <button
            type="button"
            className=" btn-lg text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 font-medium rounded-lg text-lg px-5 py-2.5 text-center mr-2 mb-2"
            onClick={handleCreateEvent}
          >
            Host an Event
          </button>
        </Row>
      </Container>

      <div className="container mt-5 mb-20 ">
        <h3 className="mt-5 mb-5">My Events</h3>
        <Tabs
          defaultActiveKey="invitedEvents"
          id="justify-tab-example"
          className="mb-3"
          justify
          onSelect={(e) => setTabSelect(e)}
        >
          <Tab eventKey="invitedEvents" title="Invited Events">
            <EventList isOwnHost={true} events={invitedEvents} />
          </Tab>
          <Tab eventKey="personalEvents" title="Your Hosted Events">
            <EventList isOwnHost={false} events={hostedEvents} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default Home;
