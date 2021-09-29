import axios from "axios";
import { Component } from "react";
import io from "socket.io-client";
import TextField from "@material-ui/core/TextField";
import { Link, Redirect } from "react-router-dom";

export default class Resetpassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: props.match.params.uid,
      cdHash: props.match.params.cdHash,
      validURL: true,
      newpassword: "",
      npasswordconfirm: "",
      display1: "flex",
      display: "none",
      loaderDisplay: "none",
      errors: [],
    };
  }
  async componentDidMount() {
    document.title = "Keystore | Change password";
    const { uid, cdHash } = this.state;
    this.setState({ ...this.state, loaderDisplay: "block" });
    await axios
      .post(
        "https://keystore-backend.herokuapp.com/users/validate-uid-cdHash",
        {
          uid,
          cdHash,
          action: "reset",
        }
      )
      .then((res) => {
        this.setState({ ...this.state, loaderDisplay: "none" });
        this.setState({ validURL: res.data.URLValid });
      })
      .catch((err) =>
        this.setState({ ...this.state, errors: ["Connection Failed"] })
      );
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const { uid, newpassword, npasswordconfirm } = this.state;
    if (newpassword.length < 6)
      this.setState({
        ...this.state,
        errors: ["New password must be at least 6 characters long."],
      });
    else if (newpassword.length > 20)
      this.setState({
        ...this.state,
        errors: ["New password must not go beyond 30 characters"],
      });
    else if (newpassword !== npasswordconfirm)
      this.setState({
        ...this.state,
        errors: ["Confirm new password correctly"],
      });
    else {
      this.setState({ ...this.state, errors: [], loaderDisplay: "block" });
      await axios
        .post("https://keystore-backend.herokuapp.com/users/changepassword", {
          uid,
          newpassword,
        })
        .then((res) => {
          this.setState({ ...this.state, loaderDisplay: "none" });
          if (res.data.already_changed)
            this.setState({ ...this.state, errors: ["Token Expired"] });
          else
            this.setState({ ...this.state, display1: "none", display: "flex" });
        })
        .catch((err) =>
          this.setState({ ...this.state, errors: ["Connection Failed"] })
        );
    }
  };
  render() {
    return (
      <>
        {!this.state.validURL && <Redirect to="/login" />}
        <div className="Forgot__page" style={{ display: this.state.display1 }}>
          <div className="Forgot__Content">
            <form
              action="/"
              autoComplete="off"
              onSubmit={(e) => this.handleSubmit(e)}
            >
              <p>
                Type in your new password and confirm it then click{" "}
                <span>Done</span>.
              </p>
              {this.state.errors.length !== 0 && (
                <p className="form__error">{this.state.errors[0]}</p>
              )}
              <div className="input__field">
                <TextField
                  type="password"
                  name="newpassword"
                  variant="outlined"
                  label="New password"
                  required
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div className="input__field">
                <TextField
                  type="password"
                  name="npasswordconfirm"
                  variant="outlined"
                  label="Retype new password"
                  required
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div className="text-right">
                <Link to="/login">Shift to Login</Link>
              </div>
              <div
                className="Loader"
                style={{ display: this.state.loaderDisplay }}
              ></div>
              <div className="input__field">
                <input type="submit" name="next-btn" value="Done" />
              </div>
            </form>
          </div>
        </div>
        <div className="ConfirmedEmail" style={{ display: this.state.display }}>
          <div className="Middle">
            <h2>Password changed</h2>
            <p>You've successfully changed your password.</p>
            <Link to="/login">Continue</Link>
          </div>
        </div>
      </>
    );
  }
}
