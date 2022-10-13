import styled from "@emotion/styled";
import React from "react";
import { Col, Form, Container, Row } from "react-bootstrap";

function StreamPage() {
  const style = {
    width: "500px",
    height: "auto",
    padding: "10px",
  };
  return (
    <>
      <section className="streamManager" style={{ paddingTop: "50px" }}>
        <Container>
          <div className="form-page" style={{ ...style }}>
            <h2>Stream Data</h2>
            <form>
              <Form.Group  className="form-group">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  required
                />
              </Form.Group>
              <Form.Group className="form-group">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control text-grey-900 font-xss ls-3 text-white"
                  placeholder="Description" 
                />
              </Form.Group>
              <button className="Stream_btn">Start Stream</button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}

export default StreamPage;
