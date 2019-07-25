// TODO: assign handler
// TODO: on complete, attach date: update student model to reflect.
import React, { Component } from "react";
import axios from "axios";

export default class SessionDetail extends Component {
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
    console.log(searchData);
    e.preventDefault();

    axios
      .post("http://localhost:4000/mentors/search-name", searchData)
      .then(res => {
        axios
          .put(`http://localhost:4000/students/assign-to/${studentId}`, {
            assigned_to: res.data
          })
          .then(res => {
            console.log(res);
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

  authorizedRoutes = () => {
    const mentors = this.props.mentors.map(mentor => {
      return mentor;
    });
    return (
      <form className="form-group">
        <select
          required
          className="text-field select-mentor"
          value={this.state.selected_mentor}
          onChange={this.handleDropDownChange}
        >
          <option>Select</option>
          {mentors.map(mentor => {
            return (
              <option key={mentor.id}>
                {`${mentor.first_name} ${mentor.last_name}`}
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
    );
  };

  render() {
    console.log("mentor assign:", this.state.assign_mentor);
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
              {this.state.current_user === "admin" ? (
                this.authorizedRoutes()
              ) : (
                <form className="form-group">
                  <div className="button-wrapper">
                    <button
                      className="btn-cancel"
                      onClick={this.handleCloseForm}
                    >
                      close
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
