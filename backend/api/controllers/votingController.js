const db = require("../../config/database");

exports.getPlaceCandidatesById = async (req, res) => {
  const place_candidates_id = req.params.place_candidates_id;
  const sql = "SELECT uid FROM place_votes Where place_candidates_id = ?";
  const [row, fields] = await db.execute(sql, [place_candidates_id]);
  let uids = [];
  row.forEach((record) => {
    uids.push(record.uid);
  });
  res.send(uids);
};

exports.getTimeCandidatesById = async (req, res) => {
  const time_candidates_id = req.params.time_candidates_id;
  const sql = "SELECT uid FROM time_votes Where time_candidates_id = ?";
  const [row, fields] = await db.execute(sql, [time_candidates_id]);
  res.send(row);
};

// exports.createVote = async (req, res) => {
//   console.log(req.body);
//   let place_candidates_id = [];
//   let time_candidates_id = [];
//   if (req.body.place_candidates_id !== "undefined") {
//     place_candidates_id = req.body.place_candidates_id;
//   }
//   if (req.body.time_candidates_id !== "undefined") {
//     time_candidates_id = req.body.time_candidates_id;
//   }
//   place_candidates_id.forEach(async (id) => {
//     const sql =
//       "INSERT INTO place_votes (place_candidates_id, uid) VALUES (?, ?)";
//     await db.execute(sql, [id, req.body.uid]);
//   });
//   time_candidates_id.forEach(async (id) => {
//     const sql =
//       "INSERT INTO time_votes (time_candidates_id, uid) VALUES (?, ?)";
//     await db.execute(sql, [id, req.body.uid]);
//   });
// };

exports.getAllTimeCandidates = async (req, res) => {
  //Retrieve list of timeslot from database
  res.send(timeslots);
};

exports.getPlaceCandidatesByEventId = async (req, res) => {
  const eventId = req.params.event_id;
  const sql =
    "SELECT place_candidates_id, P.place_id, name, address FROM place_candidates P, restaurants R Where event_id = ? AND P.place_id = R.place_id";
  const [row, fields] = await db.execute(sql, [eventId]);
  res.send(row);
};

exports.getTimeCandidatesByEventId = async (req, res) => {
  //Retrieve list of time from database
  const eventId = req.params.event_id;
  const sql =
    "SELECT time_candidates_id, time, date FROM time_candidates Where event_id = ?";
  const [row, fields] = await db.execute(sql, [eventId]);
  res.send(row);
};

exports.getTotalPlaceVotes = async (req, res) => {
  const place_candidates_id = req.params.place_candidates_id;
  const sql =
    "SELECT COUNT(*) AS numVotes FROM place_votes Where place_candidates_id = ?";
  const [row, fields] = await db.execute(sql, [place_candidates_id]);
  // console.log(row);
  res.send(row[0]);
};

exports.getTotalTimeVotes = async (req, res) => {
  const time_candidates_id = req.params.time_candidates_id;
  const sql =
    "SELECT COUNT(*) AS numVotes FROM time_votes Where time_candidates_id = ?";
  const [row, fields] = await db.execute(sql, [time_candidates_id]);
  res.send(row);
};

exports.updateVote = async (req, res) => {
  const event_id = req.params.event_id;
  const uid = req.params.uid;
  const deleteTimeVotes =
    "DELETE tv FROM time_votes tv INNER JOIN time_candidates tc ON tv.time_candidates_id = tc.time_candidates_id WHERE tc.event_id = ? AND tv.uid = ?";
  const deletePlaceVotes =
    "DELETE pv FROM place_votes pv INNER JOIN place_candidates pc ON pv.place_candidates_id = pc.place_candidates_id WHERE pc.event_id = ? AND pv.uid = ?";

  let place_candidates_id = [];
  let time_candidates_id = [];
  if (req.body.place_candidates_id !== "undefined") {
    place_candidates_id = req.body.place_candidates_id;
  }
  if (req.body.time_candidates_id !== "undefined") {
    time_candidates_id = req.body.time_candidates_id;
  }
  await db.execute(deletePlaceVotes, [event_id, uid]);
  await db.execute(deleteTimeVotes, [event_id, uid]);
  place_candidates_id.forEach(async (id) => {
    const sql =
      "INSERT IGNORE INTO place_votes (place_candidates_id, uid) VALUES (?, ?)";
    await db.execute(sql, [id, req.body.uid]);
  });
  time_candidates_id.forEach(async (id) => {
    const sql =
      "INSERT IGNORE INTO time_votes (time_candidates_id, uid) VALUES (?, ?)";
    await db.execute(sql, [id, req.body.uid]);
  });
  res.send("success");
};
