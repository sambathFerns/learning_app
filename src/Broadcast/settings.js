/*global OT*/
import React, { useEffect, useState } from "react";
import { Button, Modal, Col, Row, Badge } from "react-bootstrap";
import Webcam from "react-webcam";
import Select from "react-select";
import * as Fa from "react-icons/fa";


import "./settings.css";
import camPlaceHolder from "../Assets/camplaceholder.jpeg";

const CamMicSelectionWidget = ({
  onClose,
  onSubmit,
  audioDeviceId,
  videoDeviceId,
  consultationIsLive,
}) => {
  const [mediaPermission, setMediaPermission] = useState("");
  const [videoOptions, setVideoOptions] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [micOptions, setMicOptions] = useState([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState(null);
  const audioContextRef = React.useRef();
  useEffect(() => {
    checkCamMicUserPermission(async (permission) => {
      if (permission) {
        setMediaPermission("allow");
        const { videoDevices, audioDevices } = await getDevices();
        // console.log("videoDevices");
        // console.dir(videoDevices);
        // console.dir(videoDeviceId);
        // console.log("audioDevices");
        // console.dir(audioDevices);
        // console.dir(audioDeviceId);

        if (audioDevices && audioDevices.length > 0) {
          let index = audioDevices.findIndex(
            (value) => value.deviceId === audioDeviceId
          );
          if (index > 0) setSelectedMicrophone(audioDevices[index]);
          else setSelectedMicrophone(audioDevices[0]);
        } else {
          setSelectedMicrophone(audioDevices[0]);
        }

        if (videoDevices && videoDevices.length > 0) {
          let index = videoDevices.findIndex(
            (value) => value.deviceId === videoDeviceId
          );
          if (index > 0) setSelectedCamera(videoDevices[index]);
          else setSelectedCamera(videoDevices[0]);
        } else {
          setSelectedCamera(videoDevices[0]);
        }

        setVideoOptions([...videoDevices]);
        setMicOptions([...audioDevices]);
      } else {
        setMediaPermission("deny");
      }
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedMicrophone) {
      navigator.mediaDevices
        .getUserMedia({
          audio: { deviceId: selectedMicrophone.deviceId },
        })
        .then(function (stream) {
          analizeMicFrequency(stream);
        });
    }
    // eslint-disable-next-line
  }, [selectedMicrophone]);

  const checkCamMicUserPermission = (callback) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        callback(true);
      })
      .catch(function (err) {
        callback(false);
      });
  };

  const closeBtn = (
    <Fa.FaTimesCircle
      onClick={() => close()}
      className="widgetClose"
    />
  );

  const videoCameraHandler = (event) => {
    setSelectedCamera(event);
  };

  const microphoneHandler = (event) => {
    setSelectedMicrophone(event);
  };

  const close = () => {
    audioContextRef &&
      audioContextRef.current &&
      audioContextRef.current.suspend();
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const analizeMicFrequency = (mediaStream) => {
    const volumeMeter = document.getElementById("volumeMeter");
    audioContextRef &&
      audioContextRef.current &&
      audioContextRef.current.suspend();
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(mediaStream);
    const streamNode = audioCtx.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 32;
    source.connect(analyser);
    analyser.connect(streamNode);
    streamNode.connect(audioCtx.destination);
    audioContextRef.current = audioCtx;

    streamNode.onaudioprocess = function () {
      var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(frequencyArray);
      let totalFrequency = 0;
      for (var i = 0; i < frequencyArray.length; i++) {
        totalFrequency += frequencyArray[i];
      }
      let frequencyPercentage =
        totalFrequency / 20 > 100 ? 100 : totalFrequency / 20;
      if (volumeMeter) {
        volumeMeter.style.clipPath = `inset(${
          100 - frequencyPercentage
        }% 0 0 0)`;
      }
    };
  };

  const submit = () => {
    audioContextRef &&
      audioContextRef.current &&
      audioContextRef.current.suspend();
    if (typeof onSubmit === "function") {
      onSubmit({
        audio: selectedMicrophone,
        video: selectedCamera,
      });
    }
  };

  //###################################################

  // Set initial config for our broadcast
  // const config = {
  //     ingestEndpoint: "https://g.webrtc.live-video.net:4443",
  //     streamConfig: window.IVSBroadcastClient.BASIC_LANDSCAPE,
  //     logLevel: window.IVSBroadcastClient.LOG_LEVEL.DEBUG
  //   };

  // Handle video device retrieval
  //   async function handleVideoDeviceSelect() {
  //     const id = "camera";
  //     const videoSelectEl = document.getElementById("video-devices");
  //     const { videoDevices: devices } = await getDevices();
  //     if (window.client.getVideoInputDevice(id)) {
  //       window.client.removeVideoInputDevice(id);
  //     }

  //     // Get the option's video
  //     const selectedDevice = devices.find(
  //       (device) => device.deviceId === videoSelectEl.value
  //     );
  //     const deviceId = selectedDevice ? selectedDevice.deviceId : null;
  //     const { width, height } = config.streamConfig.maxResolution;
  //     const cameraStream = await getCamera(deviceId, width, height);

  //     // Add the camera to the top
  //     await window.client.addVideoInputDevice(cameraStream, id, {
  //       index: 0,
  //     });
  //   }

  // Handle audio/video device enumeration
  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");
    if (!videoDevices.length) {
      setError("No video devices found.");
    }
    const audioDevices = devices.filter((d) => d.kind === "audioinput");
    if (!audioDevices.length) {
      setError("No audio devices found.");
    }

    return { videoDevices, audioDevices };
  }

  function setError(message) {
    if (Array.isArray(message)) {
      message = message.join("<br/>");
    }
    const errorEl = document.getElementById("error");
    errorEl.innerHTML = message;
  }
  //###################################################
  return (
    <Modal show={true} centered>
      <Modal.Header close={closeBtn} className="modalHeading">
        Change Camera / Microphone Settings
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg={6} md={12} className="cameraContainer">
            {mediaPermission === "allow" && videoOptions.length > 0 ? (
              <Webcam
                audio={false}
                screenshotFormat="image/jpg"
                videoConstraints={selectedCamera}
                mirrored={false}
                className="camVideo"
              />
            ) : (
              <img src={camPlaceHolder} alt="Camera Error" width="100%"></img>
            )}
            {micOptions.length > 0 && (
              <canvas id="volumeMeter" className="audioRate"></canvas>
            )}
          </Col>
          <Col lg={6} md={12} className="camMicSelectorContainer">
            <div>
              <Fa.FaCamera
                color={"#ff0000"}
                className="align-middle deviceIcon me-2"
              />
              <b>Camera</b>
              <div className="deviceDropdown">
                <Select
                  menuPlacement="auto"
                  options={videoOptions}
                  value={[selectedCamera]}
                  placeholder="Select Camera"
                  onChange={(event) => videoCameraHandler(event)}
                />
                {mediaPermission === "deny" && (
                  <Badge color="danger" className="noDeviceBadge">
                    Camera Permission Needed
                  </Badge>
                )}
                {videoOptions.length === 0 && mediaPermission === "allow" ? (
                  <Badge color="danger" className="noDeviceBadge">
                    No Camera Detected
                  </Badge>
                ) : null}
              </div>
            </div>
            <div>
              <Fa.FaMicrophone
                color={"#ff0000"}
                className="align-middle deviceIcon me-2"
              />
              <b>Microphone</b>
              <div className="deviceDropdown">
                <Select
                  menuPlacement="auto"
                  options={micOptions}
                  placeholder="Select Microphone"
                  value={[selectedMicrophone]}
                  onChange={(event) => microphoneHandler(event)}
                />
                {mediaPermission === "deny" && (
                  <Badge color="danger" className="noDeviceBadge">
                    Microphone Permission Needed
                  </Badge>
                )}
                {micOptions.length === 0 && mediaPermission === "allow" ? (
                  <Badge color="danger" className="noDeviceBadge">
                    No Microphone Detected
                  </Badge>
                ) : null}
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <div className="buttonContainer">
            <Button
              className="actionButton bg-red-gradiant text-white"
              onClick={submit}
            >
              Ok
            </Button>{" "}
            <Button
              variant="dark"
              className="actionButton bg-dark-gradiant text-white"
              onClick={close}
            >
              Cancel
            </Button>
          </div>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default CamMicSelectionWidget;
