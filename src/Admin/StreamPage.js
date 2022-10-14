import styled from "@emotion/styled";
import React, { useState } from "react";
import $ from "jquery";
import { Col, Form, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { endpoints } from "../endpoints/endpoints";
import Broadcast from "../Broadcast/Broadcast";

const StreamPage = ({ onStartStream, onStreamStopped }) => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [room, setRoom] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [profilecheck, setProfileCheck] = useState();

  const style = {
    width: "500px",
    height: "auto",
    padding: "10px",
  };

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const findFormErrors = () => {
    const { title, description } = form;
    const newErrors = {};
    // title errors
    if (!title || title === "") newErrors.title = "Title cannot be blank!";
    else if (title.length > 30) newErrors.title = "Title is too long!";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      startStreaming();
    }
  };

  const startStreaming = () => {
    setIsLoading(true);
    const loginResponse = JSON.parse(localStorage.getItem("loginResponse"));
    if (loginResponse && loginResponse.accessToken) {
      const { title, description } = form;
      const roomId = uuidv4();
      window.room = roomId;
      setRoom(roomId);
      const bodyFormData = new FormData();
      bodyFormData.append("title", title);
      bodyFormData.append("description", description);
      bodyFormData.append("room", roomId);
      bodyFormData.append("userId", loginResponse.userId);

      $.ajax({
        url: endpoints.startStream,
        dataType: "json",
        type: "post",
        contentType: false,
        processData: false,
        timeout: 8000,
        headers: {
          Authorization: "Bearer " + loginResponse.accessToken,
        },
        data: bodyFormData,
        success: (data, textStatus, jQxhr) => {
          if (data && data.channel) {
            onStartStream(data.channel);
            setIsLoading(false);
          }
        },
        error: (err) => {
          console.log("ERROR", err);
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <>
      <section className="streamManager" style={{ paddingTop: "50px" }}>
        <Container>
          <div className="form-page" style={{ ...style }}>
            <h2>Stream Data</h2>
            <form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  onChange={(e) => setField("title", e.target.value)}
                  isInvalid={!!errors.title}
                  required
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control text-grey-900 font-xss ls-3"
                  placeholder="Description"
                  onChange={(e) => setField("description", e.target.value)}
                  isInvalid={!!errors.description}
                />
              </Form.Group>
              <button type="submit" className="Stream_btn">
                Start Stream
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
};

export default StreamPage;
