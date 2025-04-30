// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://albertofsg.ddns.net:5000");

export default socket;
