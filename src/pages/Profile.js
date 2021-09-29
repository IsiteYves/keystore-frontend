import Axios from "axios";
import { useEffect, useState, memo } from "react";
import MenuOutlined from "@material-ui/icons/MenuOutlined";
import Sidebar from "../components/Sidebar";

const Profile = memo(() => {
  document.title = "Keystore | Your profile";
  const authToken = localStorage.getItem("kystTkn"),
    [authUser, setAuthUser] = useState({}),
    [dateRegistered, setDateRegistered] = useState({}),
    [sidebarDisplay, setSidebarDisplay] = useState(""),
    [errors, setErrors] = useState([]),
    [loaderDisplay, setLoaderDisplay] = useState("none"),
    verifyToken = async () => {
      setLoaderDisplay("block");
      await Axios.post(
        "https://keystore-backend.herokuapp.com/users/verify-token",
        {
          authToken,
        }
      )
        .then((res) => {
          setLoaderDisplay("none");
          setAuthUser(res.data.user);
          setDateRegistered(res.data.user.dateRegistered);
        })
        .catch((err) => {
          setErrors(["Connection Failed"]);
        });
    };
  let hour = parseInt(dateRegistered.hour, 10),
    dayTime;
  if (hour >= 12) dayTime = "PM";
  else dayTime = "AM";
  const controlResize = () => {
    let { clientWidth } = document.documentElement;
    if (clientWidth > 800) setSidebarDisplay("flex");
    else setSidebarDisplay("none");
  };
  useEffect(() => {
    verifyToken();
    let { clientWidth } = document.documentElement;
    if (clientWidth > 800) setSidebarDisplay("flex");
    else setSidebarDisplay("none");
  }, [authToken]);
  window.onresize = () => {
    let { clientWidth } = document.documentElement;
    if (clientWidth > 800) setSidebarDisplay("flex");
    else setSidebarDisplay("none");
  };
  return (
    <div className="Home">
      <Sidebar
        disp={sidebarDisplay}
        setSidebarDisplay={setSidebarDisplay}
        option="profile"
      />
      <section className="Responsive_Header">
        <MenuOutlined
          onClick={() => {
            setSidebarDisplay("flex");
          }}
        />
      </section>
      <div className="Profile Objective">
        <h2>Your keystore profile</h2>
        <div>
          <div>
            <p>Username</p>
            <p>{authUser.username}</p>
          </div>
          <div>
            <p>Email</p>
            <p>{authUser.email}</p>
          </div>
          <div>
            <p>Date registered</p>
            <p>
              {dateRegistered.month +
                " " +
                dateRegistered.date +
                ", " +
                dateRegistered.year}
            </p>
          </div>
          <div>
            <p>Registered on</p>
            <p>{dateRegistered.day}</p>
          </div>
          <div>
            <p>Time registered</p>
            <p>
              {dateRegistered.hour}:{dateRegistered.minute + ` ${dayTime}`}
            </p>
          </div>
        </div>
        {errors.length !== 0 && <p className="form__error">{errors[0]}</p>}
        <div className="Loader" style={{ display: loaderDisplay }}></div>
      </div>
    </div>
  );
});

export default Profile;
