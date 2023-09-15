const mysql = require("mysql2");

require("dotenv").config();

// Note: supportBigNumbers is for float type in mysql tables, else it might results in inaccurate float values

// For production: cloud run deployment
const prodPool = mysql.createPool({
  socketPath: process.env.INSTANCE_UNIX_SOCKET,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  supportBigNumbers: true,
  bigNumberStrings: true,
});

// For development only - local
const devPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  supportBigNumbers: true,
  bigNumberStrings: true,
});

// Ryan Test
// const devPool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'secret',
//     database: 'restaurant_planner_app',
//     port: 3307,
//     connectionLimit: process.env.DB_CONNECTION_LIMIT
// });

module.exports = process.env.NODE_ENV === "production" ? prodPool.promise() : devPool.promise();