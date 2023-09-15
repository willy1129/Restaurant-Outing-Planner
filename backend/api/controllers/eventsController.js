const db = require("../../config/database");

const Event = require("../models/event");
const Participant = require("../models/participants");
const PlaceVote = require("../models/placeVote");
const TimeVote = require("../models/timeVote");
const User = require("../models/user");

// Refactored createEvent, deleteEventById, getEventsByUserID, and getEventByID - Ryan July 26, 2023
exports.createEvent = async (req, res) => {
  try {
    console.log("Creating event...");
    console.log("In createEvent... req.body: ", req.body);
    const { event_name, event_description, host_id, duration } = req.body;
    const event = new Event(event_name, event_description, host_id, duration);
    console.log(event);
    const newEventId = await event.createEvent();
    res.send(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateEventByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_name, event_description, host_id, duration } = req.body;
    console.log("Updating event with id: ", id);
    const result = await Event.updateEvent(id, { event_name, event_description, host_id, duration });
    console.log("AFTER UPDATING... Result: ", result);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Event updated successfully" });
    } else {
      throw new Error("Event not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEventByID = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting event with id: ", id);
    const result = await Event.deleteEventByID(id);
    console.log("AFTER DELETING... Result: ", result);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      throw new Error("Event not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAllEvents();
    console.log("In eventsController, getting all events...", events);
    res.send(events); // Fixed as it was only sending the first event - Ryan July 26, 2023
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.getEventsByUserID = async (req, res) => {
  try {
    const uid = req.params.uid;
    console.log("Getting events by user id: ", uid);
    const events = await Event.getByHostId(uid);
    res.send(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getEventByID = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Getting event by id: ", id);
    const [rows] = await Event.getEventById(id);
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getInvitedEventsNTotalParticipants = async (req, res) => {
  try {
    let hostId = req.params.uid;
    const [rows, fieldData] = await Event.getAllInvitedEventsWTotalParticipants(hostId);

    res.send(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.getHostedEventsNTotalParticipants = async (req, res) => {
  try {
    let hostId = req.params.uid;
    const [rows, fieldData] = await Event.getAllPersonalHostedEventsWTotalParticipants(hostId);
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * event: { event_id, event_name, event_description, host_name, host_id, duration }
 * participants: [{ name }, ...]
 * placeVoteInfo: [{ proposer_name, address, restaurant_name, rating, place_id, total_votes, user_voted }]
 * timeVoteInfo: [{ proposer_name, timeslot, total_votes, user_voted }]
 */
exports.getEventInfoById = async (req, res) => {
  console.log("Getting full event info");
  try {
    const eventId = req.params.id;
    const uid = req.params.uid;

    const [nameRows, fieldData0] = await User.getFullName(uid);
    const [eventRows, fieldData] = await Event.getEventById(eventId);
    const [participantRows, fieldData1] = await Participant.getAllParticipantsByEventIdExcludingHost(eventId);
    const [placeVoteInfoRows, fieldData2] = await PlaceVote.getPlaceVoteInfoWithTotalVoteByEventId(eventId, uid);
    placeVoteInfoRows.forEach((row) => {
      row.position = JSON.parse(row.position);
      console.log(row.position);
    });
    const [timeVoteInfoRows, fieldData3] = await TimeVote.getTimeVoteInfoWithTotalVoteByEventId(eventId, uid);

    const rows = {
      name: nameRows[0].name,
      event: eventRows[0],
      participants: participantRows,
      placeVoteInfo: placeVoteInfoRows,
      timeVoteInfo: timeVoteInfoRows,
    };

    console.log(rows);
    // console.log(placeVoteInfoRows);

    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.inviteUserToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const uidToInvite = req.params.uid;

    const participant = new Participant(eventId, uidToInvite);
    const isValid = await participant.inviteToEvent();

    isValid ? res.sendStatus(202) : null;
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      res.sendStatus(409);
      return;
    } else {
      res.sendStatus(500);
    }
    // res.status(500).json({ message: err.message });
  }
};

exports.saveEventUpdate = async (req, res) => {
  const eventId = req.params.id;
  const uid = req.params.uid;
  const newPlaces = req.body.places;
  const newSchedules = req.body.schedules;

  try {
    if (newPlaces) {
      newPlaces.forEach(async (place) => {
        await Event.addRestaurant(place);
        let placeCandidatesId = await Event.insertPlaceCandidate(place, eventId, uid);
        let placeVote = new PlaceVote(placeCandidatesId, uid);
        await placeVote.create();
      });
    }

    if (newSchedules) {
      newSchedules.forEach(async (schedule) => {
        let timeCandidatesId = await Event.insertTimeCandidate(schedule, eventId, uid);
        let timeVote = new TimeVote(timeCandidatesId, uid);
        await timeVote.create();
      });
    }
    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deletePlaceCandidateFromEvent = async (req, res) => {
  try {
    const eventId = req.params.event_id;
    const placeId = req.params.place_id;
    const result = await Event.deletePlaceCandidateFromEvent(eventId, placeId);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Place candidate deleted successfully" });
    } else {
      throw new Error("Place candidate not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTimeCandidateFromEvent = async (req, res) => {
  try {
    const eventId = req.params.event_id;
    const date = req.params.date;
    const time = req.params.time;
    console.log("Deleting time candidate with event_id: ", eventId, " date: ", date, " time: ", time);
    const result = await Event.deleteTimeCandidateFromEvent(eventId, date, time);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Time candidate deleted successfully" });
    } else {
      throw new Error("Time candidate not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
