import { Component } from "react";
import Axios from "axios";
import { Link, Redirect } from "react-router-dom";
import "../styles/Notfound.css";

class ConfirmedEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: props.match.params.uid,
      cdHash: props.match.params.cdHash,
      validURL: true,
    };
  }
  async componentDidMount() {
    document.title = "Keystore | Email successfully confirmed";
    const { uid, cdHash } = this.state;
    await Axios.post(
      "https://keystore-backend.herokuapp.com/users/validate-uid-cdHash",
      {
        uid,
        cdHash,
        action: "signup",
      }
    )
      .then((res) => {
        console.log(cdHash);
        this.setState({ validURL: res.data.URLValid });
      })
      .catch((err) => console.error(err));
  }
  render() {
    return (
      <>
        {!this.state.validURL && <Redirect to="/login" />}
        <div className="ConfirmedEmail">
          <div className="Middle">
            <h2>Email confimed!</h2>
            <p>You've successfully finished registering your account.</p>
            <Link to="/login">Continue</Link>
          </div>
        </div>
      </>
    );
  }
}

export default ConfirmedEmail;
