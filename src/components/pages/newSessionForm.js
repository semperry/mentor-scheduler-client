// TODO: Context for handledeleteclick and students
import React, { useState, useEffect } from "react";
import axios from "axios";

import SessionForm from "../forms/sessionForm";

const NewSessionForm = props => {
  const [students, setStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState(props.currentUser);

  const handleDeleteClick = student => {
    axios
      .delete(`http://localhost:4000/students/delete/${student._id}`)
      // .delete(
      //   `https://rec-scheduler-api.herokuapp.com/students/delete/${student._id}`
      // )
      .then(res => {
        setStudents(
          students.filter(remaining => {
            return remaining._id !== student._id;
          })
        );
      })
      .catch(err => {
        console.log("del err: ", err);
      });
  };

  const handleSuccesfulFormSubmit = student => {
    setStudents([student].concat(students));
  };

  const handleFormSubmissionError = err => {
    console.log("handleFormSubmissionError: ", err);
  };

  const getStudents = () => {
    axios
      .get("http://localhost:4000/students")
      // .get("https://rec-scheduler-api.herokuapp.com/students")
      .then(res => {
        setStudents([...res.data]);
      })
      .catch(err => {
        console.log("Get Eror in NewSessionForm", err);
      });
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="container">
      <SessionForm
        getStudents={getStudents}
        handleSuccesfulFormSubmit={handleSuccesfulFormSubmit}
        handleFormSubmissionError={handleFormSubmissionError}
        students={students}
        handleDeleteClick={handleDeleteClick}
        role={props.role}
        currentUser={props.currentUser}
      />
    </div>
  );
};

export default NewSessionForm;
