import { registerIVSQualityPlugin, registerIVSTech } from "amazon-ivs-player";
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import io from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_API_BASE_URL);

const IVSPlayer = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [socketActiveEvent, setSocketActiveEvent] = useState({});

  const wasmWorkerPath =
    "https://ferns-it.com/videojs/assets/amazon-ivs-wasmworker.min.js";
  const wasmBinaryPath =
    "https://ferns-it.com/videojs/assets/amazon-ivs-wasmworker.min.wasm";

  const playbackUrl =
    "https://62417c80f148.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.300996695197.channel.B0KlX9sLPQ0A.m3u8";

  const channelArn = "arn:aws:ivs:ap-south-1:300996695197:channel/B0KlX9sLPQ0A";

  let options = {
    techOrder: ["AmazonIVS"],
    muted: false,
    fluid: true,
    responsive: true,
    controls: true,
    fill: true,
    loop: false,
    sources: [
      {
        src: playbackUrl,
        type: "application/x-mpegURL",
      },
    ],
  };

  useEffect(() => {
    socket.on("ivs-stream", (data) => {
      setSocketActiveEvent({ event: "ivs-stream", data: data });
    });
    initializePlayer();
  }, [videoRef]);

  useEffect(() => {
    handleSocketEvent();
  }, [socketActiveEvent]);

  const initializePlayer = () => {
    //your code to be executed after 10 second
    const script = document.createElement("script");
    script.src =
      "https://player.live-video.net/1.12.0/amazon-ivs-videojs-tech.min.js";
    script.id = "amazon-ivs";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (playerRef.current) {
        const player = playerRef.current;
        console.log("PLAYER", player);
        player.src(options.sources);
        onReady();
        return;
      }
      registerIVSTech(videojs, {
        wasmWorker: wasmWorkerPath,
        wasmBinary: wasmBinaryPath,
      });
      registerIVSQualityPlugin(videojs);
      const videoElement = videoRef.current;
      if (!videoElement) return;
      console.dir(videoElement);
      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("Player is ready to use!");
        player.autoplay(true);
        player.aspectRatio("16:9");
        player.src(options.sources);
        onReady();
      }));
    };
  };

  const onReady = () => {
    let player = playerRef.current;
    if (!player) return;
    let playerEvent = player.getIVSEvents().PlayerEventType;
    console.log(playerEvent);
    let playerState = player.getIVSEvents().PlayerState;
    console.log(playerState);
    player.getIVSPlayer().addEventListener(playerState.ERROR, () => {
      console.log("PLAYER HAS ERROR !!");
    });
    player.getIVSPlayer().addEventListener(playerState.ENDED, () => {
      player.reset();
      
      return;
    });
  };

  const handleSocketEvent = () => {
    if (socketActiveEvent === "") return;
    switch (socketActiveEvent.event) {
      case "ivs-stream":
        const result = socketActiveEvent.data["data"];
        console.dir(result);
        console.log("arn : " + channelArn);
        console.log("resource arn : " + result.resources[0]);
        if (channelArn === result.resources[0]) {
          const ivs_channel = result.detail.channel_name;
          const ivs_stream = result.detail.stream_id;
          const event_name = result.detail.event_name;
          console.log("ivs_channel : " + ivs_channel);
          console.log("ivs_event : " + event_name);
          console.log("ivs_stream : " + ivs_stream);
          console.log(playerRef.current);
          if (playerRef.current && event_name === "Stream Start") {
            console.log(event_name);
            playerRef.current.src(options.sources);
            playerRef.current.autoplay(true);
          } else if (playerRef.current && event_name === "Stream End") {
            console.log(event_name);
          }
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className="video-style">
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        className="video-js vjs-default-skin vjs-big-play-centered"
      ></video>
    </div>
  );
};

export default IVSPlayer;
