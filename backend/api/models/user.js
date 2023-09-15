const db = require("../../config/database");

/**
 * Purpose: User model class
 */

module.exports = class User {
  constructor(uid, firstname, lastname, email) {
    this.uid = uid;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
  }

  async create() {
    let insertInfo = await db.execute(
      "INSERT INTO users (uid, firstname, lastname, email) VALUES (?, ?, ?, ?)",
      [this.uid, this.firstname, this.lastname, this.email],
      (err, result) => {
        if (err) throw err;
      }
    );
    // return insertInfo[0].insertId;
  }

  static async getAllUsers() {
    return await db.execute("SELECT uid, firstname, lastname, email FROM users");
  }

  static async getAllUsersWithFilter(userId, query) {
    const queryLower = query.toLowerCase();
    return await db.execute(
      `SELECT uid, CONCAT(firstname, ' ', lastname) AS name, email FROM users WHERE uid != ? AND LOWER(CONCAT(firstname, ' ', lastname)) LIKE '${queryLower}%'`,
      [userId]
    );
  }

  static async getName(hostId) {
    return await db.execute("SELECT firstname, lastname FROM users WHERE uid = ?", [hostId]);
  }

  static async getFullName(hostId) {
    return await db.execute("SELECT CONCAT_WS(' ', firstname, lastname) AS name FROM users WHERE uid = ?", [hostId]);
    // return await db.execute("SELECT firstname, lastname FROM users WHERE uid = ?", [hostId]);
  }

  // static async getAllEventsByHostUid(hostUid) {
  //   return await db.execute(
  //     "SELECT event_id, event_name, firstname, lastname FROM events INNER JOIN users ON events.host_uid = users.uid WHERE users.uid = ?",
  //     [hostUid]
  //   );
  // }
};
