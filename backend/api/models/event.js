const db = require("../../config/database");
const Participant = require("./participants");

/**
 * Purpose: Event model class
 */

module.exports = class Event {
  constructor(event_name, event_description, host_id, duration = 60) {
    this.event_name = event_name;
    this.event_description = event_description;
    this.host_id = host_id;
    this.duration = duration;
  }

  // Returns the event_id (that is created by the database)
  async createEvent() {
    const [insertInfo] = await db.execute(
      "INSERT INTO events (event_name, event_description, host_id, duration) VALUES (?, ?, ?, ?)",
      [this.event_name, this.event_description, this.host_id, this.duration]
    );

    // Debug, newly created events weren't reflected in the tag list - Ryan July 26, 2023
    // Most liekely because it is not being registed in the participants table
    const participant = new Participant(insertInfo.insertId, this.host_id);
    await participant.inviteToEvent();

    return insertInfo.insertId;
  }

  static async updateEvent(id, { event_name, event_description, host_id, duration }) {
    const [result] = await db.execute(
      "UPDATE events SET event_name = ?, event_description = ?, host_id = ?, duration = ? WHERE event_id = ?",
      [event_name, event_description, host_id, duration, id]
    );
    return result;
  }

  static async deleteEventByID(eventId) {
    const [result] = await db.execute("DELETE FROM events WHERE event_id = ?", [eventId]);
    return result;
  }

  static async getAllEvents() {
    const [rows] = await db.execute("SELECT event_id, event_name, event_description, host_id, duration FROM events");
    return rows;
  }

  static async getByHostId(hostId) {
    const [rows] = await db.execute(
      "SELECT event_id, event_name, event_description, host_id, duration FROM events WHERE host_id = ?",
      [hostId]
    );
    return rows.map((row) => new Event(row));
  }

  static async getAllInvitedEventsWTotalParticipants(hostUid) {
    return await db.execute(
      "SELECT u.firstname, u.lastname, e.event_id, e.event_name, e.event_description, e.host_id, e.duration,(SELECT COUNT(*) FROM participants INNER JOIN events on events.event_id=participants.event_id AND e.event_id=events.event_id) AS total_participants FROM events e INNER JOIN participants p ON e.event_id = p.event_id INNER JOIN users u ON e.host_id = u.uid WHERE e.host_id != ? AND p.uid = ? ",
      [hostUid, hostUid]
    );
  }

  static async getAllPersonalHostedEventsWTotalParticipants(hostUid) {
    return await db.execute(
      "SELECT users.firstname, users.lastname, events.event_id, events.event_name, event_description, events.host_id, events.duration, COUNT(participants.uid) AS total_participants \
      FROM events INNER JOIN participants ON events.event_id = participants.event_id INNER JOIN users ON events.host_id = users.uid \
      WHERE events.host_id = ? \
      GROUP BY events.event_id",
      [hostUid]
    );
  }

  static async getEventById(eventId) {
    return await db.execute(
      "SELECT event_id, event_name, event_description, CONCAT_WS(' ', u.firstname, u.lastname) AS host_name, host_id, duration FROM events e INNER JOIN users u ON e.host_id = u.uid WHERE event_id = ?",
      [eventId]
    );
  }

  static async getInvitedEventByUid(uid) {
    return await db.execute(
      "SELECT event_id, event_name, event_description, CONCAT_WS(' ', u.firstname, u.lastname) AS host_name, host_id, duration FROM events e INNER JOIN participants p ON e.event_id = p.event_id INNER JOIN users u ON e.host_id = u.uid WHERE p.uid = ?",
      [uid]
    );
  }

  static async addRestaurant(restaurant) {
    console.log("restaurant: ", restaurant);

    return await db.execute("INSERT IGNORE INTO restaurants (place_id, name, address, rating, position) VALUES (?, ?, ?, ?, ?)", [
      restaurant.place_id,
      restaurant.restaurant_name,
      restaurant.address,
      restaurant.rating,
      JSON.stringify(restaurant.position),
    ]);
  }

  /**
   *
   * @param {object} place
   * @param {int} eventId
   * @param {string} uid
   * @returns
   */
  static async insertPlaceCandidate(place, eventId, uid) {
    const insertInfo = await db.execute(
      "INSERT IGNORE INTO place_candidates (place_id, event_id, proposer_uid) VALUES (?, ?, ?)",
      [place.place_id, eventId, uid]
    );
    return insertInfo[0].insertId;
  }

  static async insertTimeCandidate(schedule, eventId, uid) {
    const insertInfo = await db.execute(
      "INSERT IGNORE INTO time_candidates (event_id, date, time, proposer_uid) VALUES (?, ?, ?, ?)",
      [eventId, schedule.date, schedule.time, uid]
    );
    return insertInfo[0].insertId;
  }

  static async deletePlaceCandidateFromEvent(eventId, place_id) {
    const [result] = await db.execute("DELETE FROM place_candidates WHERE event_id = ? AND place_id = ?", [eventId, place_id]);
    return result;
  }

  static async deleteTimeCandidateFromEvent(eventId, date, time) {
    const [result] = await db.execute("DELETE FROM time_candidates WHERE event_id = ? AND date = ? AND time = ?", [
      eventId,
      date,
      time,
    ]);
    return result;
  }
};
