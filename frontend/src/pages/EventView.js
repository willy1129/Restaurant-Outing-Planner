import React, { useState, useEffect, useReducer } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";

import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { LuVote } from "react-icons/lu";
import { BsPersonFillAdd } from "react-icons/bs";
import toast, { Toaster, ToastBar } from "react-hot-toast";

import PlaceCard from "../components/card/PlaceCard";
import TimeCard from "../components/card/TimeCard";
import AddCard from "../components/card/AddCard";
import ListParticipantsModal from "../components/modal/ListParticipantsModal";

import axios from "axios";
import server from "../utils/constants/server";
import { INITIAL_STATE, eventReducer } from "../store/Reducers/eventReducer";
import { EVENT_ACTIONS_TYPES } from "../store/Actions/eventActions";
import { UserAuth } from "../contexts/AuthContext";

// Modals
import PlaceSearchModal from "../components/modal/PlaceSearchModal";
import AddScheduleModal from "../components/modal/AddScheduleModal";
import InviteUsersModal from "../components/modal/InviteUsersModal";

import Map from "../components/googlemaps/Map";

export default function EventView() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const { user } = UserAuth();

  const [state, dispatch] = useReducer(eventReducer, INITIAL_STATE);

  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const handleListParticipantModalClose = () => {
    setShowParticipantModal(false);
  };
  const handleAddParticipant = (newUser) => {
    dispatch({ type: EVENT_ACTIONS_TYPES.ADD_PARTICIPANT, payload: { participant: newUser } });
  };

  const [eventHasUpdated, setEventHasUpdated] = useState(false);

  // Vote information
  const [highestPlaceVote, setHighestPlaceVote] = useState(0);
  const [highestTimeVote, setHighestTimeVote] = useState(0);
  useEffect(() => {
    if (state.places.length > 0) {
      setHighestPlaceVote(findHighestVote(state.places));
    } else {
      setHighestPlaceVote(0);
    }
  }, [state.places]);

  useEffect(() => {
    if (state.schedules.length > 0) {
      setHighestTimeVote(findHighestVote(state.schedules));
    } else {
      setHighestPlaceVote(0);
    }
  }, [state.schedules]);

  // Event Information
  useEffect(() => {
    const retrieveEventInfo = async () => {
      try {
        dispatch({ type: EVENT_ACTIONS_TYPES.GET_START });
        const response = await axios.get(server.url + `/events/${eventId}/${user.uid}/full-info`);
        let data = response.data;
        dispatch({ type: EVENT_ACTIONS_TYPES.GET_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: EVENT_ACTIONS_TYPES.GET_ERROR });
        console.error(err);
      }
    };

    if (user !== undefined) {
      retrieveEventInfo();
    }
  }, [eventId, user]);

  const findHighestVote = (objList) => {
    let max = 0;
    max = objList.length > 0 ? objList.reduce((a, b) => (a.total_votes > b.total_votes ? a : b)).total_votes : max;
    return max;
  };

  const goBack = () => {
    // TODO: implement history.goback if possible

    if (eventHasUpdated) {
      if (window.confirm("Are you sure you want to go back? \nAny new changes to the event will be lost.") === false) return;
    }
    navigate("/home");
  };

  const handleSave = async () => {
    const data = {};
    data.schedules = state.addedSchedules.length > 0 ? state.addedSchedules : null;
    data.places = state.addedPlaces.length > 0 ? state.addedPlaces : null;
    try {
      const res = await axios.post(server.url + `/events/${eventId}/${user.uid}/save`, data);
      if (res.status === 200) {
        toast.success("Your new suggestions were saved successfully", { duration: 8000, className: "text-white" });
      }
    } catch (err) {
      toast.error("There has been an error trying to save your new suggestions", {
        duration: 8000,
        className: "text-white",
      });
      console.error(err);
    }
    return;
  };

  /**
   * A function that can be passed to update the state due to a removal of an item
   * @param {Object} item
   * @param {boolean} isPlace: true if it's a Place object, false if Schedule object
   */
  const undoAdd = (item, isPlace) => {
    if (isPlace) {
      dispatch({ type: EVENT_ACTIONS_TYPES.REMOVE_ADDED_RESTAURANT, payload: { target: item.place_id } });
    } else {
      dispatch({
        type: EVENT_ACTIONS_TYPES.REMOVE_ADDED_SCHEDULE,
        payload: { targetTime: item.time, targetDate: item.date },
      });
    }
  };

  const deletePlace = async (place_id) => {
    try {
      const res = await axios.delete(server.url + `/events/place/${eventId}/${place_id}`);
      if (res.status === 200) {
        toast.success("The suggestion was deleted successfully", { duration: 8000, className: "text-white" });
        dispatch({ type: EVENT_ACTIONS_TYPES.GET_START });
        const response = await axios.get(server.url + `/events/${eventId}/${user.uid}/full-info`);
        let data = response.data;
        dispatch({ type: EVENT_ACTIONS_TYPES.GET_SUCCESS, payload: data });
      }
    } catch (err) {
      toast.error("There has been an error trying to delete the suggestion", {
        duration: 8000,
        className: "text-white",
      });
      console.error(err);
    }
    return;
  };

  const deleteSchedule = async (date, time) => {
    try {
      const res = await axios.delete(server.url + `/events/schedule/${eventId}/${date}/${time}`);
      if (res.status === 200) {
        toast.success("The suggestion was deleted successfully", { duration: 8000, className: "text-white" });
        dispatch({ type: EVENT_ACTIONS_TYPES.GET_START });
        const response = await axios.get(server.url + `/events/${eventId}/${user.uid}/full-info`);
        let data = response.data;
        dispatch({ type: EVENT_ACTIONS_TYPES.GET_SUCCESS, payload: data });
      }
    } catch (err) {
      toast.error("There has been an error trying to delete the suggestion", {
        duration: 8000,
        className: "text-white",
      });
      console.error(err);
    }
    return;
  };

  // Updating new restaurants/schedules
  const [showAddCardRestaurantModal, setShowAddCardRestaurantModal] = useState(false);
  const [showAddCardScheduleModal, setShowAddCardScheduleModal] = useState(false);

  const [newRestaurant, setNewRestaurant] = useState(null);
  const [newSchedule, setNewSchedule] = useState(null);

  useEffect(() => {
    if (state.addedPlaces.length > 0 || state.addedSchedules.length > 0) {
      setEventHasUpdated(true);
    } else if (state.addedPlaces.length === 0 && state.addedSchedules.length === 0) {
      setEventHasUpdated(false);
    }
  }, [state.addedPlaces, state.addedSchedules]);

  useEffect(() => {
    function isValid() {
      var valid = true;
      state.places.forEach((place) => {
        if (place.place_id === newRestaurant.place_id) {
          valid = false;
        }
      });
      return valid;
    }

    if (newRestaurant) {
      if (isValid()) {
        dispatch({ type: EVENT_ACTIONS_TYPES.ADD_RESTAURANT, payload: { newRestaurant: newRestaurant } });
      } else {
        toast.error("Unable to add: This restaurant has already been added.", {
          duration: 8000,
          className: "text-white",
        });
      }
      setNewRestaurant(null);
    }
  }, [newRestaurant]);

  useEffect(() => {
    function isValid() {
      var valid = true;
      //Causes error: Cannot read properties of undefined (reading 'forEach')    -- Fixed
      state.schedules.forEach((schedule) => {
        if (schedule.time === newSchedule.time && schedule.date === newSchedule.date) {
          valid = false;
        }
      });
      return valid;
    }

    if (newSchedule) {
      if (isValid()) {
        dispatch({ type: EVENT_ACTIONS_TYPES.ADD_SCHEDULE, payload: { newSchedule: newSchedule } });
      } else {
        toast.error("Unable to add: Schedule already exist.", {
          duration: 8000,
          className: "text-white",
        });
      }
      setNewSchedule(null);
    }
  }, [newSchedule]);

  const handleAddRestaurant = () => {
    setShowAddCardRestaurantModal(true);
    return;
  };

  const handleAddSchedule = () => {
    setShowAddCardScheduleModal(true);
    return;
  };

  const handleEdit = () => {
    if (eventHasUpdated) {
      if (window.confirm("Are you sure you want to leave this page? \nAny new changes to the event will be lost.") === false) {
        return;
      }
    }
    navigate(`/event/${eventId}/edit`);
    return;
  };

  const handleVote = () => {
    if (eventHasUpdated) {
      if (window.confirm("Are you sure you want to leave this page? \nAny new changes to the event will be lost.") === false) {
        return;
      }
    }
    navigate(`/voting/${eventId}/${user.uid}`, { state: state });
    return;
  };

  const [showInviteModal, setShowInviteModal] = useState(false);
  const handleInviteParticipants = () => {
    setShowInviteModal(true);
  };

  // Place selection to zoom into that map marker
  const [placeSelection, setPlaceSelection] = useState(null);
  const handlePlaceSelection = (p) => {
    // Place has already been selected
    if (placeSelection) {
      if (placeSelection.place_id === p.place_id) {
        setPlaceSelection(null);
      } else {
        setPlaceSelection(p);
      }
    } else {
      setPlaceSelection(p);
    }
  };

  return (
    <>
      <div
        className="overflow-auto"
        style={{
          height: "100%",
          width: "100%",
          position: "fixed",
          padding: 0,
          margin: 0,
        }}
      >
        {/* <div className="bg-danger vh-100 m-0 p=0"> */}
        <Container className="h-100 d-flex flex-column p-0 m-0 " fluid>
          <Row className="h-100 p-0 m-0 ">
            {/* Map Display */}
            <Col className=" pe-0">{state.places ? <Map places={state.places} selected={placeSelection} /> : <></>}</Col>

            {/* Event information */}
            <Col className="w-100 p-0 m-1 ">
              <div className="h-100 border-2 rounded-3 p-2 shadow-md cursor-default">
                {/* Title Information Header */}
                <div className="text-center bg-gradient-to-tl from-indigo-500 via-indigo-600 to-indigo-700  rounded-md p-1 text-white shadow-lg">
                  <h2 className=" display-5 fw-semibold">{state.event.event_name ? state.event.event_name : ""}</h2>
                  <h5 className=" fw-semibold text-capitalize mt-3">
                    Hosted by: {state.event.host_name ? state.event.host_name : ""}
                  </h5>

                  <div>
                    <span className="inline-flex">
                      <h6 className=" fw-semibold">
                        Invited:{" "}
                        {state.participants && state.participants.length === 0
                          ? "Empty"
                          : state.participants.map((participant, index) => {
                              let MAX_DISPLAY = 3;
                              if (index < MAX_DISPLAY) {
                                return (
                                  <span className=" fst-italic fw-normal text-capitalize" key={index}>
                                    {index > 0 && index < MAX_DISPLAY ? ", " + participant.name : " " + participant.name}
                                  </span>
                                );
                              }
                              return (
                                <span
                                  key={index}
                                  variant="link"
                                  className="p-0 m-0 text-white fst-italic fw-normal hover:cursor-pointer underline"
                                  onClick={() => setShowParticipantModal(true)}
                                >
                                  <p> and {state.participants.length - MAX_DISPLAY} others...</p>
                                </span>
                              );
                            })}
                      </h6>

                      {/* Invite Participants */}
                      <div
                        className="ml-2 rounded-circle d-flex align-items-center justify-content-center  bg-blue-500 hover:bg-cyan-400 cursor-pointer"
                        style={{ height: "25px", width: "25px" }}
                        onClick={handleInviteParticipants}
                      >
                        <BsPersonFillAdd size={18} color="white" />
                      </div>
                    </span>
                  </div>

                  {/* Description */}
                  <div className="text-xs bg-blue-200 rounded-md bg-opacity-40 mt-3 mb-3 mx-16 py-2 px-3 shadow-lg cursor-default">
                    <p className="text-base/5 font-medium text-indigo-800">
                      <small>{state.event.event_description ? state.event.event_description : "Empty description..."}</small>
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                {state.event.host_id === user.uid ? (
                  <div className="mt-2 d-flex justify-content-end">
                    <button
                      type="button"
                      className="text-white bg-gradient-to-r from-blue-500 to-cyan-500  hover:from-cyan-500 hover:to-blue-500 font-normal rounded-lg text-xs px-5 py-2.5 text-center shadow-md"
                      onClick={handleEdit}
                    >
                      <span className=" inline-flex align-items-center">
                        <FiSave className=" mr-2" />
                        Edit
                      </span>
                    </button>
                  </div>
                ) : null}
                <div className=" mt-10">
                  <h3 className=" mb-3 fw-medium ml-2">Restaurants</h3>
                  <Row xs={1} md={3} className="gx-2 gy-2">
                    {state.places.map((place, index) => {
                      var userSuggested = false;
                      state.addedPlaces.forEach((addedPlace) => {
                        if (addedPlace.place_id === place.place_id) {
                          userSuggested = true;
                          return userSuggested;
                        }
                      });
                      return (
                        <Col key={index} className=" d-flex align-items-stretch">
                          <PlaceCard
                            key={index}
                            place={place}
                            highestVote={highestPlaceVote}
                            userSuggested={userSuggested}
                            undoAdd={undoAdd}
                            onClick={() => handlePlaceSelection(place)}
                            selected={placeSelection}
                            deletePlace={deletePlace}
                          />
                        </Col>
                      );
                    })}
                    <Col className="d-flex align-items-stretch ">
                      <AddCard
                        onClick={handleAddRestaurant}
                        modal={
                          <PlaceSearchModal
                            show={showAddCardRestaurantModal}
                            onHide={() => setShowAddCardRestaurantModal(false)}
                            data={newRestaurant}
                            setData={setNewRestaurant}
                          />
                        }
                      />
                    </Col>
                  </Row>
                </div>

                <div className="mt-5">
                  <h3 className=" mb-3 fw-medium ml-2">Schedules</h3>
                  <Row xs={1} md={3} className="gx-2 gy-2 ">
                    {state.schedules.map((schedule, index) => {
                      var userSuggested = false;
                      state.addedSchedules.forEach((addedSchedule) => {
                        if (schedule.date === addedSchedule.date && schedule.time === addedSchedule.time) {
                          userSuggested = true;
                          return userSuggested;
                        }
                      });

                      return (
                        <Col key={index} className=" d-flex align-items-stretch">
                          <TimeCard
                            key={index}
                            schedule={schedule}
                            highestVote={highestTimeVote}
                            userSuggested={userSuggested}
                            undoAdd={undoAdd}
                            deleteSchedule={deleteSchedule}
                          />
                        </Col>
                      );
                    })}
                    <Col className=" d-flex align-items-stretch">
                      <AddCard
                        onClick={handleAddSchedule}
                        modal={
                          <AddScheduleModal
                            show={showAddCardScheduleModal}
                            onHide={() => setShowAddCardScheduleModal(false)}
                            data={newSchedule}
                            setData={setNewSchedule}
                          />
                        }
                      />
                    </Col>
                  </Row>
                </div>

                {/* Buttons */}
                <Stack gap={0} className="my-5">
                  <div className="d-grid">
                    <button
                      type="button"
                      className="text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-md"
                      onClick={handleVote}
                    >
                      <span className=" inline-flex align-items-center text-base">
                        <LuVote className=" mr-2" size={20} />
                        Vote now
                      </span>
                    </button>
                  </div>
                  <div className="d-flex justify-content-between px-0 ">
                    <button
                      type="button"
                      className="text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-md"
                      onClick={goBack}
                    >
                      <span className=" inline-flex align-items-center text-base">
                        <IoChevronBack className=" mr-2" size={16} />
                        Back To Main Menu
                      </span>
                    </button>
                    {eventHasUpdated ? (
                      <button
                        type="button"
                        className=" text-white bg-gradient-to-r  from-pink-500 to-yellow-500 hover:from-yellow-500 hover:to-pink-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-md"
                        //Refresh page after save
                        onClick={() => {
                          handleSave();
                          window.location.reload();
                        }}
                      >
                        <span className=" inline-flex align-items-center text-base ">
                          <FiSave className=" mr-2" />
                          Save
                        </span>
                      </button>
                    ) : (
                      <button></button>
                    )}
                  </div>
                </Stack>
              </div>
            </Col>
          </Row>
        </Container>

        <ListParticipantsModal
          show={showParticipantModal}
          onHide={handleListParticipantModalClose}
          participants={state.participants}
        />
      </div>

      <InviteUsersModal
        show={showInviteModal}
        onHide={() => setShowInviteModal(false)}
        eventId={eventId}
        handleAdd={handleAddParticipant}
      />

      <Toaster>
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              backgroundColor: "#4F46E5",
            }}
            position="top-right"
          />
        )}
      </Toaster>
    </>
  );
}
