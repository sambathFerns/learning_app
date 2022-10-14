import React, { useEffect, useRef, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import CamMicSelectionWidget from "./settings";
import * as Fa from "react-icons/fa";
import * as Bs from "react-icons/bs";
import * as Md from "react-icons/md";
import * as Ri from "react-icons/ri";

import noCameraImage from "../Assets/no-camera.png";
import "./Broadcast.scss";

function Broadcast(props) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [showCamWidget, setShowCamWidget] = useState(false);
  const [videoDeviceId, setVideoDeviceId] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [audioDeviceId, setAudioDeviceId] = useState(null);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [isVideoMute, setIsVideoMute] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);

  const canvasRef = useRef();

  useEffect(() => {
    createClient();
  }, []);

  // Set initial config for our broadcast
  const config = {
    ingestEndpoint: "62417c80f148.global-contribute.live-video.net",
    streamConfig: window.IVSBroadcastClient.BASIC_LANDSCAPE,
    logLevel: window.IVSBroadcastClient.LOG_LEVEL.DEBUG,
  };
  const camMicChanged = async (deviceData) => {
    if (deviceData.video) {
      setVideoDeviceId(deviceData.video.deviceId);
    }
    if (deviceData.audio) {
      setAudioDeviceId(deviceData.audio.deviceId);
    }
    setShowCamWidget(false);
    await handleVideoDeviceSelect_IVSClient(deviceData.video.deviceId);
    await handleAudioDeviceSelect_IVSClient(deviceData.audio.deviceId);
  };

  const checkPermission = async () => {
    let permissions = {
      audio: false,
      video: false,
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      for (const track of stream.getTracks()) {
        track.stop();
      }

      permissions = { video: true, audio: true };
    } catch (err) {
      permissions = { video: false, audio: false };
      console.error(err.message);
    }
    // If we still don't have permissions after requesting them display the error message
    if (!permissions.video) {
      console.error("Failed to get video permissions.");
    } else if (!permissions.audio) {
      console.error("Failed to get audio permissions.");
    }

    return permissions;
  };

  //const client = IVSBroadcastClient.create(config);
  function setError(message) {
    if (Array.isArray(message)) {
      message = message.join("<br/>");
    }
    const errorEl = document.getElementById("error");
    errorEl.innerHTML = message;
  }

  // Get all audio/video devices.
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

  async function getCamera(deviceId, maxWidth, maxHeight) {
    let media;
    const videoConstraints = {
      deviceId: deviceId ? { exact: deviceId } : null,
      width: {
        max: maxWidth,
      },
      height: {
        max: maxHeight,
      },
    };
    try {
      // Let's try with max width and height constraints
      media = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: true,
      });
    } catch (e) {
      // and fallback to unconstrained result
      delete videoConstraints.width;
      delete videoConstraints.height;
      media = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
      });
    }
    return media;
  }

  // Handle video device retrieval
  async function handleVideoDeviceSelect(vId) {
    const id = "camera";
    //const videoSelectEl = document.getElementById("video-devices");
    const { videoDevices } = await getDevices();
    if (window.broadcastClient.getVideoInputDevice(id)) {
      window.broadcastClient.removeVideoInputDevice(id);
    }
    console.dir(videoDevices);
    console.dir(vId);
    if (!vId) {
      setVideoDeviceId(videoDevices[0].deviceId);
      setVideo(videoDevices[0]);
    } else {
      // Get the option's video
      const selectedDevice = videoDevices.find(
        (device) => device.deviceId === vId
      );
      console.log("selectedDevice : " + selectedDevice);
      const deviceId = selectedDevice ? selectedDevice.deviceId : null;
      console.log("deviceId : " + deviceId);
      const { width, height } = config.streamConfig.maxResolution;
      const cameraStream = await getCamera(deviceId, width, height);
      console.log("cameraStream : " + cameraStream);
      // Add the camera to the top
      await window.broadcastClient.addVideoInputDevice(cameraStream, id, {
        index: 0,
      });
      console.log("end");
    }
  }

  // Handle audio device retrieval
  async function handleAudioDeviceSelect() {
    const id = "microphone";
    // const audioSelectEl = document.getElementById("audio-devices");
    const { audioDevices } = await getDevices();
    if (window.client.getAudioInputDevice(id)) {
      window.client.removeAudioInputDevice(id);
    }
    console.dir(audioDevices);
    console.dir(audioDeviceId);
    // if (audioSelectEl.value.toLowerCase() === "none") return;
    const selectedDevice = audioDevices.find(
      (device) => device.deviceId === audioDeviceId
    );
    // Unlike video, for audio we default to "None" instead of the first device
    if (selectedDevice) {
      const microphoneStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedDevice.deviceId,
        },
      });
      await window.client.addAudioInputDevice(microphoneStream, id);
    }
  }

  // Handle the enabling/disabling of buttons

  // Helper to create an instance of the AmazonIVSBroadcastClient
  async function createClient() {
    window.broadcastClient = window.IVSBroadcastClient.create({
      streamConfig: window.IVSBroadcastClient.BASIC_LANDSCAPE,
    });

    await handleVideoDeviceSelect_IVSClient(videoDeviceId);
    await handleAudioDeviceSelect_IVSClient(audioDeviceId);
    // await addEventIvsEventListener();
    previewVideo();
  }

  async function handleVideoDeviceSelect_IVSClient(vId) {
    let permission = await checkPermission();
    if (!permission.video) {
      const image = new Image();
      image.src = noCameraImage;
      window.broadcastClient.addImageSource(image, "no-camera", { index: 0 });
      return;
    }
    if (
      window.broadcastClient &&
      window.broadcastClient.getVideoInputDevice("camera1")
    ) {
      window.broadcastClient.removeVideoInputDevice("camera1");
    }
    let vDevice = window.broadcastClient.getVideoInputDevice("camera1");
    if (vDevice && vDevice.name === "camera1") {
      window.broadcastClient.removeVideoInputDevice("camera1");
    }

    const devices = await navigator.mediaDevices.enumerateDevices();

    window.videoDevices = devices.filter((d) => d.kind === "videoinput");

    if (window.videoDevices && window.videoDevices.length == 0) {
      const image = new Image();
      image.src = noCameraImage;
      window.broadcastClient.addImageSource(image, "no-camera", { index: 0 });
      return;
    }

    let selectedDeviceId = vId ? vId : window.videoDevices[0].deviceId;
    setVideoDeviceId(selectedDeviceId);
    window.selectedVideoDeviceId = selectedDeviceId;
    let constraints = {
      video: {
        deviceId: selectedDeviceId,
        width: {
          ideal: config.streamConfig.maxResolution.width,
          max: config.streamConfig.maxResolution.width,
        },
        height: {
          ideal: config.streamConfig.maxResolution.height,
          max: config.streamConfig.maxResolution.height,
        },
      },
    };
    window.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    // console.info(window.videoStream);

    if (window.broadcastClient)
      window.broadcastClient.addVideoInputDevice(
        window.videoStream,
        "camera1",
        { index: 0 }
      );

    previewVideo();
  }

  async function handleAudioDeviceSelect_IVSClient(deviceId) {
    let permission = await checkPermission();
    if (!permission.audio) return;
    const id = "microphone";
    if (
      window.broadcastClient &&
      window.broadcastClient.getAudioInputDevice(id)
    ) {
      console.info(window.broadcastClient.getAudioInputDevice(id));
      window.broadcastClient.removeAudioInputDevice(id);
    }
    const devices = await navigator.mediaDevices.enumerateDevices();

    window.audioDevices = devices.filter((d) => d.kind === "audioinput");

    let selectedAudioDeviceId = deviceId
      ? deviceId
      : window.audioDevices[0].deviceId;
    window.selectedAudioDeviceId = selectedAudioDeviceId;
    setAudioDeviceId(selectedAudioDeviceId);
    const audioParams = { audio: true };
    window.audioStream = await navigator.mediaDevices.getUserMedia(audioParams);
    window.broadcastClient.addAudioInputDevice(window.audioStream, id);
  }

  async function startCapture() {
    try {
      if (
        window.broadcastClient &&
        window.broadcastClient.getVideoInputDevice("camera1")
      ) {
        window.broadcastClient.removeVideoInputDevice("camera1");
      }
      let constraints1 = {
        video: {
          deviceId: null,
          width: {
            ideal: config.streamConfig.maxResolution.width,
            max: config.streamConfig.maxResolution.width,
          },
          height: {
            ideal: config.streamConfig.maxResolution.height,
            max: config.streamConfig.maxResolution.height,
          },
        },
      };
      window.videoStream = await navigator.mediaDevices.getDisplayMedia(
        constraints1
      );
      setVideo(window.videoStream);
      if (window.broadcastClient) {
        window.broadcastClient.addVideoInputDevice(
          window.videoStream,
          "camera1",
          { index: 0 }
        );
        // window.broadcastClient.addAudioInputDevice(window.microphoneStream, "mic1");
        previewVideo();
        window.videoStream
          .getVideoTracks()[0]
          .addEventListener("ended", async () => {
            await handleVideoDeviceSelect_IVSClient(videoDeviceId);
          });
      }

      //dumpOptionsInfo(captureStream);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    // return captureStream;
  }

  //   function dumpOptionsInfo(stream) {
  //   const videoTrack = stream.getVideoTracks()[0];
  //   console.info("Track settings:");
  //   console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  //   console.info("Track constraints:");
  //   console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
  // }

  async function updateAudio(status) {
    let permission = await checkPermission();
    if (!permission.audio) return;
    if (window.audioStream) {
      if (status) {
        window.audioStream.getAudioTracks()[0].enabled = false;
      } else {
        window.audioStream.getAudioTracks()[0].enabled = true;
        //await handleAudioDeviceSelect_IVSClient(audioDeviceId);
      }
    }

    setIsAudioMute(!isAudioMute);
  }

  async function updateVideo(hide) {
    let permission = await checkPermission();
    if (!permission.video) return;

    console.log(videoDeviceId);
    console.log(window.selectedVideoDeviceId);
    //console.dir(client);
    console.log(hide);
    console.dir(window.videoStream);
    if (hide) {
      window.videoStream.getVideoTracks()[0].enabled = false;
      const image = new Image();
      // image.src = "http://localhost:3000/assets/no-camera.png";
      image.src = noCameraImage;
      window.broadcastClient.addImageSource(image, "no-camera", { index: 0 });
    } else {
      window.broadcastClient.removeImage("no-camera");
      window.videoStream.getVideoTracks()[0].enabled = true;
    }
    await setIsVideoMute(hide);
    previewVideo();
  }

  const previewVideo = () => {
    const previewEl = document.getElementById("preview");
    window.broadcastClient.attachPreview(previewEl);
  };

  const toggleBroadcast = () => {
    if (!window.isBroadcasting) {
      startBroadcast();
    } else {
      stopBroadcast();
    }
  };

  async function startBroadcast() {
    //const key = "sk_ap-south-1_tOQlEmkLjmNd_eOPUX7whyZCwkhXJooJz2otusY48bL";
    const key = props.channel.streamkey;
    const endpoint = config.ingestEndpoint;
    const streamBtn = document.getElementById("stream-btn");

    if (!key && !endpoint) {
      alert("Please enter a Stream Key and Ingest Endpoint!");
    } else {
      await window.broadcastClient
        .startBroadcast(key, endpoint)
        .then(() => {
          streamBtn.innerHTML = "Stop Stream";
          streamBtn.classList.add("btn-focus");
          window.isBroadcasting = true;
        })
        .catch((error) => {
          streamBtn.innerHTML = "Start Stream";
          streamBtn.classList.remove("btn-focus");
          window.isBroadcasting = false;
          // offline();
          console.error(error);
        });
    }
  }

  const stopBroadcast = async () => {
    const streamBtn = document.getElementById("stream-btn");
    await window.broadcastClient.stopBroadcast();
    streamBtn.innerHTML = "Start Stream";
    streamBtn.classList.remove("btn-focus");
    window.isBroadcasting = false;
    // offline();
    // window.removeEventListeners(props.player);
  };

  const init = async () => {
    //await handlePermissions();
    //await getDevices();
    // window.broadcastClient = IVSBroadcastClient.create({
    //   streamConfig: IVSBroadcastClient.STANDARD_LANDSCAPE,
    // });
    // await createVideoStream();
    // await createAudioStream();
    // previewVideo();
  };

  const handlePermissions = async () => {
    let permissions = { video: true, audio: true };
    try {
      await navigator.mediaDevices.getUserMedia(permissions);
    } catch (err) {
      console.error(err.message);
      permissions = { video: false, audio: false };
    }
    if (!permissions.video) console.error("Failed to get video permissions.");
    if (!permissions.audio) console.error("Failed to get audio permissions.");
  };

  return (
    <>
      <div style={{ margin: "0 auto", width: "800px", marginTop: "15px" }}>
        <div className="center">
          <div style={{ textAlign: "center" }}>
            <div className="container">
              <canvas id="preview"></canvas>
            </div>
          </div>

          <div id="controls-toolbar" className="controls-toolbar-wrapper">
            {isAudioMute ? (
              <OverlayTrigger
                key="top1"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`} className="tooltip-style">
                    UnMute
                  </Tooltip>
                }
              >
                <div style={{ display: "inline-block" }}>
                  <Button
                    variant="secondary"
                    className="btn btn-circle btn-sm btn-focus"
                    onClick={() => {
                      updateAudio(true);
                    }}
                  >
                    <i className="material-icons-round">
                      <Bs.BsFillMicMuteFill />
                    </i>
                  </Button>
                </div>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                key="top1"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`} className="tooltip-style">
                    Mute
                  </Tooltip>
                }
              >
                <div style={{ display: "inline-block" }}>
                  <Button
                    variant="secondary"
                    className="btn btn-circle btn-sm"
                    onClick={() => {
                      updateAudio(false);
                    }}
                  >
                    <i
                      className="material-icons-round"
                      style={{ width: "30px" }}
                    >
                      <Bs.BsFillMicFill />
                    </i>
                  </Button>
                </div>
              </OverlayTrigger>
            )}

            {isVideoMute ? (
              <OverlayTrigger
                key="top2"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`} className="tooltip-style">
                    Show camera
                  </Tooltip>
                }
              >
                <div style={{ display: "inline-block" }}>
                  <Button
                    variant="secondary"
                    className="btn btn-circle btn-sm btn-focus"
                    onClick={() => {
                      updateVideo(false);
                    }}
                  >
                    <i className="material-icons-round">
                      <Ri.RiCameraOffFill />
                    </i>
                  </Button>
                </div>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                key="top2"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`} className="tooltip-style">
                    Hide camera
                  </Tooltip>
                }
              >
                <div style={{ display: "inline-block" }}>
                  <Button
                    variant="secondary"
                    className="btn btn-circle btn-sm"
                    onClick={() => {
                      updateVideo(true);
                    }}
                  >
                    <i
                      className="material-icons-round"
                      style={{ width: "30px" }}
                    >
                      <Ri.RiCameraFill />
                    </i>
                  </Button>
                </div>
              </OverlayTrigger>
            )}

            <OverlayTrigger
              key="top3"
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`} className="tooltip-style">
                  Share your screen
                </Tooltip>
              }
            >
              <div style={{ display: "inline-block" }}>
                <Button
                  variant="secondary"
                  className="btn btn-circle btn-sm"
                  onClick={() => {
                    startCapture();
                  }}
                >
                  <i className="material-icons-round">
                    <Md.MdScreenShare />
                  </i>
                </Button>
              </div>
            </OverlayTrigger>

            {/* <OverlayTrigger
              key="top4"
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`} className="tooltip-style">
                  Open settings
                </Tooltip>
              }
            > */}
            <div style={{ display: "inline-block" }}>
              <Button
                variant="secondary"
                className="btn btn-circle btn-sm"
                onClick={() => {
                  setShowCamWidget(true);
                }}
              >
                <i className="material-icons-round">
                  <Md.MdSettings />
                </i>
              </Button>
            </div>
            {/* </OverlayTrigger> */}

            <button
              type="button"
              id="stream-btn"
              className="btn btn-circle btn-action stream-btn btn-primary"
              onClick={() => {
                toggleBroadcast();
              }}
            >
              {/* <i
            className="material-icons-round"
          >
            stream
          </i> */}
              <span>Start Stream</span>
            </button>
          </div>
        </div>
      </div>
      {showCamWidget && (
        <CamMicSelectionWidget
          onSubmit={camMicChanged}
          onClose={() => {
            setShowCamWidget(false);
          }}
          audioDeviceId={audioDeviceId}
          videoDeviceId={videoDeviceId}
        />
      )}
    </>
  );
}

export default Broadcast;
