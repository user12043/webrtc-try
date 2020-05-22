const WebSocket = require("ws");
const https = require("https");
const fs = require("fs");

const server = https.createServer({
  cert: fs.readFileSync("server.cert"),
  key: fs.readFileSync("server.key")
});

/* const wsserver = new WebSocket.Server({ port: 3001 }, () => {
  console.log("server started");
}); */

const wsserver = new WebSocket.Server({ server });

let clients = [];

wsserver.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log("Message: %s", message);

    let data;
    try {
      data = JSON.parse(message);
    } catch (error) {
      console.log("Invalid JSON");
      data = {};
      return;
    }

    if (!data.from || data.from === "") {
      console.log("unknown sender");
      return;
    }

    if (!clients[data.from]) {
      console.log("client add: ", data.from);
      clients[data.from] = socket;
    }

    if (data.data === "merheba") {
      socket.send(JSON.stringify({ data: "siye de merheba" }));
      clients[data.from] = socket;
      return;
    }

    if (data.to) {
      const target = clients[data.to];
      if (target) {
        console.log("forwarding to " + data.to);
        // console.log(target);
        target.send(message);
      }
    }
  });

  // socket.on("close", () => {
  //   if (socket.username) {
  //     delete clients[socket.from];
  //   }
  // });
});

server.listen(3001, "0.0.0.0");
