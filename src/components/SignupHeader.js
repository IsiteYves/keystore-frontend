import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

export default class LoginHeader extends Component {
  state = {};
  render() {
    return (
      <div className="Header">
        <div className="Header__sub">
          <div>KS</div>
          <div>keystore</div>
        </div>
        <div className="Header__sub">
          <Link to="/login">Login</Link>
        </div>
      </div>
    );
  }
}
