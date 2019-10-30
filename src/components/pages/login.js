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
      <div className="video-container">
        <video
          autoPlay
          loop
          src="https://s3.amazonaws.com/bottega-devcamp/videos/B-Roll_1.mp4"
        ></video>
      </div>
      <Auth
        handleSuccessfulLogin={handleSuccessfulLogin}
        handleUnsuccessfulLogin={handleUnsuccessfulLogin}
        handleCurrentUser={handleCurrentUser}
      />
    </div>
  );
};

export default withRouter(Login);
