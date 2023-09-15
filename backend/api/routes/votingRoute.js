const db = require("../../config/database");
const express = require("express");
const router = express.Router();

const votingController = require("../controllers/votingController");

const restaurants = [
  { name: "restaurant1", pid: 1 },
  { name: "restaurant2", pid: 2 },
  { name: "restaurant3", pid: 3 },
];
const timeslots = ["timeslot1", "timeslot2", "timeslot3"];

router.get("/", (req, res) => {
  res.send("hello world");
});

router.get(
  "/place_votes/:place_candidates_id",
  votingController.getPlaceCandidatesById
);

router.get(
  "/time_votes/:time_candidates_id",
  votingController.getTimeCandidatesById
);

// router.post("/", votingController.createVote);

router.get("/place_candidates", (req, res) => {
  //Retrieve list of restaurants from database
  res.send(restaurants);
});

router.get("/time_candidates", votingController.getAllTimeCandidates);

router.get(
  "/place_candidates/:event_id",
  votingController.getPlaceCandidatesByEventId
);

router.get(
  "/time_candidates/:event_id",
  votingController.getTimeCandidatesByEventId
);

router.get(
  "/count_place_votes/:place_candidates_id",
  votingController.getTotalPlaceVotes
);

router.get(
  "/count_time_votes/:time_candidates_id",
  votingController.getTotalTimeVotes
);

// router.delete(
//   "/delete_vote/:event_id/:uid",
//   votingController.deletePreviousVotes
// );

router.put("/update_vote/:event_id/:uid", 
votingController.updateVote
 );

module.exports = router;
