import React, { useState, useEffect } from "react";

const Home = props => {
  const [currentUser, setCurrentUser] = useState(props.currentUser);

  return (
    <div className="home">
      <h1>Bottega Mentor Dashboard</h1>
      <br />
      <h1>Welcome, {currentUser.first_name}</h1>
      <br />
      <h3>
        Use this App to assign mentor calls, add and edit mentor sessions, and
        add notes each day.
      </h3>
    </div>
  );
};

export default Home;
