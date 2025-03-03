import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5003/collaboration";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], 
});
