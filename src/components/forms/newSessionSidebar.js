import React from "react";
import { Link } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const SideBar = props => {
  const handleEditClick = student => {
    props.handleEditClick(student);
  };

  const handleDeleteClick = student => {
    props.handleDeleteClick(student);
  };

  const renderStudents = () => {
    return props.students.map(student => {
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
              <span
                style={{ color: "#00c274", marginRight: "15px" }}
                onClick={() => handleEditClick(student)}
              >
                <FontAwesomeIcon icon="edit" />
                Edit
              </span>

              <span
                style={{ color: "darkred" }}
                onClick={() => handleDeleteClick(student)}
              >
                <FontAwesomeIcon icon="trash" />
                Delete
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="ticket-sidebar-wrapper">
      <div className="underlined-header">Students</div>
      <div className="scroll-box">
        {props.students != [] ? renderStudents() : null}
      </div>
    </div>
  );
};

export default SideBar;
