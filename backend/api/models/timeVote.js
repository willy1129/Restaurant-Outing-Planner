const db = require("../../config/database");

/**
 * Purpose: Time Vote model class
 */

module.exports = class TimeVote {
  constructor(time_candidates_id, uid) {
    this.time_candidates_id = time_candidates_id;
    this.uid = uid;
  }

  async create() {
    console.log("time_candidates_id: " + this.time_candidates_id);
    console.log("uid: " + this.uid);
    return await db.execute("INSERT IGNORE INTO time_votes (time_candidates_id, uid) VALUES (?, ?)", [
      this.time_candidates_id,
      this.uid,
    ]);
  }

  static async getTimeVoteInfoWithTotalVoteByEventId(eventId, uid) {
    return await db.execute(
      "SELECT CONCAT_WS(' ', u.firstname, u.lastname) AS proposer_name, tc.date, tc.time, COUNT(tv.uid) AS total_votes, \
        CASE WHEN tc.proposer_uid = ? THEN TRUE ELSE FALSE END AS user_voted \
        FROM time_candidates tc LEFT OUTER JOIN time_votes tv ON tc.time_candidates_id = tv.time_candidates_id \
        INNER JOIN users u ON u.uid = tc.proposer_uid \
        WHERE event_id = ? GROUP BY u.firstname, u.lastname, tc.date, tc.time, tc.proposer_uid \
        ORDER BY tc.date, tc.time",
      [uid, eventId]
    );
  }
};

// CASE WHEN u.username IS NULL THEN FALSE ELSE TRUE END as user_exists
