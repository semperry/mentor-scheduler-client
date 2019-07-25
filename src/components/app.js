// Clean up new session form (toggle edit mode)
import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";

import Home from "./pages/home";
import NavBar from "./navigation/navbar";
import Sessions from "./pages/sessions";
import NewSessionForm from "./pages/newSessionForm";
import Login from "./pages/login";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      current_user: "",
      errorText: ""
    };
  }

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
    // Write conditional to check for cookie
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
      this.props.history.push("/");
    }
  };

  componentDidMount() {
    this.checkLoginStatus();
  }

  authorizedRoutes() {}

  render() {
    console.log("current user: ", this.state.current_user);
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
                  <Route exact path="/" component={Home} />

                  <Route
                    path="/sessions"
                    render={props => (
                      <Sessions
                        {...props}
                        current_user={this.state.current_user}
                      />
                    )}
                  />

                  <Route path="/new-session" component={NewSessionForm} />

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
