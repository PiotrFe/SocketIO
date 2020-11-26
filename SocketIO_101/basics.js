const http = require("http");
const socketio = require("socket.io");

const server = http.createServer((req, res) => {
  res.end("I am connected");
});

const io = socketio(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on("connection", (socket, req) => {
  socket.emit("welcome", "Welcome to websocket server!");
  socket.on("message", (msg) => {
    console.log(msg);
  });
});

server.listen(8080);
