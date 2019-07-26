import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: ""
    };
  }

  handleSuccessfulLogout = () => {
    this.props.handleSuccessfulLogout();
    this.props.history.push("/login");
  };

  componentDidMount() {
    this.setState({
      loggedInStatus: this.props.loggedInStatus
    });
  }

  render() {
    console.log("logged in status: ", this.props.loggedInStatus);
    return (
      <div className="navigation-wrapper">
        <div className="nav-links-wrapper">
          <NavLink to="/">Logo</NavLink>
          <NavLink to="/sessions">Sessions</NavLink>
          <NavLink to="/new-session">New Session</NavLink>
        </div>
        <div className="navigation-search-form-wrapper" />
        {this.props.loggedInStatus === "LOGGED_IN" ? (
          <div className="sign-out-nav-link">
            <a onClick={this.handleSuccessfulLogout}>Logout Icon</a>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(NavBar);
