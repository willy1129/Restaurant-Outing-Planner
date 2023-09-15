const db = require("../../config/database");

/**
 * Purpose: Participant model class
 */

module.exports = class Participant {
  constructor(eventId, userId) {
    this.eventId = eventId;
    this.userId = userId;
  }

  /**
   * @returns True if successful, false otherwise
   */
  async inviteToEvent() {
    let valid = false;
    valid = await db.execute(
      "INSERT INTO participants (event_id, uid) VALUES (?, ?)",
      [this.eventId, this.userId],
      function (err, result) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            throw err;
          }
          valid = true;
        }
      }
    );
    return valid;
  }

  static async getAllParticipantsByEventIdExcludingHost(eventId) {
    return await db.execute(
      "SELECT CONCAT_WS(' ', u.firstname, u.lastname) AS name FROM participants p INNER JOIN users u ON p.uid = u.uid \
      INNER JOIN events e ON e.event_id = p.event_id \
      WHERE e.event_id = ? AND p.uid != e.host_id",
      [eventId]
    );
  }

  // static async inviteParticipantsToEventId(eventId) {
  //   return await db.execute(
  //     "",
  //     [eventId]
  //   );
  // }
};
