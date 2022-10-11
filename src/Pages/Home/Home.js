import React, { useRef } from "react";
import { Container, Row } from "react-bootstrap";
import Header from "../../Components/Header/Header";

import "./Home.css";

function Home() {
  return (
    <>
      <Header />
      <section className="pro_view">
        <Container>
          <Row>
            <div className="col-lg-4 col-md-4 col-sm-4">
              <div className="profile">
                <div className="card pro-card">
                  <div className="pic">
                    <div className="profPic">
                      <img src={require("../../Assets/avatar1.png")} />
                    </div>
                  </div>
                  <h3>Edward Stern</h3>
                  <p>edwardstern@gmail.com</p>
                  <h4>748596650</h4>
                  <div className="stId">
                    <p>Student Id: <span>A564JU</span></p>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            <div className="col-lg-8 col-md-8 col-sm-8 pro-cont">
              <h1>We are here to provide the best  Live Classes</h1>
              <p>Kami akan selalu ada untuk menampilkan hunian terbaik untuk anda serta memberikan hunian atau tempat berteduh untuk orang yang sangat di sayangi dan juga di cintai</p>
              <div className="class_banner">
                <img src={require('../../Assets/classes.png')}/>
              </div>
            </div>
          </Row>
        </Container>
      </section>
      <section className="AllLives">
        <Container>
          <Row>
            <div className="col-sm-4 col-md-4 col-lg-4">
              <div className="card live_card">
                <Row>
                  <div className="col-6"></div>
                  <div className="col-6"></div>
                </Row>
              </div>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4"></div>
            <div className="col-sm-4 col-md-4 col-lg-4"></div>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
