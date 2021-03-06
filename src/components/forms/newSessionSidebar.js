import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faArchive } from "@fortawesome/free-solid-svg-icons";

const SideBar = props => {
  const [selectedDay, setSelectedDay] = useState(moment().format("dddd"));
  const [students, setStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState(props.currentUser);

  const handleEditClick = student => {
    props.handleEditClick(student);
  };

  const handleArchiveClick = student => {
    props.handleArchiveClick(student);
  };

  const renderStudents = () => {
    return students.map(student => {
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
                    student: student,
                    currentUser: currentUser
                  }
                }}
              >
                {`${student.first_name} ${student.last_name}`}
              </Link>
            </div>
            <div className="center-title">
              {student.archived ? <span>Archived</span> : <span>Active</span>}
            </div>
            <div>
              <span
                style={{ color: "#00c274", marginRight: "15px" }}
                onClick={() => handleEditClick(student)}
              >
                <FontAwesomeIcon icon="edit" />
                Edit
              </span>

              {props.roles.includes("admin") ? (
                <span
                  style={{ color: "darkred" }}
                  onClick={() => handleArchiveClick(student)}
                >
                  <FontAwesomeIcon icon="archive" />
                  {!student.archived ? "Archive" : "Activate"}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      );
    });
  };

  const filterStudents = () => {
    setStudents(
      props.students
        .sort((a, b) => {
          const nameA = a.last_name.toLowerCase();
          const nameB = b.last_name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        })
        .filter(student => {
          return student.day == selectedDay;
        })
    );
  };

  useEffect(() => {
    filterStudents();
  });

  return (
    <div className="ticket-sidebar-wrapper">
      <div className="underlined-header">
        <select
          value={selectedDay}
          onChange={e => setSelectedDay(e.target.value)}
        >
          <option>Sunday</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>
        <span>Students for {selectedDay}</span>
      </div>
      <div className="scroll-box">
        {props.students != [] ? renderStudents() : null}
      </div>
    </div>
  );
};

export default SideBar;
