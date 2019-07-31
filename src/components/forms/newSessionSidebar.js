import React, { Component } from "react";
import { Link } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  handleEditClick = student => {
    this.props.handleEditClick(student);
  };

  handleDeleteClick = student => {
    this.props.handleDeleteClick(student);
  };

  renderStudents = () => {
    return this.props.students.map(student => {
      return (
        <div
          key={student._id}
          className="ticket-sidebar-wrapper__items-wrapper"
        >
          <div className="ticket-sidebar-wrapper__items-wrapper__item">
            <div className="ticket-sidebar-wrapper__items-wrapper__item__left__title">
              <Link
                to={{
                  pathname: `student/notes/${student._id}`,
                  state: {
                    student: student
                  }
                }}
              >
                {`${student.first_name} ${student.last_name}`}
              </Link>
            </div>
            <div>
              <span onClick={() => this.handleEditClick(student)}>
                <FontAwesomeIcon icon="edit" />
              </span>
            </div>
            <div>
              <span onClick={() => this.handleDeleteClick(student)}>
                <FontAwesomeIcon icon="trash" />
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="ticket-sidebar-wrapper">
        <div className="underlined-header">Students</div>
        <div className="scroll-box">
          {this.props.students != [] ? this.renderStudents() : null}
        </div>
      </div>
    );
  }
}
