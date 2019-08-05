// TODO: Not authorized and no match
// TODO: Set error text for login page
// TODO: use of hookrouter instead of browserrouter
// TODO: Expire cookie sooner
// TODO: isLoading
// TODO: truncate scrollbox lists (endless scroll)
import React, { useState, useEffect } from "react";
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

const App = () => {
  const [loggedInStatus, setLoggedInStatus] = useState("NOT_LOGGED_IN");
  const [currentUser, setCurrentUser] = useState("");

  const checkCompletedSessions = () => {
    axios
      .get("https://rec-scheduler-api.herokuapp.com/sessions")
      // .get("http://localhost:4000/sessions")
      .then(res => {
        setSessions(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleCurrentUser = mentor => {
    setCurrentUser(mentor);
  };

  const handleSuccessfulLogin = () => {
    setLoggedInStatus("LOGGED_IN");
  };

  const handleUnsuccessfulLogin = () => {
    setLoggedInStatus("NOT_LOGGED_IN");
  };

  const handleSuccessfulLogout = () => {
    axios
      .delete(
        `https://rec-scheduler-api.herokuapp.com/sessions/delete/${Cookie.get(
          "sesh"
        )}`
      )
      // .delete(`http://localhost:4000/sessions/delete/${Cookie.get("sesh")}`)
      .then(res => {
        if (res.status === 200) {
          Cookie.remove("sesh");
        } else {
          console.log("del res: ", res);
        }
      });
    setLoggedInStatus("NOT_LOGGED_IN");
    setCurrentUser("");
  };

  const handleGetUser = email => {
    axios
      .get(`https://rec-scheduler-api.herokuapp.com/mentors/email/${email}`)
      // .get(`http://localhost:4000/mentors/email/${email}`)
      .then(res => setCurrentUser(res.data))
      .then(() => setLoggedInStatus("LOGGED_IN"));
  };

  const checkLoginStatus = () => {
    if (Cookie.get("sesh") && loggedInStatus === "NOT_LOGGED_IN") {
      axios
        .get(
          `https://rec-scheduler-api.herokuapp.com/sessions/${Cookie.get(
            "sesh"
          )}`
        )
        // .get(`http://localhost:4000/sessions/${Cookie.get("sesh")}`)
        .then(res => {
          if (res.status === 200) {
            handleGetUser(res.data.email);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if (!Cookie.get("sesh")) {
      return;
    } else if (Cookie.get("sesh") && loggedInStatus === "LOGGED_IN") {
      checkCompletedSessions();
      props.history.push("/");
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="app">
      <div>
        <BrowserRouter>
          <div className="dashboard-layout-wrapper">
            {loggedInStatus === "LOGGED_IN" ? (
              <NavBar
                loggedInStatus={loggedInStatus}
                handleSuccessfulLogout={handleSuccessfulLogout}
              />
            ) : null}
            {loggedInStatus === "LOGGED_IN" ? (
              <Switch>
                <Route
                  exact
                  path="/"
                  path="/"
                  render={props => (
                    <Home {...props} currentUser={currentUser} />
                  )}
                />

                <Route
                  path="/sessions"
                  render={props => (
                    <Sessions {...props} currentUser={currentUser} />
                  )}
                />
                {currentUser.role === "admin" ? (
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
                      handleSuccessfulLogin={handleSuccessfulLogin}
                      handleUnsuccessfulLogin={handleUnsuccessfulLogin}
                      handleCurrentUser={handleCurrentUser}
                    />
                  )}
                />

                <Route
                  path="/login"
                  render={props => (
                    <Login
                      {...props}
                      handleSuccessfulLogin={handleSuccessfulLogin}
                      handleUnsuccessfulLogin={handleUnsuccessfulLogin}
                      handleCurrentUser={handleCurrentUser}
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
};

export default App;
