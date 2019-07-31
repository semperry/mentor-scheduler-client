// TODO: Clean up console log statements
// TODO: Not authorized and no match
// TODO: Refactor to call students and mentors once, filter within the components
// TODO: Require Submit notes before complete button. Add close session, push to sessions
import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTrash,
  faSignOutAlt,
  faEdit,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faHome, faTrash, faSignOutAlt, faEdit, faSpinner);

import Home from "./pages/home";
import NavBar from "./navigation/navbar";
import Sessions from "./pages/sessions";
import NewSessionForm from "./pages/newSessionForm";
import Login from "./pages/login";
import SessionNotes from "./pages/sessionNotes";
import Notes from "./pages/notes";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      current_user: "",
      errorText: "",
      sessions: []
    };
  }

  // Call sessions, check date, check against completed, flip flag false
  checkCompletedSessions = () => {
    axios
      .get("http://localhost:4000/sessions")
      .then(res => {
        this.setState({
          sessions: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleCurrentUser = mentor => {
    this.setState({
      current_user: mentor
    });
  };

  handleSuccessfulLogin = () => {
    this.setState({
      loggedInStatus: "LOGGED_IN",
      errorText: ""
    });
  };

  handleUnsuccessfulLogin = () => {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
      errorText: "Wrong Email or Password"
    });
  };

  handleSuccessfulLogout = () => {
    axios
      .delete(`http://localhost:4000/sessions/delete/${Cookie.get("sesh")}`)
      .then(res => {
        if (res.status === 200) {
          Cookie.remove("sesh");
        } else {
          console.log("del res: ", res);
        }
      });

    this.setState({
      loggedInStatus: "NOT_LOGGED_IN",
      current_user: ""
    });
  };

  handleGetUser = email => {
    axios.get(`http://localhost:4000/mentors/email/${email}`).then(res => {
      this.setState({
        current_user: res.data,
        loggedInStatus: "LOGGED_IN"
      });
    });
  };

  checkLoginStatus = () => {
    // Finsih logic here
    if (Cookie.get("sesh") && this.state.loggedInStatus === "NOT_LOGGED_IN") {
      axios
        .get(`http://localhost:4000/sessions/${Cookie.get("sesh")}`)
        .then(res => {
          if (res.status === 200) {
            this.handleGetUser(res.data.email);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if (!Cookie.get("sesh")) {
      return;
    } else if (
      Cookie.get("sesh") &&
      this.state.loggedInStatus === "LOGGED_IN"
    ) {
      this.checkCompletedSessions();
      this.props.history.push("/");
    }
  };

  componentDidMount() {
    this.checkLoginStatus();
  }

  render() {
    // console.log("current user: ", this.state.current_user);
    // console.log("current user: ", this.state.loggedInStatus);
    console.log("app session: ", this.state.sessions);
    return (
      <div className="app">
        <div>
          <BrowserRouter>
            <div className="dashboard-layout-wrapper">
              {this.state.loggedInStatus === "LOGGED_IN" ? (
                <NavBar
                  loggedInStatus={this.state.loggedInStatus}
                  handleSuccessfulLogout={this.handleSuccessfulLogout}
                  current_user={this.state.current_user}
                />
              ) : null}
              {this.state.loggedInStatus === "LOGGED_IN" ? (
                <Switch>
                  <Route
                    exact
                    path="/"
                    path="/"
                    render={props => (
                      <Home
                        {...props}
                        first_name={this.state.current_user.first_name}
                      />
                    )}
                  />

                  <Route
                    path="/sessions"
                    render={props => (
                      <Sessions
                        {...props}
                        current_user={this.state.current_user}
                      />
                    )}
                  />
                  {this.state.current_user.role === "admin" ? (
                    <Route path="/student/notes/:id" component={Notes} />
                  ) : null}

                  <Route path="/new-session" component={NewSessionForm} />

                  <Route path="/session-notes/:id" component={SessionNotes} />
                </Switch>
              ) : (
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={props => (
                      <Login
                        {...props}
                        handleSuccessfulLogin={this.handleSuccessfulLogin}
                        handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                        handleCurrentUser={this.handleCurrentUser}
                        errorText={this.state.errorText}
                      />
                    )}
                  />

                  <Route
                    path="/login"
                    render={props => (
                      <Login
                        {...props}
                        handleSuccessfulLogin={this.handleSuccessfulLogin}
                        handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                        handleCurrentUser={this.handleCurrentUser}
                        errorText={this.state.errorText}
                      />
                    )}
                  />
                </Switch>
              )}
            </div>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
