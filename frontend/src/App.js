import { Routes, Route } from "react-router-dom";

import AuthContextProvider from "./contexts/AuthContext";

// Page imports
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import EventForm from "./components/form/EventForm";
import EventsList from "./components/EventsList";
import Access from "./pages/Access";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventView from "./pages/EventView";

// test
import PlaceSearch from "./pages/test/PlaceSearch";
import MenuPlaceSearch from "./pages/test/MenuPlaceSearch";
import Voting from "./pages/test/Voting";
import ViewEventVotes from "./pages/test/ViewEventVotes";
import InviteUsersModal from "./components/modal/InviteUsersModal";
import AddScheduleModal from "./components/modal/AddScheduleModal";
// import Map from "./components/googlemaps/Map";

import Header from "./components/layout/Header";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { auth } from "./config/firebase";
import server from "./utils/constants/server";
import EventList from "./components/list/EventList";

function App() {
  const [eventsList, setEventsList] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successColor, setSuccessColor] = useState("bg-blue-500 hover:bg-blue-800");

  const [uid, setUid] = useState(null);

  //https://stackoverflow.com/questions/71548631/getting-additional-data-in-firebase-auth-onauthstatechanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSaveEvent = async (event) => {
    // Refactored code to match sql naming scheme - Ryan July 26, 2023
    if (event.event_name && event.event_description) {
      try {
        const saveEvent_url = server.url + `/events`;
        const response = await axios.post(saveEvent_url, event);
        console.log("In App.js, handleSaveEvent response data:", response.data, saveEvent_url);

        // Refactored code to always fetch from database after submitting
        // const updatedRecipeList = [...eventsList, response.data];
        // setEventsList(updatedRecipeList);
        const getEvents_url = server.url + `/events/`;
        const responseEvents = await axios.get(getEvents_url);
        setEventsList(responseEvents.data);

        setShowSuccessMessage(true);
        setSuccessMessage("Event Added!");
        setSuccessColor("bg-blue-500 hover:bg-blue-800");
        setTimeout(() => setShowSuccessMessage(false), 5000);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const deleteEvent_url = server.url + `/events/${id}`;
      console.log("App.js - handleDeleteEvent - Deleting event with id: ", id, deleteEvent_url);
      const response = await axios.delete(deleteEvent_url);

      if (response.status === 200) {
        const updatedEventsList = eventsList.filter((event) => event.event_id !== id);
        setEventsList(updatedEventsList);

        const getEvents_url = server.url + `/events/`;
        const responseEvents = await axios.get(getEvents_url);
        setEventsList(responseEvents.data);

        setShowSuccessMessage(true);
        setSuccessMessage("Event Deleted!");
        setSuccessColor("bg-red-500 hover:bg-red-800");
        setTimeout(() => setShowSuccessMessage(false), 5000);
      } else {
        throw new Error("Event deletion was not successful");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateEvent = async (id, updatedEvent) => {
    try {
      const updateEvent_url = server.url + `/events/${id}`;
      console.log("Updating event with id: ", id, updateEvent_url);
      const response = await axios.put(updateEvent_url, updatedEvent);

      if (response.status === 200) {
        const updatedEventsList = eventsList.map((event) => (event.event_id === id ? updatedEvent : event));
        setEventsList(updatedEventsList);

        const getEvents_url = server.url + `/events/`;
        const responseEvents = await axios.get(getEvents_url);
        setEventsList(responseEvents.data);

        setShowSuccessMessage(true);
        setSuccessMessage("Event Updated!");
        setSuccessColor("bg-green-500 hover:bg-green-800");
        setTimeout(() => setShowSuccessMessage(false), 5000);
      } else {
        throw new Error("Event update was not successful");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getEvents_url = server.url + `/events/`;
        const getEvents_response = await axios.get(getEvents_url);
        setEventsList(getEvents_response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* <Header />
      {showSuccessMessage && (
        <div className={`px-4 py-2 text-center text-white rounded-md ${successColor}`}>{successMessage}</div>
      )} */}

      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Access />} />
          <Route
            path="/eventform"
            element={
              <EventForm onSave={handleSaveEvent} onDelete={handleDeleteEvent} onUpdate={handleUpdateEvent} uid={uid} />
            }
          />

          <Route
            path="/event/:eventId/edit"
            element={
              <EventForm onSave={handleSaveEvent} onDelete={handleDeleteEvent} onUpdate={handleUpdateEvent} uid={uid} />
            }
          />

          <Route
            path="/eventslist"
            element={
              <EventsList
                eventsList={eventsList}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                onUpdate={handleUpdateEvent}
                uid={uid}
              />
            }
          />

          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event/:eventId" element={<EventView />} />
          {/* TODO: Allow edit for an event */}
          {/* <Route path="/event/:eventId/edit" element={ } /> */}
          <Route path="/test/searchplace" element={<PlaceSearch />} />
          <Route path="/test/menusearchplace" element={<MenuPlaceSearch />} />
          <Route path="/voting/:eventId/:uid" element={<Voting uid={uid} eid={1} />} />
          <Route path="/test/inviteUsers" element={<InviteUsersModal eventId={3} />} />
          <Route path="/test/addSchedule" element={<AddScheduleModal />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
