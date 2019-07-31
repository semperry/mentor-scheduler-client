// TODO: Break up into components, SessionsDetails, Assigned, Completed and pass info
import React, { Component } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import uuidv1 from "uuid";

export default class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      session: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const loginData = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("http://localhost:4000/mentors/login", loginData)
      .then(res => {
        if (res.status === 200) {
          this.props.handleCurrentUser(res.data);
          this.props.handleSuccessfulLogin();
          Cookie.set("sesh", res.data.id + uuidv1(), { expires: 7 });
        } else {
          this.props.handleUnsuccessfulLogin();
          return;
        }
      })
      .then(() => {
        axios.post("http://localhost:4000/sessions/new", {
          email: loginData.email,
          session: Cookie.get("sesh")
        });
      })
      .catch(err => {
        console.log("login error: ", err);
      });

    this.setState({
      email: "",
      password: ""
    });
  };

  render() {
    return (
      <div className="sign-in-form">
        <div className="content grid-1">
          <div>
            <div className="headline">
              <div className="logo">BOTTEGA</div>
              Mentor Dashboard
            </div>
            <div className="subtitle">Login to view your mentor sessions</div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                className="text-field"
                name="email"
                type="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <input
                className="text-field"
                name="password"
                type="password"
                placeholder="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>
            <div className="button-wrapper">
              <button className="btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
          <div>{this.props.errorText}</div>
        </div>
      </div>
    );
  }
}
