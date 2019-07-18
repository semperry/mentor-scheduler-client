// TODO: Double check routes for posting new session, model might be off
import React, { Component } from "react";
import axios from "axios";

export default class NewSessionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phone: "",
      day: "",
      time: "",
      students: []
    };
  }

  getStudents = () => {
    axios
      .get("https://rec-scheduler-api.herokuapp.com/sessions")
      .then(res => {
        this.setState({
          students: [...res.data]
        });
      })
      .catch(err => {
        console.log("Get Eror in NewSessionForm", err);
      });
  };

  renderStudents = () => {
    return this.state.students.map(student => {
      return (
        <div
          key={student._id}
          className="ticket-sidebar-wrapper__items-wrapper"
        >
          <div className="ticket-sidebar-wrapper__items-wrapper__item">
            <div className="ticket-sidebar-wrapper__items-wrapper__item__left__title">
              {student.name}
            </div>
          </div>
        </div>
      );
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    const newSession = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      day: this.state.day,
      time: this.state.time
    };
    e.preventDefault();

    axios
      .post("https://rec-scheduler-api.herokuapp.com/new", newSession)
      .then(res => {
        this.getStudents();
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({
      name: "",
      email: "",
      phone: "",
      day: "",
      time: ""
    });
  };

  componentDidMount() {
    this.getStudents();
  }

  render() {
    return (
      <div className="grid-1fr-500px">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="text-field"
              name="name"
              required
              placeholder="Name"
              onChange={this.handleChange}
              value={this.state.name}
            />
            <label>Student Name</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="text-field"
              name="email"
              required
              placeholder="Email"
              onChange={this.handleChange}
              value={this.state.email}
            />
            <label>Student Email</label>
          </div>
          <div className="form-group">
            <input
              type="phone"
              className="text-field"
              name="phone"
              required
              placeholder="Phone"
              onChange={this.handleChange}
              value={this.state.phone}
            />
            <label>Student Phone</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="text-field"
              name="day"
              required
              placeholder="day"
              onChange={this.handleChange}
              value={this.state.day}
            />
            <label>Session Day</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="text-field"
              name="time"
              required
              placeholder="Time"
              onChange={this.handleChange}
              value={this.state.time}
            />
            <label>Session Time</label>
          </div>
          {/* <div className="form-group">
            <textarea required className="textarea-field"></textarea>
            <label>Notes</label>
          </div> */}
          <div className="button-wrapper">
            <button className="btn-primary" type="submit">
              Create Recurring Session
            </button>
          </div>
        </form>
        <div className="ticket-sidebar-wrapper">
          <div className="underlined-header">Students</div>
          {this.state.students != [] ? this.renderStudents() : null}
        </div>
      </div>
    );
  }
}
