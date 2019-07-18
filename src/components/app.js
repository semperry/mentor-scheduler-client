import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/home";
import NavBar from "./navigation/navbar";
import Sessions from "./pages/sessions";
import NewSession from "./pages/newSession";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app">
        <div>
          <BrowserRouter>
            <div className="dashboard-layout-wrapper">
              <NavBar />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/sessions" component={Sessions} />
                <Route path="/new-session" component={NewSession} />
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
