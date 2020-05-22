const WebSocket = require("ws");
const fs = require("fs");
const https = require("https");

// const server = https.createServer({
//   cert: fs.readFileSync("server.cert"),
//   key: fs.readFileSync("server.key")
// });

// const wsserver = new WebSocket.Server({ server });

const wsserver = new WebSocket.Server({ port: 3001 }, () => {
  console.log("server started");
});

let clients = [];

const reply = (socket, data) => {
  socket.send(JSON.stringify(data));
};

wsserver.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log("Message: %s", message);
    socket.send(message);
  });

  socket.on("close", () => {
    if (socket.username) {
      delete clients[socket.from];
    }
  });
});

// server.listen(3001);
