// TODO: assign handler
import React, { Component } from "react";
import axios from "axios";
import Sessions from "../pages/sessions";

export default class SessionDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: props.students,
      mentors: ["Ben", "Makenna", "Chantay", "Ryan", "Bobby"],
      selected_mentor: "",
      id: props.id,
      single_session: {}
    };
  }

  filterSingleStudent = () => {
    this.setState({
      single_session: this.props.students.filter(student => {
        return student._id === this.state.id;
      })[0]
    });
  };

  handleDropDownChange = e => {
    this.setState({
      selected_mentor: e.target.value
    });
  };

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

  componentDidMount() {
    this.filterSingleStudent();
  }

  render() {
    // console.log(
    //   "props:",
    //   this.props.students.filter(student => {
    //     return student._id === this.props.id;
    //   })[0].session.time
    // );
    const student = this.state.single_session;
    return (
      <div>
        {this.state.single_session !== {} ? (
          <div className="session-detail">
            <div className="session-detail-top">
              <h1>Name: {student.first_name + " " + student.last_name}</h1>
              <br />
              <h1>Time: {student.time}</h1>
              <br />
              <h2>Phone: {student.phone}</h2>
              <br />
              <h2>Email: {student.email}</h2>
              <br />
              {student.special_instructions ? (
                <div>
                  <h2>Instructions: {student.special_instructions}</h2>
                </div>
              ) : null}
            </div>

            <div className="session-detail-bottom">
              <form className="form-group">
                <select
                  className="text-field select-mentor"
                  value={this.state.selected_mentor}
                  onChange={this.handleDropDownChange}
                >
                  <option>Select</option>
                  {this.state.mentors.map(mentor => {
                    return (
                      <option key={mentor} value={mentor}>
                        {mentor}
                      </option>
                    );
                  })}
                </select>
                <div className="button-wrapper">
                  <button className="btn-primary" onClick={this.handleAssign}>
                    Assign
                  </button>
                  <button className="btn-cancel" onClick={this.handleCloseForm}>
                    close
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
