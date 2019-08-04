import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";

class SessionDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_user: props.current_user,
      students: props.students,
      mentors: props.mentors,
      id: props.id,
      selected_mentor: "",
      assign_mentor: "",
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
    const searchName = this.state.selected_mentor.split(" ");
    const searchData = {
      first_name: searchName[0],
      last_name: searchName[1]
    };
    const studentId = this.state.id;

    e.preventDefault();

    axios
      .post("http://localhost:4000/mentors/search-name", searchData)
      .then(res => {
        axios
          .put(`http://localhost:4000/students/assign-to/${studentId}`, {
            assigned_to: res.data
          })
          .then(() => {
            this.props.handleFilter();
          })
          .catch(err => {
            console.log("put error", err);
          });
      })
      .catch(err => {
        console.log("search data err", err);
      });

    this.setState({
      selected_mentor: ""
    });

    this.props.clearId();
  };

  handleCloseForm = e => {
    e.preventDefault();
    this.props.clearId();
  };

  componentDidMount() {
    this.filterSingleStudent();
  }

  handleDropdownRender = () => {
    return (
      <form className="form-group">
        <select
          required
          className="text-field select-mentor"
          value={this.state.selected_mentor}
          onChange={this.handleDropDownChange}
        >
          <option defaultValue value="">
            Mentor
          </option>
          {this.props.mentors.map(mentor => {
            return (
              <option key={mentor._id}>
                {`${mentor.first_name} ${mentor.last_name}`}
              </option>
            );
          })}
        </select>
      </form>
    );
  };

  handleButtonRender = () => {
    const role = this.state.current_user.role;
    const session = this.state.single_session;
    return (
      <div className="button-wrapper">
        {role === "admin" &&
        session.assigned_to === "" &&
        !this.props.redis_data.includes(session._id) ? (
          this.state.selected_mentor ? (
            <button className="btn-primary" onClick={this.handleAssign}>
              Assign
            </button>
          ) : (
            <span className="btn-primary">Select a Mentor</span>
          )
        ) : !this.props.redis_data.includes(session._id) ? (
          <Link
            className="btn-primary"
            to={{
              pathname: `/session-notes/${this.state.id}`,
              state: {
                student: this.state.single_session,
                mentor: this.props.user_object
              }
            }}
          >
            Take Session
          </Link>
        ) : role === "admin" && this.props.redis_data.includes(session._id) ? (
          <Link
            className="btn-primary"
            to={{
              pathname: `/student/notes/${this.state.id}`,
              state: {
                student: this.state.single_session
              }
            }}
          >
            View Notes
          </Link>
        ) : null}
        <button className="btn-cancel" onClick={this.handleCloseForm}>
          close
        </button>
      </div>
    );
  };

  renderCompletedBy = student => {
    let completedBy = student.last_submitted_by;
    return (
      <span>
        Completed By: <h2>{completedBy}</h2>
      </span>
    );
  };

  render() {
    console.log(this.state.current_user);
    console.log("selected: ", this.state.selected_mentor);

    const student = this.state.single_session;
    console.log("student: ", student);
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
              {this.state.current_user.role === "admin" &&
              student.assigned_to === "" &&
              !this.props.redis_data.includes(student._id)
                ? this.handleDropdownRender()
                : null}
              {this.handleButtonRender()}
            </div>
            {this.props.redis_data.includes(student._id)
              ? this.renderCompletedBy(student)
              : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(SessionDetail);
