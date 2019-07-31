import React, { Component } from "react";
import { withRouter } from "react-router";

import Auth from "../auth/auth";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleCurrentUser = mentor => {
    this.props.handleCurrentUser(mentor);
  };

  handleSuccessfulLogin = () => {
    this.props.handleSuccessfulLogin();
    this.props.history.push("/");
  };

  handleUnsuccessfulLogin = () => {
    this.props.handleUnsuccessfulLogin();
  };

  render() {
    return (
      <div className="homepage-wrapper">
        <div className="video-container" />
        <Auth
          handleSuccessfulLogin={this.handleSuccessfulLogin}
          handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
          handleCurrentUser={this.handleCurrentUser}
          errorText={this.props.errorText}
        />
      </div>
    );
  }
}

export default withRouter(Login);
