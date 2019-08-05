// TODO: Multiple sessions with same email.
// TODO: Handle Cookie expiration
// TODO: Redis for cookie endpoint
import React, { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import uuidv1 from "uuid";

const Auth = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        if (res.status === 200) {
          props.handleCurrentUser(res.data);
          props.handleSuccessfulLogin();
          Cookie.set("sesh", res.data.id + uuidv1(), { expires: 7 });
        } else {
          props.handleUnsuccessfulLogin();
        }
      })
      .then(() => {
        axios.post("https://rec-scheduler-api.herokuapp.com/sessions/new", {
          // axios.post("http://localhost:4000/sessions/new", {
          _id: uuidv1(),
          email: loginData.email,
          session: Cookie.get("sesh")
        });
      })
      .catch(err => {
        console.log("login error: ", err);
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
            />
          </div>
          <div className="button-wrapper">
            <button className="btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
