import React, { Component } from "react";
import { withRouter } from "react-router";
import axios from "axios";

class SessionNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: "",
      hours_studied: "",
      weekly_goal: "",
      questions: "",
      id: "",
      mentor: "",
      submitText: "",
      errorText: ""
    };
  }

  handleComplete = e => {
    e.preventDefault();
    axios
      .put(`http://localhost:4000/students/completed/${this.state.id}`, {
        completed: true
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log("completed err: ", err);
      });
    this.props.history.push("/sessions");
  };

  handleSubmit = e => {
    const mentor = this.state.mentor;
    const notes = {
      notes: this.state.notes,
      hours_studied: this.state.hours_studied,
      weekly_goal: this.state.weekly_goal,
      questions: this.state.questions,
      submitted_by: `${mentor.first_name} ${mentor.last_name}`
    };

    console.log(notes);

    e.preventDefault();
    axios
      .put(`http://localhost:4000/students/notes/${this.state.id}`, {
        info: notes
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            submitText: "Notes Submitted!"
          });
        } else {
          this.setState({
            errorText: "Oops, something went wrong!"
          });
          console.log("Notes: ", res);
        }
      })
      .catch(err => {
        console.log("put notes err: ", err);
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    this.setState({
      id: this.props.location.state.student._id,
      mentor: this.props.location.state.mentor
    });
  }

  render() {
    console.log(this.props.location.state.mentor);
    const student = this.props.location.state.student;
    console.log(student);
    return (
      <div className="container">
        <div className="ticket-page-wrapper">
          <div className="ticket-detail">
            <div className="ticket-detail__top__heading">
              <h1>{`${student.first_name} ${student.last_name}`}</h1>
            </div>
            <br />
            <h1>{student.phone}</h1>
            <br />

            <h1>{student.email}</h1>
            <br />

            <h2>{student.special_instructions}</h2>

            <div className="comments-container__form-container">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    className="text-field"
                    type="text"
                    name="hours_studied"
                    value={this.state.hours_studied}
                    onChange={this.handleChange}
                    placeholder="Hours Studied"
                  />

                  <input
                    className="text-field"
                    type="text"
                    name="weekly_goal"
                    value={this.state.weekly_goal}
                    onChange={this.handleChange}
                    placeholder="Weekly Goal"
                  />
                </div>
                <div className="form-group">
                  <input
                    className="text-field"
                    type="text"
                    name="questions"
                    value={this.state.questions}
                    onChange={this.handleChange}
                    placeholder="Questions"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    required
                    className="text-area-field"
                    name="notes"
                    value={this.state.notes}
                    onChange={this.handleChange}
                    style={{ height: 150 }}
                    placeholder="Session Notes"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Submit Notes
                </button>
                <h2>{this.state.submitText}</h2>
              </form>
            </div>
            <div className="ticket-detail__bottom">
              {this.state.notes !== "" ? (
                <button onClick={this.handleComplete} className="btn-primary">
                  Mark Complete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SessionNotes);
