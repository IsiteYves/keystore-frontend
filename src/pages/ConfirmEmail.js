import { Component } from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

export default class ConfirmEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: props.match.params.uid,
      uidRes: {},
      errors: [],
      confirmationCode: "",
      cT: false,
      display: "none",
    };
  }

  async componentDidMount() {
    this.setState({ ...this.state, display: "block" });
    await Axios.post(
      "https://keystore-backend.herokuapp.com/users/validate-uid",
      {
        uid: this.state.uid,
      }
    )
      .then((res) => {
        this.setState({ ...this.state, uidRes: res.data, display: "none" });
      })
      .catch((err) =>
        this.setState({ ...this.state, errors: ["Connection Failed"] })
      );
  }

  handleFieldChange = (e) => {
    const { name, value } = e.target;
    this.setState({ ...this.state, [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    await Axios.post(
      "https://keystore-backend.herokuapp.com/users/validate-c-code",
      {
        uid: this.state.uid,
        inc: this.state.confirmationCode,
        rc: this.state.uidRes.codeHash,
      }
    )
      .then((res) => {
        if (!res.data.message)
          this.setState({ ...this.setState, errors: ["Incorrect code"] });
        this.setState({ ...this.state, cT: res.data.message });
      })
      .catch((err) =>
        this.setState({ ...this.state, errors: ["Connection Failed"] })
      );
  };
  render() {
    document.title = "Confirm your email address";
    return (
      <>
        {this.state.uidRes.message === 0 && <Redirect to="/login" />}
        {this.state.cT && (
          <Redirect
            to={
              "/email-confirmed/" +
              this.state.uid +
              "/" +
              this.state.uidRes.codeHash
            }
          />
        )}
        <div className="ConfirmEmail__Content">
          <form
            action="/"
            autoComplete="off"
            onSubmit={(e) => this.handleSubmit(e)}
          >
            <p>
              An email confirmation code has been sent to your email. Enter it
              down below to finish setting up your account.
            </p>
            {this.state.errors.length !== 0 && (
              <p className="form__error">{this.state.errors[0]}</p>
            )}
            <div className="input__field">
              <TextField
                type="text"
                name="confirmationCode"
                variant="outlined"
                label="Received code"
                onChange={(e) => this.handleFieldChange(e)}
                required
              />
            </div>
            <div
              className="Loader"
              style={{ display: this.state.display }}
            ></div>
            <div className="input__field">
              <input type="submit" name="confirm-btn" value="Confirm Email" />
            </div>
          </form>
        </div>
      </>
    );
  }
}
