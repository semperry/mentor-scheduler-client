import React, { useState } from "react";
import NoteCard from "../notes/noteCards";

const Notes = props => {
  const [student, setStudent] = useState(props.location.state.student);

  const renderNotes = () => {
    return student.info.reverse().map(note => {
      return <NoteCard note={note} />;
    });
  };

  return (
    <div className="note-page-container">
      <div className="note-page-header">
        <h1>Notes for {`${student.first_name} ${student.last_name}`}</h1>
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
