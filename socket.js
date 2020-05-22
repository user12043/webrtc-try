let ws;

const send = (obj) => {
  const message = {
    from: username.value,
    to: remoteUsername.value
  };

  message.data = btoa(JSON.stringify(obj));
  ws.send(JSON.stringify(message));
};

const connect = () => {
  ws = new WebSocket(serverAddress.value);
  registerEvents();
};

const registerEvents = () => {
  ws.onopen = () => {
    console.log("websocket open");
    header.innerHTML = "connected to server";
    ws.send(JSON.stringify({ from: username.value, data: "merheba" }));
  };

  ws.onmessage = (m) => {
    // parse message
    const message = JSON.parse(m.data);
    if (message.data === "siye de merheba") {
      console.log("connected to server");
      return;
    }
    const data = JSON.parse(atob(message.data));
    message.data = data;
    console.log("message: ", message);
    switch (data.type) {
      case "offer":
        onReceiveOffer(data);
        break;
      case "answer":
        onReceiveAnswer(data);
        break;
      case "candidate":
        console.log("received ice candidate", data);
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        break;
    }
  };
};
