import React, { useRef, useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import * as Fa from "react-icons/fa";
import Hamburger from "hamburger-react";

import "bootstrap/dist/css/bootstrap.min.css";

import "./Header.css";
import { Link } from "@mui/material";

function Header() {
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
            <div className="navbar-logo">
              <a href="/classes">
                <img src={require("../../Assets/logo_main.png")} />
              </a>
            </div>

            <nav
              className={click ? "navbar active" : "navbar"}
              onClick={handleClick}
            >
              <a className="nav-item active" href="#">
                Classes
              </a>
              <a className="nav-item" href="#">
                Profile
              </a>
              <a className="nav-item" href="/admin">
                Admin Panel
              </a>
            </nav>
            <div id="responsive">
              <i onClick={handleClick}>
                <Hamburger />
              </i>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}

export default Header;
