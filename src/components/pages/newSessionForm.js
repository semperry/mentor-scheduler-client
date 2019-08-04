// TODO: Context for handledeleteclick and students
import React, { Component } from "react";
import axios from "axios";

import SessionForm from "../forms/sessionForm";

export default class NewSessionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      students: []
    };
  }

  handleDeleteClick = student => {
    axios
      .delete(`http://localhost:4000/students/delete/${student._id}`)
      .then(res => {
        this.setState({
          students: this.state.students.filter(remaining => {
            return remaining._id !== student._id;
          })
        });
      })
      .catch(err => {
        console.log("del err: ", err);
      });
  };

  handleSuccesfulFormSubmit = student => {
    this.setState({
      students: [student].concat(this.state.students)
    });
  };

  handleFormSubmissionError = err => {
    console.log("handleFormSubmissionError: ", err);
  };

  getStudents = () => {
    axios
      .get("http://localhost:4000/students")
      // .get("https://rec-scheduler-api.herokuapp.com/students")
      .then(res => {
        this.setState({
          students: [...res.data]
        });
      })
      .catch(err => {
        console.log("Get Eror in NewSessionForm", err);
      });
  };

  componentDidMount() {
    this.getStudents();
  }

  render() {
    console.log("student to edit: ", this.state.studentToEdit);
    return (
      <div className="container">
        <SessionForm
          getStudents={this.getStudents}
          handleSuccesfulFormSubmit={this.handleSuccesfulFormSubmit}
          handleFormSubmissionError={this.handleFormSubmissionError}
          students={this.state.students}
          handleDeleteClick={this.handleDeleteClick}
        />
      </div>
    );
  }
}
