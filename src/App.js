import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { userActions } from "./redux/slices/user-slice";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ConfirmEmail from "./pages/ConfirmEmail";
import Resetpassword from "./pages/Resetpassword";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import io from "socket.io-client";
import ForgotPassword from "./components/Forgotpassword";
import ConfirmedEmail from "./pages/ConfirmedEmail";
import Notfound from "./pages/Notfound";

const socket = io.connect("https://keystore-backend.herokuapp.com");

function App() {
  const [signedIn, setSignedIn] = useState(false),
    authToken = localStorage.getItem("kystTkn");
  // dispatch = useDispatch();
  useEffect(() => {
    socket.on("signedIn", (user) => {
      setSignedIn(true);
      // dispatch(userActions.setUser(user));
    });
    socket.on("signedOut", () => {
      setSignedIn(false);
    });
    verifyToken();
  }, [authToken]);
  const verifyToken = async () => {
    await Axios.post(
      "https://keystore-backend.herokuapp.com/users/verify-token",
      {
        authToken,
      }
    ).then((res) => {
      if (res.data.found) setSignedIn(true);
      else {
        setSignedIn(false);
        localStorage.removeItem("kystTkn");
      }
    });
  };
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route
            path="/"
            exact
            render={() => {
              if (signedIn) return <Home socket={socket} axios={Axios} />;
              else return <Redirect to="/login" />;
            }}
          />
          <Route
            path="/login"
            exact
            render={() => {
              if (signedIn) return <Redirect to="/" />;
              else return <Login socket={socket} />;
            }}
          />
          <Route
            path="/signup"
            exact
            render={() => {
              if (signedIn) return <Redirect to="/" />;
              else return <Signup />;
            }}
          />
          <Route path="/confirm-email/:uid" exact component={ConfirmEmail} />
          <Route
            path="/email-confirmed/:uid/:cdHash"
            component={ConfirmedEmail}
          />
          <Route path="/forgotpassword" exact>
            <ForgotPassword axios={Axios} />
          </Route>
          <Route
            path="/password-reset/:uid/:cdHash"
            exact
            component={Resetpassword}
          />
          <Route
            path="/profile"
            exact
            component={() => {
              if (signedIn) return <Profile />;
              else return <Redirect to="/login" />;
            }}
          />
          <Route>
            <Notfound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
