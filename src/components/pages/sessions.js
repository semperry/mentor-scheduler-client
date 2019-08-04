// TODO: If assigned, assign button should become reassign
// TODO: full duplex implementation
// TODO: Live api test
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import SessionCard from "../container/sessionCard";
import SessionDetail from "../container/sessionDetails";

const Sessions = props => {
  const [mentors, setMentors] = useState([]);
  const [singleSession, setSingleSession] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [currentDay, setCurrentDay] = useState(
    moment()
      .format("dddd")
      .toLowerCase()
  );
  const [redisData, setRedisData] = useState([]);
  const [currentUser, setCurrentUser] = useState(props.currentUser);

  const clearId = () => {
    setCurrentId("");
  };

  const setId = id => {
    setCurrentId(id);
  };

  const getMentors = () => {
    axios
      .get("http://localhost:4000/mentors")
      .then(res => {
        setMentors(res.data);
      })
      .catch(err => {
        console.log("getMentors Error: ", err);
      });
  };

  const handleFilter = filter => {
    clearId();
    getSessions(filter);
  };

  const getSessions = (filter = "sessions") => {
    axios
      .get("http://localhost:4000/students")
      // .get("https://rec-scheduler-api.herokuapp.com/students")
      .then(res => {
        if (filter === "sessions") {
          setFilteredSessions(
            res.data.filter(student => {
              return (
                student.assigned_to === "" &&
                !redisData.includes(student._id) &&
                student.day.toLowerCase() == currentDay
              );
            })
          );
        } else if (filter === "assigned") {
          setFilteredSessions(
            res.data.filter(student => {
              return (
                student.assigned_to === currentUser.id &&
                !redisData.includes(student._id) &&
                student.day.toLowerCase() == currentDay
              );
            })
          );
        } else if (filter === "completed") {
          handleCompleted(res.data);
        }
      })
      .catch(err => {
        console.log("getSessions: ", err);
      });
  };

  const handleCompleted = students => {
    axios
      .get(`http://localhost:4000/redis/completed`)
      .then(res => {
        setRedisData(res.data);
      })
      .then(() => {
        setFilteredSessions(
          students.filter(student => {
            if (
              redisData.includes(student._id) &&
              student.day.toLowerCase() == currentDay
            ) {
              return student;
            }
          })
        );
      })
      .catch(err => {
        console.log("handleCompletedError", err);
      });
  };

  useEffect(() => {
    getMentors();
    {
      currentUser.role === "admin" ? getSessions() : handleFilter("assigned");
    }
  }, []);

  const authorizedRoutes = () => {
    return (
      <div color="#00c274">
        <button onClick={() => handleFilter("sessions")}>Sessions</button>
        <button onClick={() => handleFilter("assigned")}>Assigned</button>
        <button onClick={() => handleFilter("completed")}>Completed</button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="grid-500-1fr">
        <div color="#00c274">
          {currentUser.role === "admin" ? (
            authorizedRoutes()
          ) : (
            <div color="#00c274">
              <button onClick={() => handleFilter("assigned")}>Assigned</button>
              <button onClick={() => handleFilter("completed")}>
                Completed
              </button>
            </div>
          )}

          <div className="scroll-box">
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => {
                return (
                  <SessionCard
                    key={session._id}
                    setId={setId}
                    session={session}
                    clearId={clearId}
                  />
                );
              })
            ) : (
              <div>Currently no sessions</div>
            )}
          </div>
        </div>
        {currentId ? (
          <SessionDetail
            key={currentId}
            id={currentId}
            clearId={clearId}
            setId={setId}
            handleFilter={handleFilter}
            students={filteredSessions}
            mentors={mentors}
            currentUser={currentUser}
            redisData={redisData}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Sessions;
