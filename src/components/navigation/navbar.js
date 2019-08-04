import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const NavBar = props => {
  const [loggedInStatus, setLoggedInStatus] = useState(props.loggedInStatus);

  const handleSuccessfulLogout = () => {
    props.handleSuccessfulLogout();
    props.history.push("/login");
  };

  return (
    <div className="navigation-wrapper">
      <div className="nav-links-wrapper">
        <Link to="/">
          <FontAwesomeIcon icon="home" />
        </Link>
        <Link to="/sessions">Sessions</Link>
        <Link to="/new-session">New Session</Link>
      </div>
      <div className="navigation-search-form-wrapper" />
      {loggedInStatus === "LOGGED_IN" ? (
        <div className="sign-out-nav-link">
          <a onClick={handleSuccessfulLogout}>
            <FontAwesomeIcon icon="sign-out-alt" /> Logout
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(NavBar);
