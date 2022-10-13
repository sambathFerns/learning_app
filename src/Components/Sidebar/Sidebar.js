import React, { useEffect, useState } from "react";
import "./Sidebar.css";

import * as Md from "react-icons/md";
import * as Bs from "react-icons/bs";
import * as Ri from "react-icons/ri";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const [isWidth, setIsWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setIsWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    
    if (isWidth <= 991) {
        console.log('set');
    } 

    return () => {
      window.removeEventListener("resize", handleResize);
    };

    
  }, [setIsWidth]);
//   console.log("width", isWidth);

  return (
    <>
      <div className="sidebar" style={{ width: isOpen ? "250px" : "70px" }}>
        <div className="nav-btn" onClick={toggle}>
          <i>
            {" "}
            {isOpen ? (
              <Bs.BsFillArrowLeftCircleFill />
            ) : (
              <Bs.BsFillArrowRightCircleFill />
            )}
          </i>
        </div>
        <nav>
          <ul className="nav-menu">
            <li className="nav-items select">
              <a href="#" className="d-flex">
                <i>
                  <Md.MdClass />
                </i>
                <p style={{ opacity: isOpen ? "1" : "0" }}>Create Class</p>
              </a>
            </li>
            <li className="nav-items">
              <a href="#" className="d-flex">
                <i>
                  <Md.MdOutlinePeopleOutline />
                </i>
                <p style={{ opacity: isOpen ? "1" : "0" }}>Manage Students</p>
              </a>
            </li>
            <li className="nav-items">
              <a href="#" className="d-flex">
                <i>
                  <Ri.RiUser2Fill />
                </i>
                <p style={{ opacity: isOpen ? "1" : "0" }}>Manage Staffs</p>
              </a>
            </li>
            <li className="nav-items">
              <a href="#" className="d-flex">
                <i>
                  <Md.MdGppGood />
                </i>
                <p style={{ opacity: isOpen ? "1" : "0" }}>Subscriptions</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
