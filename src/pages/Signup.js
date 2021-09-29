import { Component } from "react";
import SignupHeader from "../components/SignupHeader";
import SignupContent from "../components/SignupContent";

export default class Signup extends Component {
  componentDidMount() {
    document.title = "Keystore | Register";
  }
  render() {
    return (
      <>
        <SignupHeader />
        <SignupContent />
      </>
    );
  }
}
