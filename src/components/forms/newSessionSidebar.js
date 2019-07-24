import React, { Component } from "react";

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
              {`${student.first_name} ${student.last_name}`}
            </div>
            <div>
              <span onClick={() => this.handleEditClick(student)}>EDIT</span>
            </div>
            <div>
              <span onClick={() => this.handleDeleteClick(student)}>
                DELETE
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
        {this.props.students != [] ? this.renderStudents() : null}
      </div>
    );
  }
}
