import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { Container, Row } from "react-bootstrap";
import * as Ai from "react-icons/ai";
import * as Bs from "react-icons/bs";
import "video.js/dist/video-js.css";
import { useParams } from "react-router-dom";
import $ from "jquery";
import { endpoints } from "../../endpoints/endpoints";
import { Navigate } from "react-router";
import IVSPlayer from "../Player/IvsPlayer";

import "./Live.css";
import VideoJS from "../../Components/Player/VideoJs";

function Live(props) {
  // const videoJsOptions = {
  //   autoplay: false,
  //   fluid: true,
  //   playbackRates: [0.5, 1, 1.25, 1.5, 2],
  //   responsive: true,
  //   controls: true,
  //   fill: true,
  //   loop: true,
  //   sources: [
  //     {
  //       src: "https://62417c80f148.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.300996695197.channel.B0KlX9sLPQ0A.m3u8",
  //       type: "application/x-mpegURL",
  //     },
  //   ],
  // };

  return (
    <>
      <Header />
      <section className="allLives">
        <Container>
          <Row>
            <div className="col-lg-8 col-md-12 col-sm-12 ">
              <div className="screen">
                <IVSPlayer />
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="chat">
                <h3>
                  Live Chat <Ai.AiFillMessage />
                </h3>
                <div className="chat-btm">
                  <input
                    className="chat_input"
                    placeholder="Chat here.."
                  ></input>
                  <button className="upload">
                    <Ai.AiOutlinePaperClip />
                  </button>
                  <button className="emoji">
                    <Bs.BsFillEmojiSmileFill />
                  </button>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
}

export default Live;
