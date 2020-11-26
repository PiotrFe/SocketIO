const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer, {
  path: "/socket.io", // is the default, this is why the client can use "/socket.io/socket.io.js";
  serveClient: true, // ditto
});

// io.on = io.of("/").on

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

io.of("/admin").on("connection", socket => {
  console.log("Someone connected to the admin namespace");

  io.of("/admin").emit("welcome", "Welcome to the admin namespace");
})
