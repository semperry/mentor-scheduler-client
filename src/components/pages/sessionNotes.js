import React, { useState } from "react";
import { withRouter } from "react-router";
import axios from "axios";
import customData from "../data";

const SessionNotes = props => {
  const [notes, setNotes] = useState("");
  const [hours_studied, setHoursStudied] = useState("");
  const [weekly_goal, setWeeklyGoal] = useState("");
  const [questions, setQuestions] = useState("");
  const [percentage, setPercentage] = useState("");
  const [mentor, setMentor] = useState(props.location.state.mentor);
  const [student, setStudent] = useState(props.location.state.student);
  const [submitText, setSubmitText] = useState("");
  const [extraNote, setExtraNote] = useState(
    props.location.state.extraNote || false
  );

  const handleComplete = e => {
    e.preventDefault();
    if (extraNote) {
      // axios
      //   .put(`http://localhost:4000/students/completed/${student._id}`, {
      axios
        .put(
          `https://rec-scheduler-api.herokuapp.com/students/completed/${student._id}`,
          {
            assigned_to: student.assigned_to,
            last_submitted_by: `${customData.nameCapitalizer(
              mentor.first_name
            )} ${customData.nameCapitalizer(mentor.last_name)}`
          }
        )
        .catch(err => {
          console.log("completed err: ", err);
        });
      props.history.push("/");
    } else {
      axios
        // .post("http://localhost:4000/redis/complete", { id: student._id })
        .post("https://rec-scheduler-api.herokuapp.com/redis/complete", {
          id: student._id
        })
        .then(res => {
          console.log(res);
        })
        .then(() => {
          // axios.put(`http://localhost:4000/students/completed/${student._id}`, {
          axios.put(
            `https://rec-scheduler-api.herokuapp.com/students/completed/${student._id}`,
            {
              assigned_to: "",
              last_submitted_by: `${customData.nameCapitalizer(
                mentor.first_name
              )} ${customData.nameCapitalizer(mentor.last_name)}`
            }
          );
        })
        .then(() => {
          props.history.push("/sessions");
        })
        .catch(err => {
          console.log("completed err: ", err);
        });
    }
  };

  const handleSubmitNotes = e => {
    const sendNotes = {
      notes: notes.trim(),
      hours_studied: hours_studied.trim(),
      weekly_goal: weekly_goal.trim(),
      questions: questions.trim(),
      percentage: customData.percentSignFormatter(percentage),
      submitted_by: `${customData.nameCapitalizer(
        mentor.first_name
      )} ${customData.nameCapitalizer(mentor.last_name)}`
    };

    e.preventDefault();
    axios
      // .put(`http://localhost:4000/students/notes/${student._id}`, {
      .put(
        `https://rec-scheduler-api.herokuapp.com/students/notes/${student._id}`,
        {
          info: sendNotes
        }
      )
      .then(res => {
        if (res.status === 200) {
          setSubmitText("Notes Submitted!");
        } else {
          console.log("Notes: ", res);
        }
      })
      .catch(err => {
        console.log("put notes err: ", err);
      });
  };

  return (
    <div className="container">
      <div className="ticket-page-wrapper">
        <div className="ticket-detail">
          <div className="ticket-detail__top__heading">
            <h1>{`${student.first_name} ${student.last_name}`}</h1>
          </div>
          <br />
          <h1>{student.phone}</h1>
          <br />

          <h1>{student.email}</h1>
          <br />

          <h2>{student.special_instructions}</h2>

          <div className="comments-container__form-container">
            <form onSubmit={handleSubmitNotes}>
              <div className="form-group">
                <input
                  className="text-field"
                  type="number"
                  value={hours_studied}
                  onChange={e => setHoursStudied(e.target.value)}
                  placeholder="Hours Studied"
                />

                <input
                  className="text-field"
                  type="number"
                  value={weekly_goal}
                  onChange={e => setWeeklyGoal(e.target.value)}
                  placeholder="Weekly Goal"
                />
              </div>
              <div className="form-group">
                <input
                  className="text-field"
                  type="text"
                  value={percentage}
                  onChange={e => setPercentage(e.target.value)}
                  placeholder="Percentage Complete"
                />

                <input
                  className="text-field"
                  type="text"
                  value={questions}
                  onChange={e => setQuestions(e.target.value)}
                  placeholder="Questions"
                />
              </div>
              <div className="form-group">
                <textarea
                  required
                  className="text-area-field"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ height: 150 }}
                  placeholder="Session Notes"
                />
              </div>
              {submitText === "" ? (
                <button type="submit" className="btn-primary">
                  Submit Notes
                </button>
              ) : (
                <h2>{submitText}</h2>
              )}
            </form>
          </div>
          <div className="ticket-detail__bottom">
            {submitText !== "" && !extraNote ? (
              <button onClick={handleComplete} className="btn-primary">
                Mark Complete
              </button>
            ) : submitText !== "" && extraNote ? (
              <button className="btn-primary" onClick={handleComplete}>
                Back Home
              </button>
            ) : (
              <span>Submit notes above first</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SessionNotes);
