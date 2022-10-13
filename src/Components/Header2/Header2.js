import React, { useRef, useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import * as Fa from "react-icons/fa";
import Hamburger from "hamburger-react";

import "bootstrap/dist/css/bootstrap.min.css";

import "./Header2.css";

function Header2() {
  const navRef = useRef();

  const [click, setClick] = useState(false);

  function handleClick() {
    setClick((click) => !click);
    console.log(click, "click");
  }

  return (
    <>
      <header>
        <Container>
          <div className="navbar-area">
            <div className="navbar-logo d-flex">
              <img src={require("../../Assets/logo_main.png")} />
              <span>Admin</span>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}

export default Header2;
