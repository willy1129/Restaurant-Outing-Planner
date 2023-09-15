const db = require("../../config/database");

/**
 * Purpose: Place Vote model class
 */

module.exports = class PlaceVote {
  constructor(place_candidates_id, uid) {
    this.place_candidates_id = place_candidates_id;
    this.uid = uid;
  }

  async create() {
    return await db.execute("INSERT IGNORE INTO place_votes (place_candidates_id, uid) VALUES (?, ?)", [
      this.place_candidates_id,
      this.uid,
    ]);
  }

  static async getPlaceVoteInfoWithTotalVoteByEventId(eventId, uid) {
    return await db.execute(
      "SELECT CONCAT_WS(' ', u.firstname, u.lastname) AS proposer_name, temp_restaurant.address, temp_restaurant.name AS restaurant_name, temp_restaurant.rating, temp_restaurant.place_id, temp_restaurant.position, COUNT(pv.uid) as total_votes, \
      CASE WHEN pc.proposer_uid = ? THEN TRUE ELSE FALSE END AS user_voted \
      FROM place_candidates pc LEFT OUTER JOIN place_votes pv ON pc.place_candidates_id = pv.place_candidates_id \
      INNER JOIN (SELECT place_id, name, address, rating, position FROM restaurants) as temp_restaurant ON temp_restaurant.place_id = pc.place_id \
      INNER JOIN users u ON u.uid = pc.proposer_uid \
      WHERE event_id = ? \
      GROUP BY u.firstname, u.lastname, pc.place_candidates_id, temp_restaurant.address, temp_restaurant.name, temp_restaurant.rating, pc.proposer_uid, temp_restaurant.place_id, temp_restaurant.position",
      [uid, eventId]
    );
  }
};
