// TODO: assign handler
import React, { Component } from "react";
import axios from "axios";

export default class SessionDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      single_session: "",
      mentors: ["Ben", "Makenna", "Chantay", "Ryan", "Bobby"],
      selected_mentor: "",
      id: props.id
    };
  }

  handleDropDownChange = e => {};

  handleAssign = e => {
    e.preventDefault();
    // axios call to route to get to user selected
    // set piece of state with res.data
    // post handler
    // push all data up but chage assigned to true
  };

  handleCloseForm = e => {
    e.preventDefault();
    this.props.clearId();
  };

  getDetails = (id = this.props.id) => {
    axios
      .get(`https://rec-scheduler-api.herokuapp.com/${id}`)
      .then(res => {
        this.setState({
          single_session: res.data
        });
      })
      .catch(err => {
        console.log("renderDetails Error: ", err);
      });
  };

  // Put in own component
  renderAssignForm = () => {
    return (
      <form>
        <select>
          {this.state.mentors.map(mentor => {
            return (
              <option
                key={mentor}
                value={this.state.selected_mentor}
                onChange={this.handleDropDownChange}
              >
                {mentor}
              </option>
            );
          })}
        </select>
        <button className="btn-primary" onClick={this.handleAssign}>
          Assign
        </button>
        <button className="btn-primary" onClick={this.handleCloseForm}>
          close
        </button>
      </form>
    );
  };

  renderDetails = () => {
    const session = this.state.single_session;
    return (
      <div className="session-detail">
        <div className="session-detail-top">
          <h1>{session.name}</h1>
          <h2>{session.time}</h2>
          <br />
          <h3>{session.phone}</h3>
          <h3>{session.email}</h3>
        </div>
        <div className="session-detail-bottom">{this.renderAssignForm()}</div>
      </div>
    );
  };

  componentWillMount() {
    this.getDetails();
  }

  render() {
    console.log("selected Mentor", this.state.selected_mentor);
    // return <div>{this.renderDetails()}</div>;
    const session = this.state.single_session;
    return (
      <div className="session-detail">
        <div className="session-detail-top">
          <h1>{session.name}</h1>
          <h2>{session.time}</h2>
          <br />
          <h3>{session.phone}</h3>
          <h3>{session.email}</h3>
        </div>
        <div className="session-detail-bottom">{this.renderAssignForm()}</div>
      </div>
    );
  }
}
