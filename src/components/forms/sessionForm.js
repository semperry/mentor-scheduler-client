import React, { Component } from "react";
import axios from "axios";
import { times } from "../data";
import SideBar from "./newSessionSidebar";

export default class SessionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      day: "",
      time: "",
      special_instructions: "",
      studentToEdit: ""
    };
  }

  handleEditClick = student => {
    this.setState({
      studentToEdit: student,
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone,
      day: student.day,
      time: student.time,
      special_instructions: student.special_instructions
    });
  };

  handleCancelEdit = e => {
    e.preventDefault();
    this.handleClearStudentToEdit();
  };

  handleClearStudentToEdit = () => {
    this.setState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      day: "",
      time: "",
      special_instructions: "",
      studentToEdit: ""
    });
  };

  getStudents = () => {
    this.props.getStudents();
  };

  handleFocus = e => {
    e.target.value = "";
  };

  handleChange = e => {
    console.log("event: ", e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    const newSession = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      phone: this.state.phone,
      day: this.state.day,
      time: this.state.time,
      special_instructions: this.state.special_instructions,
      assigned_to: ""
    };

    e.preventDefault();

    if (this.state.studentToEdit !== "") {
      this.handleStudentUpdate(this.state.studentToEdit);
    } else {
      axios
        .post("http://localhost:4000/students/new", newSession)
        // .post("https://rec-scheduler-api.herokuapp.com/students/new", newSession)
        .then(() => {
          this.setState({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            day: "",
            time: "",
            special_instructions: ""
          });
        })
        .then(() => {
          this.getStudents();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  handleStudentUpdate = student => {
    const updatedSession = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      phone: this.state.phone,
      day: this.state.day,
      time: this.state.time,
      special_instructions: this.state.special_instructions
    };

    axios
      .put(
        `http://localhost:4000/students/update-form/${student._id}`,
        updatedSession
      )
      .then(() => {
        this.handleClearStudentToEdit();
        this.setState({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          day: "",
          time: "",
          special_instructions: ""
        });
      })
      .then(() => {
        this.getStudents();
      })
      .catch(err => {
        console.log("update error: ", err);
      });
  };

  handleSuccessfulFormSubmit = student => {
    this.props.handleSuccessfulFormSubmit(student);
  };

  render() {
    console.log("state from form: ", this.state);
    const student = this.state;
    return (
      <div className="grid-1fr-500px">
        <div className="session-form">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="text-field"
                name="first_name"
                required
                placeholder="First Name"
                onChange={this.handleChange}
                value={student.first_name}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                className="text-field"
                name="last_name"
                required
                placeholder="Last Name"
                onChange={this.handleChange}
                value={student.last_name}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                className="text-field"
                name="email"
                required
                placeholder="Email"
                onChange={this.handleChange}
                value={student.email}
              />
            </div>

            <div className="form-group">
              <input
                type="phone"
                className="text-field"
                name="phone"
                required
                placeholder="Phone"
                onChange={this.handleChange}
                value={student.phone}
              />
            </div>
            <div className="form-group">
              <textarea
                className="textarea-field"
                placeholder="Special requests"
                name="special_instructions"
                value={student.special_instructions}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <select
                value={student.day}
                name="day"
                onChange={this.handleChange}
              >
                <option>Select Day</option>
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>

              <select
                value={student.time}
                name="time"
                onChange={this.handleChange}
              >
                <option>Time</option>
                {times.map(time => {
                  return <option key={time}>{time}</option>;
                })}
              </select>
            </div>

            <div className="button-wrapper">
              <button className="btn-primary" type="submit">
                {this.state.studentToEdit !== ""
                  ? "Update Student Session"
                  : "Submit New Session"}
              </button>
              {this.state.studentToEdit !== "" ? (
                <button className="btn-cancel" onClick={this.handleCancelEdit}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>
        <SideBar
          students={this.props.students}
          handleEditClick={this.handleEditClick}
          handleDeleteClick={this.props.handleDeleteClick}
        />
      </div>
    );
  }
}
