import React, { useState, useEffect } from "react";
import NoteCard from "../notes/noteCards";
import { Link } from "react-router-dom";

const Notes = props => {
  const [student, setStudent] = useState(props.location.state.student);
  const [currentUser, setCurrentUser] = useState(
    props.location.state.currentUser
  );

  const renderNotes = () => {
    return student.info.reverse().map(note => {
      return <NoteCard key={note._id} note={note} />;
    });
  };

  return (
    <div className="note-page-container">
      <div className="note-page-header">
        <h1>Notes for {`${student.first_name} ${student.last_name}`}</h1>
        <Link
          className="btn-primary"
          to={{
            pathname: `/session-notes/${student._id}`,
            state: {
              student: student,
              mentor: currentUser,
              extraNote: true
            }
          }}
        >
          Add note
        </Link>
      </div>
      {student.info.length > 0 ? (
        <div className="note-card-container">{renderNotes()}</div>
      ) : (
        <div>
          <h1>Nothing in Notes</h1>
        </div>
      )}
    </div>
  );
};

export default Notes;
