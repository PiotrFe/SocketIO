const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer, {
  path: "/socket.io", // is the default, this is why the client can use "/socket.io/socket.io.js";
  serveClient: true, // ditto
});

io.on("connection", (socket) => {
  socket.emit("messageFromServer", {
    data: "Welcome from the socketio server",
  });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });
  socket.on("newMessageToServer", (msg) => {
    io.emit("messageToClients", { text: msg.text });
  });
});
