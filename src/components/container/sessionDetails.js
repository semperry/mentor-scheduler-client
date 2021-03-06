import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";

const SessionDetail = props => {
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [students, setStudents] = useState(props.students);
  const [mentors, setMentors] = useState(props.mentors);
  const [id, setId] = useState(props.id);
  const [redisData, setRedisData] = useState(props.redisData);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [singleSession, setSingleSession] = useState({});

  const handleSendMessage = () => {
    props.handleSendMessage(singleSession);
  };

  const filterSingleStudent = () => {
    setSingleSession(
      students.filter(student => {
        return student._id === id;
      })[0]
    );
  };

  const handleAssign = e => {
    const searchName = selectedMentor.split(" ");

    const searchData = {
      first_name: searchName[0],
      last_name: searchName[1]
    };

    e.preventDefault();

    axios
      .post(
        "https://rec-scheduler-api.herokuapp.com/mentors/search-name",
        searchData
      )
      // .post("http://localhost:4000/mentors/search-name", searchData)
      .then(res => {
        axios
          .put(
            `https://rec-scheduler-api.herokuapp.com/students/assign-to/${id}`,
            {
              // .put(`http://localhost:4000/students/assign-to/${id}`, {
              assigned_to: res.data,
              assigned_by: `${currentUser.first_name} ${currentUser.last_name}`
            }
          )
          // .then(() => {
          //   props.handleFilter("sessions");
          // })
          .then(() => {
            handleSendMessage();
          })
          .catch(err => {
            console.log("put error", err);
          });
      })
      .catch(err => {
        console.log("search data err", err);
      });

    setSelectedMentor("");
    props.clearId();
    props.filterAssigned(singleSession);
  };

  const handleCloseForm = e => {
    e.preventDefault();
    props.clearId();
  };

  const handleDropdownRender = () => {
    return (
      <form className="form-group">
        <select
          required
          className="text-field select-mentor"
          value={selectedMentor}
          onChange={e => setSelectedMentor(e.target.value)}
        >
          <option defaultValue value="">
            Mentor
          </option>
          {mentors.map(mentor => {
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

  const handleButtonRender = () => {
    const roles = currentUser.roles;
    const session = singleSession;

    return (
      <span>
        {roles.includes("admin") &&
        (session.assigned_to === "" || session.assigned_to === null) &&
        !redisData.includes(session._id) ? (
          selectedMentor ? (
            <button className="btn-primary" onClick={handleAssign}>
              Assign
            </button>
          ) : (
            <span className="btn-primary">Select a Mentor</span>
          )
        ) : !redisData.includes(session._id) &&
          singleSession.assigned_to !== "" ? (
          <span>
            {singleSession.assigned_by ? renderAssignedBy() : null}
            {selectedMentor ? (
              <button className="btn-primary" onClick={handleAssign}>
                Reassign
              </button>
            ) : (
              <span>Select a Mentor to reassign</span>
            )}
            <Link
              className="btn-primary"
              to={{
                pathname: `/session-notes/${id}`,
                state: {
                  student: singleSession,
                  mentor: currentUser
                }
              }}
            >
              Take Session
            </Link>
          </span>
        ) : redisData.includes(session._id) ? (
          <Link
            className="btn-primary"
            to={{
              pathname: `/student/notes/${id}`,
              state: {
                student: singleSession,
                currentUser: currentUser
              }
            }}
          >
            View Notes
          </Link>
        ) : null}
        <button className="btn-cancel" onClick={handleCloseForm}>
          close
        </button>
      </span>
    );
  };

  const renderCompletedBy = student => {
    const completedBy = student.last_submitted_by;
    return (
      <span>
        Completed By: <h2>{completedBy}</h2>
      </span>
    );
  };

  const renderAssignedBy = () => {
    const assigned_by = singleSession.assigned_by;
    return (
      <span>
        Assigned By: <h2>{assigned_by}</h2>
      </span>
    );
  };

  const renderLastNote = () => {
    if (singleSession.info) {
      let notesArray = [];
      singleSession.info.map(note => {
        return (notesArray = [...notesArray, note.notes]);
      });
      return (
        <div className="last-session-notes">{notesArray.reverse()[0]}</div>
      );
    } else {
      null;
    }
  };

  useEffect(() => {
    filterSingleStudent();
    // getMentors();
  }, []);

  return (
    <div>
      {singleSession !== {} ? (
        <div className="session-detail">
          <div className="session-detail-top">
            <div className="session-detail-student-info">
              <h1>
                Name: {singleSession.first_name + " " + singleSession.last_name}
              </h1>
              <br />
              <h1>Time: {singleSession.time}</h1>
              <br />
              <h2>Phone: {singleSession.phone}</h2>
              <br />
              <h2>Email: {singleSession.email}</h2>
              <br />
              {singleSession.special_instructions ? (
                <div className="special-instruction-wrapper">
                  <h2>Instructions: {singleSession.special_instructions}</h2>
                </div>
              ) : null}
            </div>
            {singleSession.last_submitted_by ? (
              <div className="session-detail-notes-wrapper">
                <h1>
                  Latest entry submitted by{" "}
                  {`${singleSession.last_submitted_by}`}
                </h1>
                <br />
                <div className="sb-notes">{renderLastNote()}</div>
              </div>
            ) : null}
          </div>

          <div className="session-detail-bottom">
            {!redisData.includes(singleSession._id)
              ? handleDropdownRender()
              : null}
            <div className="button-wrapper">{handleButtonRender()}</div>
          </div>
          {redisData.includes(singleSession._id)
            ? renderCompletedBy(singleSession)
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(SessionDetail);
