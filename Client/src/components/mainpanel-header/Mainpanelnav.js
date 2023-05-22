import React, { useState, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Mainpanelnav.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/context";

function Mainpanelnav() {
  const [showLogoutBtn, setShowLogoutBtn] = useState(false);
  const navigate = useNavigate();
  const myModal = useContext(AppContext);
  let url = window.location.href;
  let splitUrl = url.split("/");
  let title = splitUrl[splitUrl.length - 1];
  if (title === "") {
    title = "Commercial Properties";
  }
  const logoutHandle = () => {
    localStorage.removeItem("token");
    myModal.isLogin = false;
    navigate("/", { replace: true });
  };
  const showLogoutButton = () => {
    if (showLogoutBtn === false) {
      setShowLogoutBtn(true);
    } else {
      setShowLogoutBtn(false);
    }
  };

  return (
    <div>
      <div className="mainpanel-nav d-flex justify-content-between">
        <p style={{ fontSize: "21px", textTransform: "capitalize" }}>
          {title.replace("-", " ")}
        </p>
        <FaUserCircle className="mainpanel-icon" onClick={showLogoutButton} />
      </div>
      <div
        className="logoutbtn"
        onClick={logoutHandle}
        style={
          showLogoutBtn ? { visibility: "visible" } : { visibility: "hidden" }
        }
      >
        Logout
      </div>
    </div>
  );
}

export default Mainpanelnav;
