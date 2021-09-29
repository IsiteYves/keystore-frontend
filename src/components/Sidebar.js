import Axios from "axios";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import StorageOutlined from "@material-ui/icons/StorageOutlined";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import ArrowDropDownCircle from "@material-ui/icons/ArrowDropDownCircle";
import "../styles/Home.css";
import { Redirect } from "react-router-dom";
import CancelOutlined from "@material-ui/icons/Close";

const socket = io.connect("https://keystore-backend.herokuapp.com");

function Sidebar(props) {
  const authToken = localStorage.getItem("kystTkn"),
    [authUser, setAuthUser] = useState({ username: "..." }),
    [imageRepresentor, setImageRepresentor] = useState(""),
    [signedIn, setSignedIn] = useState(true),
    [display, setDisplay] = useState(""),
    { disp, option } = props;
  const verifyToken = async () => {
    await Axios.post(
      "https://keystore-backend.herokuapp.com/users/verify-token",
      {
        authToken,
      }
    )
      .then((res) => {
        if (!res.data.found) setSignedIn(false);
        else {
          const { user } = res.data,
            { username } = user;
          setAuthUser(user);
          let representor;
          if (username.split(" ").length > 1) {
            let usernameSplit = username.split(" ");
            representor = usernameSplit[0][0] + usernameSplit[1][0];
          } else representor = username[0] + username[1];
          setImageRepresentor(representor.toUpperCase());
        }
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    verifyToken();
  }, [authToken]);
  useEffect(() => {
    setDisplay(disp);
  }, [disp]);
  return (
    <div className="Sidebar" style={{ display }}>
      {!signedIn && <Redirect to="/login" />}
      <section className="Cancel">
        <CancelOutlined onClick={() => props.setSidebarDisplay("none")} />
      </section>
      <div>
        <div>{imageRepresentor}</div>
        <p>{authUser.username}</p>
      </div>
      <Link to="/" className={option === "stored" ? "active" : ""}>
        <div>
          <StorageOutlined />
        </div>
        <div>Stored</div>
      </Link>
      <Link to="/profile" className={option === "profile" ? "active" : ""}>
        <div title="Verified">
          <VerifiedUser />
        </div>
        <div>Profile</div>
      </Link>
      <div
        onClick={(e) => {
          e.stopPropagation();
          socket.emit("signedOut", { email: authUser.email });
        }}
      >
        <div>
          <ArrowDropDownCircle />
        </div>
        <div>Logout</div>
      </div>
    </div>
  );
}

export default Sidebar;
