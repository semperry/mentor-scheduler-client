// TODO:
//  Feature to track missed sessions
//  Admin Dashboard
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
  faSpinner,
  faArchive
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faHome, faTrash, faSignOutAlt, faEdit, faSpinner, faArchive);

import Home from "./pages/home";
import NavBar from "./navigation/navbar";
import Sessions from "./pages/sessions";
import NewSessionForm from "./pages/newSessionForm";
import Login from "./pages/login";
import SessionNotes from "./pages/sessionNotes";
import Notes from "./pages/notes";
import NoMatch from "./pages/noMatch";

const App = () => {
  const [loggedInStatus, setLoggedInStatus] = useState("NOT_LOGGED_IN");
  const [currentUser, setCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
          "_scheduler_Session"
        )}`
      )
      // .delete(`http://localhost:4000/sessions/delete/${Cookie.get("_scheduler_Session")}`)
      .then(res => {
        Cookie.remove("_scheduler_Session");

        if (res.status === 200) {
        } else {
          console.log("del res: ", res);
        }
      })
      .catch(err => console.log("deleteSessionErr :", err));
    setLoggedInStatus("NOT_LOGGED_IN");
    setCurrentUser("");
    setIsLoading(false);
  };

  const handleGetUser = async email => {
    await axios
      .post("https://rec-scheduler-api.herokuapp.com/mentors/email", {
        email: email
      })
      // .post("http://localhost:4000/mentors/email", { email: email })
      .then(res => setCurrentUser(res.data))
      .then(() => setLoggedInStatus("LOGGED_IN"))
      .catch(err => console.log("handleGetUser Error", err));
  };

  const checkLoginStatus = () => {
    if (
      Cookie.get("_scheduler_Session") &&
      loggedInStatus === "NOT_LOGGED_IN"
    ) {
      axios
        .get(
          `https://rec-scheduler-api.herokuapp.com/sessions/${Cookie.get(
            "_scheduler_Session"
          )}`
        )
        // .get(
        //   `http://localhost:4000/sessions/${Cookie.get("_scheduler_Session")}`
        // )
        .then(res => {
          if (res.status === 200) {
            handleGetUser(res.data.email.split("--")[1]);
          }
        })
        .catch((res, err) => {
          Cookie.remove("_scheduler_Session");
        });
    } else if (!Cookie.get("_scheduler_Session")) {
      setIsLoading(false);
      return null;
    } else if (
      Cookie.get("_scheduler_Session") &&
      loggedInStatus === "LOGGED_IN"
    ) {
      setIsLoading(false);
      props.history.push("/");
    }
    setIsLoading(false);
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
                currentUser={currentUser}
              />
            ) : null}
            {loggedInStatus === "LOGGED_IN" ? (
              <Switch>
                <Route
                  exact
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

                <Route
                  path="/new-session"
                  render={props => (
                    <NewSessionForm
                      {...props}
                      roles={currentUser.roles}
                      currentUser={currentUser}
                    />
                  )}
                />

                <Route path="/student/notes/:id" component={Notes} />

                <Route path="/session-notes/:id" component={SessionNotes} />
                <Route component={NoMatch} />
              </Switch>
            ) : isLoading ? (
              <div className="home-loader">
                <FontAwesomeIcon
                  icon="spinner"
                  style={{
                    color: "#00cb78",
                    fontSize: "5em"
                  }}
                  spin
                />
              </div>
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
                  exact
                  path="/sessions"
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
