import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer>
        <div className="btm">
           <div className="footer_img">
            <img src={require("../../Assets/logo_small.png")} />
           </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
