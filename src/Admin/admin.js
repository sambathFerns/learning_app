import React, { useState } from "react";
import "./style.css";

import Header2 from "../Components/Header2/Header2";
import Sidebar from "../Components/Sidebar/Sidebar";
import StreamPage from "./StreamPage";
import { Container, Row } from "react-bootstrap";
import Broadcast from "../Broadcast/Broadcast";

function Admin(props) {
  const [streamData, setStreamData] = useState(null);
  const [instance, setInstance] = useState(null);

  const getPlayerInstance = async (instance) => {
    console.log("instance");
    console.log(instance);
    setInstance(instance);
  };

  const handleStrartStream = (streamData) => {
    setStreamData(streamData);
  };

  return (
    <>
      <Header2 />
      <Sidebar />
      {!streamData ? (
        <StreamPage onStartStream={handleStrartStream} />
      ) : (
        <Broadcast channel={streamData} />
      )}
    </>
  );
}

export default Admin;
