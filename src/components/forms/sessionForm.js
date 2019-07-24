// TODO: set edit flag to select which end point to hit and which button to select
// TODO: create separate edit form for when edit click is fired
// TODO: fix alternating buttons
import React, { Component } from "react";
import axios from "axios";

export default class SessionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "" || props.studentToEdit.first_name,
      last_name: "" || props.studentToEdit.last_name,
      email: "" || props.studentToEdit.email,
      phone: "" || props.studentToEdit.phone,
      day: "" || props.studentToEdit.day,
      time: "" || props.studentToEdit.time,
      special_instructions: "" || props.studentToEdit.special_instructions
    };
  }

  handleCancelEdit = () => {
    this.props.clearStudentToEdit();
    this.setState({
      first_name: "" || this.props.studentToEdit.first_name,
      last_name: "" || this.props.studentToEdit.last_name,
      email: "" || this.props.studentToEdit.email,
      phone: "" || this.props.studentToEdit.phone,
      day: "" || this.props.studentToEdit.day,
      time: "" || this.props.studentToEdit.time,
      special_instructions: ""
    });
    this.getStudents();
  };

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
      assigned_to: "",
      completed: false,
      info: [],
      special_instructions: this.state.special_instructions
    };

    axios
      .post(`http://localhost:4000/update/${student._id}`, updatedSession)
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

  renderForm = () => {
    const student = this.state;
    const times = [
      "8:00am",
      "8:30am",
      "9:00am",
      "9:30am",
      "10:00am",
      "10:30am",
      "11:00am",
      "11:30am",
      "12:00pm",
      "12:30pm",
      "1:00pm",
      "1:30pm",
      "2:00pm",
      "2:30pm",
      "3:00pm",
      "3:30pm",
      "4:00pm",
      "4:30pm",
      "5:00pm",
      "5:30pm",
      "6:00pm",
      "6:30pm",
      "7:00pm",
      "7:30pm",
      "8:00pm",
      "8:30pm",
      "9:00pm",
      "9:30pm"
    ];
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
            value={student.first_name || this.props.studentToEdit.first_name}
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
            value={student.name || this.props.studentToEdit.name}
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
            <option>Sunday</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
          </select>

          {/* <input
            type="text"
            className="text-field"
            name="day"
            required
            placeholder="day"
            onChange={this.handleChange}
            value={this.state.day || student.day}
            onFocus={this.handleFocus}
          /> */}
          <select
            value={student.time}
            name="time"
            onChange={this.handleChange}
            placeholder={this.state.time}
          >
            {times.map(time => {
              return <option key={time}>{time}</option>;
            })}
          </select>
        </div>

        {/* <div className="form-group">
          <input
            type="text"
            className="text-field"
            name="time"
            required
            placeholder="Time"
            onChange={this.handleChange}
            value={this.state.time || student.time}
            onFocus={this.handleFocus}
          />
        </div> */}

        <div className="button-wrapper">
          <button className="btn-primary" type="submit">
            {student._id ? "Update Student Session" : "Create New Session"}
          </button>
          {student._id ? (
            <button className="btn-primary" onClick={this.handleCancelEdit}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    );
  };

  renderEditForm = () => {
    const student = this.props.studentToEdit;
    const times = [
      "8:00am",
      "8:30am",
      "9:00am",
      "9:30am",
      "10:00am",
      "10:30am",
      "11:00am",
      "11:30am",
      "12:00pm",
      "12:30pm",
      "1:00pm",
      "1:30pm",
      "2:00pm",
      "2:30pm",
      "3:00pm",
      "3:30pm",
      "4:00pm",
      "4:30pm",
      "5:00pm",
      "5:30pm",
      "6:00pm",
      "6:30pm",
      "7:00pm",
      "7:30pm",
      "8:00pm",
      "8:30pm",
      "9:00pm",
      "9:30pm"
    ];
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
            value={student.last_name}
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
            <option>Day</option>
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
            placeholder={student.time}
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
  };

  render() {
    console.log("state from form: ", this.state);
    return this.props.studentToEdit ? this.renderEditForm() : this.renderForm();
  }
}
