import React, { Component } from "react";
import { Link } from "react-router-dom";
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
          <Link to="/">Logo</Link>
          <Link to="/sessions">Sessions</Link>
          <Link to="/new-session">New Session</Link>
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
