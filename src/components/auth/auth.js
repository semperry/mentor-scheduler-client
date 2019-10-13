// TODO: Multiple sessions with same email.
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import uuidv1 from "uuid/v1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Auth = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    const loginData = {
      email: email,
      password: password
    };

    axios
      .post("https://rec-scheduler-api.herokuapp.com/mentors/login", loginData)
      // .post("http://localhost:4000/mentors/login", loginData)
      .then(res => {
        setIsLoading(true);
        if (res.status === 200) {
          Cookie.set("_scheduler_Session", res.data.session_id, { expires: 1 });
          props.handleCurrentUser(res.data);
          props.handleSuccessfulLogin();
        } else {
          props.handleUnsuccessfulLogin();
        }
      })
      .then(() => {
        axios.post("https://rec-scheduler-api.herokuapp.com/sessions/new", {
          // axios.post("http://localhost:4000/sessions/new", {
          email: `${uuidv1()}--${loginData.email}`,
          session: Cookie.get("_scheduler_Session")
        });
      })
      .catch(err => {
        setIsLoading(true);
        setErrorMessage("Your Email or Password was incorrect");
        console.log("login error: ", err);
        setIsLoading(false);
      });

    setEmail("");
    setPassword("");
  };

  return (
    <div className="sign-in-form">
      <div className="content grid-1">
        <div>
          <div className="headline">
            <div className="logo">BOTTEGA</div>
            Mentor Dashboard
          </div>
          <div className="subtitle">Login to view your mentor sessions</div>
          <div className="error">{errorMessage}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              required
              className="text-field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={e => setErrorMessage("")}
            />
          </div>
          <div className="form-group">
            <input
              required
              className="text-field"
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={e => setErrorMessage("")}
            />
          </div>
          <div className="button-wrapper">
            {/* <FontAwesomeIcon icon="spinner" spin /> */}
            {isLoading ? (
              <div className="login-loader">
                <FontAwesomeIcon icon="spinner" spin />
              </div>
            ) : (
              <button className="btn-primary" type="submit">
                Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
