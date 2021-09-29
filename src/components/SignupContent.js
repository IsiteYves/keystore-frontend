import Axios from "axios";
import TextField from "@material-ui/core/TextField";
import { Component } from "react";
import { Redirect } from "react-router-dom";
import validator from "validator";

export default class SignupContent extends Component {
  state = {
    userData: {
      email: "",
      username: "",
      password: "",
      confirmationPassword: "",
    },
    response: "",
    uid: "",
    aww: false,
    errors: [],
    display: "none",
  };
  handleFieldChange = (e) => {
    const { name, value } = e.target;
    this.setState({ userData: { ...this.state.userData, [name]: value } });
  };

  addToErrors = (err) => {
    this.setState({
      errors: [...this.state.errors, `${err}`],
    });
  };

  async handleSubmit(e) {
    e.preventDefault();
    const { username, password, confirmationPassword } = this.state.userData;
    await this.setState({ errors: [], response: "" });
    this.setState({ ...this.state, display: "block" });
    await Axios.post(
      "https://keystore-backend.herokuapp.com/users/checkEmail",
      this.state.userData
    )
      .then(async (res) => {
        this.setState({ ...this.state, display: "none" });
        if (res.data.found) {
          this.addToErrors("Email already taken.");
        } else {
          if (!validator.isEmail(this.state.userData.email)) {
            this.addToErrors("Please provide a valid email.");
          } else if (username.length < 3) {
            this.addToErrors(
              "Your username must be at least 3 characters long."
            );
          } else if (username.length > 30) {
            this.addToErrors("Your username must not go beyond 30 characters");
          } else if (password.length > 50) {
            this.addToErrors("The password must not go beyond 30 characters");
          } else if (password.length < 6) {
            this.addToErrors(
              "Your password must be at least 6 characters long."
            );
          } else if (password !== confirmationPassword) {
            this.addToErrors("You must confirm the password correctly.");
          } else {
            this.setState({ ...this.state, display: "block" });
            await Axios.post(
              "https://keystore-backend.herokuapp.com/users/signup",
              this.state.userData
            )
              .then((res) => {
                this.setState({ ...this.state, display: "none" });
                const { message, uid } = res.data;
                this.setState({
                  userData: {
                    email: "",
                    username: "",
                    password: "",
                    confirmationPassword: "",
                  },
                  response: message,
                  uid,
                  aww: true,
                });
              })
              .catch((err) => this.addToErrors("Connection Failed"));
          }
        }
      })
      .catch((err) => this.addToErrors("Connection Failed"));
  }
  render() {
    const { email, username, password, confirmationPassword } =
      this.state.userData;
    return (
      <div className="Signup__Content">
        <form
          action="/"
          autoComplete="off"
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <h2>{this.state.response.message}</h2>
          <p>
            Welcome to <span>keystore</span>! Create your account for free to
            start securing and tracking your various media account!
          </p>
          {this.state.errors.length !== 0 && (
            <div>
              {this.state.errors.map((error, ind) => (
                <p className="form__error" key={ind}>
                  {error}
                </p>
              ))}
            </div>
          )}
          {this.state.response && (
            <p className="form__response">{this.state.response}</p>
          )}
          {this.state.aww && (
            <Redirect to={"/confirm-email/" + this.state.uid} />
          )}
          <div className="input__field">
            <TextField
              type="email"
              name="email"
              variant="outlined"
              label="Email"
              value={email}
              onChange={(e) => this.handleFieldChange(e)}
              required
            />
          </div>
          <div className="input__field">
            <TextField
              type="text"
              name="username"
              variant="outlined"
              label="Username"
              value={username}
              onChange={(e) => this.handleFieldChange(e)}
              required
            />
          </div>
          <div className="input__field">
            <TextField
              type="password"
              name="password"
              variant="outlined"
              label="Create Password"
              value={password}
              onChange={(e) => this.handleFieldChange(e)}
              required
            />
          </div>
          <div className="input__field">
            <TextField
              type="password"
              name="confirmationPassword"
              variant="outlined"
              label="Confirm Password"
              value={confirmationPassword}
              onChange={(e) => this.handleFieldChange(e)}
              required
            />
          </div>
          <div className="Loader" style={{ display: this.state.display }}></div>
          <div className="input__field">
            <input type="submit" name="login-btn" value="Register" />
          </div>
        </form>
      </div>
    );
  }
}
