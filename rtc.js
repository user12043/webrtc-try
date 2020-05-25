let pc;

const call = async () => {
  if (!window.localStream || !pc) {
    await startSelf();
  }
  // send offer
  pc.createOffer().then((offer) => {
    pc.setLocalDescription(offer);
    console.log("sending offer");
    send(offer);
  });
};

const onReceiveOffer = async (receivedOffer) => {
  console.log("offer receive", receivedOffer);
  if (!window.localStream || !pc) {
    await startSelf();
  }
  pc.setRemoteDescription(new RTCSessionDescription(receivedOffer));
  log.value = JSON.stringify(receivedOffer);
  // answer
  await pc.createAnswer().then((answer) => {
    pc.setLocalDescription(answer);
    console.log("answer created: ", answer);
    send(answer);
  });
};

const onReceiveAnswer = async (receivedAnswer) => {
  console.log("answer receive", receivedAnswer);
  pc.ontrack = onTrack;
  await pc.setRemoteDescription(new RTCSessionDescription(receivedAnswer));
  log.value = JSON.stringify(receivedAnswer);
};

const onTrack = async (event) => {
  console.log("Add track");
  remoteVideo.srcObject = event.streams[0];
  selfVideo.srcObject = localStream;
};

const onIceCandidate = async (event) => {
  if (event.candidate) {
    console.log("ICE candidate");
    send({
      type: "candidate",
      candidate: event.candidate
    });
  }
};

const hangup = () => {
  if (pc) {
    pc.close();
    pc = null;
  }
  localStream.getTracks().forEach((t) => t.stop());
  delete localStream;
};
