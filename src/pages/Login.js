import { Component } from "react";
import LoginHeader from "../components/LoginHeader";
import LoginContent from "../components/LoginContent";

export default class Login extends Component {
  componentDidMount() {
    document.title = "Keystore | Login";
  }
  render() {
    return (
      <>
        <LoginHeader />
        <LoginContent socket={this.props.socket} />
      </>
    );
  }
}
