import React from "react";
import { withRouter } from "react-router";

import Auth from "../auth/auth";

const Login = props => {
  const handleCurrentUser = mentor => {
    props.handleCurrentUser(mentor);
  };

  const handleSuccessfulLogin = () => {
    props.handleSuccessfulLogin();
    props.history.push("/");
  };

  const handleUnsuccessfulLogin = () => {
    props.handleUnsuccessfulLogin();
  };

  return (
    <div className="homepage-wrapper">
      <div className="video-container" />
      <Auth
        handleSuccessfulLogin={handleSuccessfulLogin}
        handleUnsuccessfulLogin={handleUnsuccessfulLogin}
        handleCurrentUser={handleCurrentUser}
      />
    </div>
  );
};

export default withRouter(Login);
