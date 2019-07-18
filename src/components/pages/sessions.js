// TODO: Login Page
// TODO: Individual Session route
// TODO: Dropdowns for new session form
// TODO: Filter by Day of Week
// TODO: Logo
// TODO: Logout icon
// TODO: Admin (authorized) routes
// ability to assign
// TODO: completed ticket routes
// TODO: check against current date
// TODO: reset booleans after day ends
// TODO: look into adding a redis system
// Style buttons
// Integrate Mentor schedule to mass assign
// List of mentors. take _id, pass in to modal, pull daily session, click to add
import React, { Component } from "react";
import axios from "axios";

import ScrollContainer from "../container/scrollBox";
import SessionCard from "../container/sessionCard";
import SessionDetail from "../container/sessionDetails";

export default class Sessions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessions: "",
      current_id: "",
      current_filter: "",
      filtered_sessions: []
    };
  }

  handleClearSession = () => {
    this.setState({
      single_session: []
    });
  };

  clearId = () => {
    this.setState({
      current_id: ""
    });
  };

  setId = id => {
    this.setState({
      current_id: id
    });
  };

  handleFilter = filter => {
    this.getSessions(filter);
  };

  getSessions(filter = "sessions") {
    axios
      .get("http://localhost:4000/sessions")
      // .get("https://rec-scheduler-api.herokuapp.com/sessions")
      .then(res => {
        if (filter === "sessions") {
          this.setState({
            filtered_sessions: res.data.filter(session => {
              return session.assigned === false && session.completed === false;
            })
          });
        } else if (filter === "assigned") {
          this.setState({
            filtered_sessions: res.data.filter(session => {
              return session.assigned === true && session.completed === false;
            })
          });
        } else if (filter === "completed") {
          this.setState({
            filtered_sessions: res.data.filter(session => {
              return session.completed === true;
            })
          });
        }
      })
      .catch(err => {
        console.log("getSessions: ", err);
      });
  }

  componentDidMount() {
    this.getSessions();
  }

  render() {
    return (
      <div className="container">
        <div className="grid-500-1fr">
          <div color="#00c274">
            <div color="#00c274">
              <button onClick={() => this.handleFilter("sessions")}>
                Sessions
              </button>
              <button onClick={() => this.handleFilter("assigned")}>
                Assigned
              </button>
              <button onClick={() => this.handleFilter("completed")}>
                Completed
              </button>
            </div>
            {/* <ScrollContainer
              clearId={this.clearId}
              setId={this.setId}
              sessions={this.state.filtered_sessions}
              id={this.state.current_id}
            /> */}
            <div className="scroll-box">
              {this.state.filtered_sessions.length > 0 ? (
                this.state.filtered_sessions.map(session => {
                  return (
                    <SessionCard
                      key={session._id}
                      setId={this.setId}
                      session={session}
                      clearId={this.props.clearId}
                    />
                  );
                })
              ) : (
                <div>Currently no sessions</div>
              )}
            </div>
          </div>
          {this.state.current_id ? (
            <SessionDetail
              key={this.state.current_id}
              id={this.state.current_id}
              clearId={this.clearId}
              setId={this.setId}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
