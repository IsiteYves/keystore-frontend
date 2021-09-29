import { Component } from "react";
import Axios from "axios";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";

class LoginContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: [],
      display: "none",
    };
  }
  async componentDidMount() {
    const authToken = localStorage.getItem("kystTkn");
    this.setState({ ...this.state, display: "block" });
    await Axios.post(
      "https://keystore-backend.herokuapp.com/users/verify-token",
      {
        authToken,
      }
    )
      .then((res) => {
        this.setState({ ...this.state, display: "none" });
        if (!res.data.found) localStorage.removeItem("kystTkn");
      })
      .catch((err) => this.addToErrors("Connection Failed"));
  }

  handleFieldChange = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.setState({ ...this.state, display: "block" });
    await Axios.post("https://keystore-backend.herokuapp.com/users/login", {
      email,
      password,
    })
      .then((res) => {
        this.setState({ ...this.state, display: "none" });
        let a = res.data.message;
        if (a === 0) this.addToErrors("Email not registered.");
        else if (a === 1)
          this.addToErrors("Please verify your email first, before you login.");
        else if (a === 2) this.addToErrors("Incorrect password.");
        else if (a === 3) {
          const { user } = res.data;
          this.setState({ ...this.state, errors: [] });
          let authToken = "kystTkn " + res.data.token;
          localStorage.setItem("kystTkn", authToken);
          this.props.socket.emit("signedIn", { user });
        } else console.error("Unexpected error");
      })
      .catch((err) => this.addToErrors("Connection Failed"));
  };

  addToErrors = (err) => {
    this.setState({
      errors: [`${err}`],
    });
  };

  render() {
    return (
      <div className="Login__Content">
        <form
          action="/"
          autoComplete="off"
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <p>
            Welcome back. Log into your <span>keystore</span> account to keep
            tracking your accounts!
          </p>
          {this.state.errors.length !== 0 && (
            <p className="form__error">{this.state.errors[0]}</p>
          )}
          <div className="input__field">
            <TextField
              type="email"
              name="email"
              variant="outlined"
              label="Email"
              onChange={(e) => this.handleFieldChange(e)}
              rowsMax="5"
              required
            />
          </div>
          <div className="input__field">
            <TextField
              type="password"
              name="password"
              variant="outlined"
              label="Password"
              onChange={(e) => this.handleFieldChange(e)}
              maxLength="20"
              required
            />
          </div>
          <div className="text-right">
            <Link to="/forgotpassword">Forgot password?</Link>
          </div>
          <div className="Loader" style={{ display: this.state.display }}></div>
          <div className="input__field">
            <input type="submit" name="login-btn" value="Sign in" />
          </div>
        </form>
      </div>
    );
  }
}

export default LoginContent;
