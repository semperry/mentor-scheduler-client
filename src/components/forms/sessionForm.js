// TODO: set edit flag to select which end point to hit and which button to select
// TODO: create separate edit form for when edit click is fired

import React, { Component } from "react";
import axios from "axios";

import { times } from "../data";

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
      special_instructions: ""
    };
  }

  handleClearStudentToEdit = () => {
    this.props.clearStudentToEdit();
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

    if (this.props.studentToEdit._id) {
      this.handleStudentUpdate(this.props.studentToEdit);
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

  // Update student through api
  // clear out student to edit prop
  // relist students
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
      .post(`http://localhost:4000/update-form/${student._id}`, updatedSession)
      .then(() => {
        this.handleClearStudentToEdit();
      })
      .then(() => {
        this.getStudents();
      })
      .catch(err => {
        console.log("update error: ", err);
      });

    this.setState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      day: "",
      time: "",
      special_instructions: ""
    });
  };

  handleSuccessfulFormSubmit = student => {
    this.props.handleSuccessfulFormSubmit(student);
  };

  render() {
    const student = this.state;
    return (
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
            onFocus={this.handleFocus}
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
            value={student.name}
            onFocus={this.handleFocus}
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
            onFocus={this.handleFocus}
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
            onFocus={this.handleFocus}
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
            placeholder={student.day}
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
            placeholder={this.state.time}
          >
            <option>Time</option>
            {times.map(time => {
              return <option key={time}>{time}</option>;
            })}
          </select>
        </div>

        <div className="button-wrapper">
          <button className="btn-primary" type="submit">
            {this.props.studentToEdit._id
              ? "Update Student Session"
              : "Submit New Session"}
          </button>
          {this.props.studentToEdit._id ? (
            <button className="btn-cancel" onClick={this.handleCancelEdit}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    );
  }
}
