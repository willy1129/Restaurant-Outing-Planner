const express = require("express");
const router = express.Router();

const eventsController = require("../controllers/eventsController");

router.post("/create/:uid", eventsController.createEvent);

router.get("/list", eventsController.getAllEvents);
// Debugging - Ryan July 26, 2021
// http://localhost:8080/api/events/list/invited/oAxwJgo0I0PA8oSMJzOYh811Ek32
// http://localhost:8080/api/events/list/hosted/oAxwJgo0I0PA8oSMJzOYh811Ek32
router.get("/list/invited/:uid", eventsController.getInvitedEventsNTotalParticipants);
router.get("/list/hosted/:uid", eventsController.getHostedEventsNTotalParticipants);
router.get("/:id/:uid/full-info", eventsController.getEventInfoById);
router.post("/:id/invite/:uid", eventsController.inviteUserToEvent);
router.put("/:id", eventsController.updateEventByID);

router.post("/:id/:uid/save", eventsController.saveEventUpdate);

router.put("/:id", eventsController.updateEventByID);
router.post("/:id/:uid/save", eventsController.saveEventUpdate);

router.get("", eventsController.getAllEvents);
router.post("", eventsController.createEvent);
router.get("/:id", eventsController.getEventByID);
router.delete("/:id", eventsController.deleteEventByID);
router.get("/user/:uid", eventsController.getEventsByUserID);

router.delete("/place/:event_id/:place_id", eventsController.deletePlaceCandidateFromEvent);
router.delete("/schedule/:event_id/:date/:time", eventsController.deleteTimeCandidateFromEvent);

module.exports = router;