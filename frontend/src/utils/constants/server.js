// const IP = "localhost";
// const SERVER_PORT = 8080;

const SERVER_IP = process.env.REACT_APP_SERVER_URL;
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
const API_ROUTE_PREFIX = "/api";

const server = {
  url:
    process.env.REACT_APP_NODE_ENV === "production"
      ? `${SERVER_IP}` + API_ROUTE_PREFIX
      : `${SERVER_IP}:${SERVER_PORT}` + API_ROUTE_PREFIX,
};

export default server;
