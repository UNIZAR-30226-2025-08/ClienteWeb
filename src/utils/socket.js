// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false, // Evita que se conecte automáticamente
  reconnection: true, // Habilita la reconexión automática
});

export default socket;
