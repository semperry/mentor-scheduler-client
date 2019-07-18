import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  constructor(){
    super();
  }

  render() {
    return(
    <div className="navigation-wrapper">
      <div className="nav-links-wrapper">
        <Link to="/">Logo</Link>
        <Link to="/sessions">Sessions</Link>
        <Link to="/new-session">New Session</Link>
      </div>
      <div className="navigation-search-form-wrapper"></div>
      <div className="sign-out-nav-link">
        <Link to="/logout">Logout Icon</Link>
    </div>
    </div>
    )
  }
}