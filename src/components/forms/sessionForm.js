// TODO: Context for mentor role
import React, { useState } from "react";
import axios from "axios";
import { times } from "../data";
import SideBar from "./newSessionSidebar";

const SessionForm = props => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [special_instructions, setSpecialInstrucions] = useState("");
  const [studentToEdit, setStudentToEdit] = useState("");

  const handleEditClick = student => {
    setFirstName(student.first_name);
    setLastName(student.last_name);
    setEmail(student.email);
    setPhone(student.phone);
    setDay(student.day);
    setTime(student.time);
    setSpecialInstrucions(student.special_instructions);
    setStudentToEdit(student);
  };

  const handleCancelEdit = e => {
    e.preventDefault();
    handleClearStudentToEdit();
  };

  const handleClearStudentToEdit = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDay("");
    setTime("");
    setSpecialInstrucions("");
    setStudentToEdit("");
  };

  const getStudents = () => {
    props.getStudents();
  };

  const handleSubmit = e => {
    const newSession = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      day: day,
      time: time,
      special_instructions: special_instructions,
      assigned_to: ""
    };

    e.preventDefault();

    if (studentToEdit !== "") {
      handleStudentUpdate(studentToEdit);
    } else {
      axios
        // .post("http://localhost:4000/students/new", newSession)
        .post(
          "https://rec-scheduler-api.herokuapp.com/students/new",
          newSession
        )
        .then(() => {
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setDay("");
          setTime("");
          setSpecialInstrucions("");
        })
        .then(() => getStudents())
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleStudentUpdate = student => {
    const updatedSession = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      day: day,
      time: time,
      special_instructions: special_instructions
    };

    axios
      .put(
        `https://rec-scheduler-api.herokuapp.com/students/update-form/${student._id}`,
        // `http://localhost:4000/students/update-form/${student._id}`,
        updatedSession
      )
      .then(() => {
        handleClearStudentToEdit();
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setDay("");
        setTime("");
        setSpecialInstrucions("");
      })
      .then(() => {
        getStudents();
      })
      .catch(err => {
        console.log("update error: ", err);
      });
  };

  return (
    <div className="grid-1fr-500px">
      <div className="session-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="text-field"
              required
              placeholder="First Name"
              onChange={e => setFirstName(e.target.value)}
              value={first_name}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="text-field"
              required
              placeholder="Last Name"
              onChange={e => setLastName(e.target.value)}
              value={last_name}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="text-field"
              required
              placeholder="Email"
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="form-group">
            <input
              type="phone"
              className="text-field"
              required
              placeholder="Phone"
              onChange={e => setPhone(e.target.value)}
              value={phone}
            />
          </div>
          <div className="form-group">
            <textarea
              className="textarea-field"
              placeholder="Special requests"
              value={special_instructions}
              onChange={e => {
                setSpecialInstrucions(e.target.value);
              }}
            />
          </div>

          <div className="form-group">
            <select required value={day} onChange={e => setDay(e.target.value)}>
              <option defaultValue value="">
                Select Day
              </option>
              <option>Sunday</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
            </select>

            <select
              required
              value={time}
              onChange={e => setTime(e.target.value)}
            >
              <option defaultValue value="">
                Time
              </option>
              {times.map(time => {
                return <option key={time}>{time}</option>;
              })}
            </select>
          </div>

          <div className="button-wrapper">
            <button className="btn-primary" type="submit">
              {studentToEdit !== ""
                ? "Update Student Session"
                : "Submit New Session"}
            </button>
            {studentToEdit !== "" ? (
              <button className="btn-cancel" onClick={handleCancelEdit}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <SideBar
        students={props.students}
        handleEditClick={handleEditClick}
        handleArchiveClick={props.handleArchiveClick}
        role={props.role}
        currentUser={props.currentUser}
      />
    </div>
  );
};

export default SessionForm;
