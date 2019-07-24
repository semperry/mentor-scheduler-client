// TODO: Login Page
// TODO: Admin panel needs to be able to add mentors and flag admin or not
// TODO: Individual Session route
// TODO: Logo
// TODO: Logout icon
// TODO: Admin (authorized) routes
// TODO: completed ticket routes
// TODO: reset booleans after day ends
// TODO: redis system
// Integrate Mentor schedule to mass assign
// List of mentors. take _id, pass in to modal, pull daily session, click to add
import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

import SessionCard from "../container/sessionCard";
import SessionDetail from "../container/sessionDetails";

export default class Sessions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mentors: [],
      single_session: [],
      current_id: "",
      current_filter: "",
      filtered_sessions: [],
      current_day: moment()
        .format("dddd")
        .toLowerCase()
    };
  }

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
    if (filter === "mentors") {
      this.getMentors();
    } else {
      this.getSessions(filter);
    }
  };

  getMentors = () => {
    axios
      .get("http://localhost:4000/mentors")
      .then(res => {
        this.setState({
          mentors: res.data
        });
      })
      .catch(err => {
        console.log("getMentors: ", err);
      });
  };

  getSessions(filter = "sessions") {
    axios
      .get("http://localhost:4000/students")
      // .get("https://rec-scheduler-api.herokuapp.com/students")
      .then(res => {
        if (filter === "sessions") {
          this.setState({
            filtered_sessions: res.data.filter(student => {
              return (
                student.assigned_to === "" &&
                student.completed === false &&
                student.day.toLowerCase() == this.state.current_day
              );
            })
          });
        } else if (filter === "assigned") {
          this.setState({
            filtered_sessions: res.data.filter(student => {
              return student.assigned_to !== "" && student.completed === false;
            })
          });
        } else if (filter === "completed") {
          this.setState({
            filtered_sessions: res.data.filter(student => {
              return student.completed === true;
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
              students={this.state.filtered_sessions}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
