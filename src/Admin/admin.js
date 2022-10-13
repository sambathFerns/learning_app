import React from "react";
import "./style.css";

import Header2 from "../Components/Header2/Header2";
import Sidebar from "../Components/Sidebar/Sidebar";
import StreamPage from "./StreamPage";
import { Container, Row } from "react-bootstrap";

function admin() {
  return (
    <>
      <Header2 />
      <Sidebar />
      <StreamPage />
    </>
  );
}

export default admin;
