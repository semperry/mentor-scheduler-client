import React, { useState } from "react";

const NoteCard = props => {
  const [notes, setNotes] = useState(props.note);

  return (
    <div className="notecard-wrapper">
      <div className="notecard-top-container">
        <div>
          <div className="note-group">
            <h1>Date:</h1>
            <h1>{notes.date.slice(0, 10)}</h1>
          </div>
          <div className="note-group">
            <h1>Percentage:</h1>
            <h1>{notes.percentage}</h1>
          </div>
          <div className="note-group">
            <h1>Studied:</h1>
            <h1>{notes.hours_studied}</h1>
          </div>
          <div className="note-group">
            <h1>Goal:</h1>
            <h1>{notes.weekly_goal}</h1>
          </div>
          <div className="note-group">
            <h1>Questions:</h1>
            <h1>{notes.questions}</h1>
          </div>
        </div>
        <div className="notes-container">
          <h1>Notes:</h1>
          <div className="note-group notes">
            <h1>{notes.notes}</h1>
            {/* <div className="note-content">{notes.notes}</div> */}
          </div>
        </div>
      </div>
      <div className="notecard-bottom-container">
        <div className="bottom-content">
          <h1>Mentor: {notes.submitted_by}</h1>
          <button className="btn-primary">Something</button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
