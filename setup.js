serverAddress.value = "ws://" + (location.hostname || "localhost") + ":3001";

const detectDevices = (deviceInfos) => {
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const element = document.createElement("option");
    element.value = deviceInfo.deviceId;
    if (deviceInfo.kind === "videoinput") {
      element.innerText =
        deviceInfo.label || `camera ${videoDevices.length + 1}`;
      videoDevices.add(element);
    } else if (deviceInfo.kind === "audioinput") {
      element.innerText =
        deviceInfo.label || `microphone ${audioDevices.length + 1}`;
      audioDevices.add(element);
    }
  }
};

navigator.mediaDevices
  .getUserMedia({ audio: true, video: true })
  .then((stream) => {
    window.localStream = stream;
    return navigator.mediaDevices.enumerateDevices();
  })
  .then(detectDevices)
  .then(() => {
    window.localStream.getTracks().forEach((t) => t.stop());
  })
  .catch((error) => console.log("Error detecting devices", error));

const startSelf = async () => {
  if (!pc) {
    pc = new RTCPeerConnection();
    pc.onicecandidate = onIceCandidate;
    pc.ontrack = onTrack;
  }

  if (videoCheck.checked && !videoDevices.value) {
    videoDevices.selectedIndex = 0;
  }

  if (audioCheck.checked && !audioDevices.value) {
    audioDevices.selectedIndex = 0;
  }
  const vDevId = videoDevices.value;
  const aDevId = audioDevices.value;
  const constraints = {};
  if (videoCheck.checked) {
    constraints.video = { deviceId: vDevId ? { exact: vDevId } : undefined };
  }
  if (audioCheck.checked) {
    constraints.audio = { deviceId: aDevId ? { exact: aDevId } : undefined };
  }
  await navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      window.localStream = stream;
      pc.addStream(window.localStream);
      selfVideo.srcObject = window.localStream;
    })
    .catch((error) => console.log("Error start self", error));
};
