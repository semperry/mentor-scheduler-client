// TODO
//Solve issue where we can't reassign if mentor is relieved.
//Concat filteredSessions in lieu of axios call
//Reduce amount of http requests
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import customData from "../data";

import SessionCard from "../container/sessionCard";
import SessionDetail from "../container/sessionDetails";

const Sessions = props => {
  const [mentors, setMentors] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [currentDay, setCurrentDay] = useState(
    moment()
      .format("dddd")
      .toLowerCase()
  );
  const [redisData, setRedisData] = useState([]);
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [socket, setSocket] = useState("");
  const [activeButton, setActiveButton] = useState("");
  const [assignedCount, setAssignedCount] = useState(0);

  const renderAssignedCounter = () => {
    return (
      <div className="assigned-count">
        {mentors.map(mentor => {
          let count = 0;
          allSessions.map(session => {
            session.assigned_to === mentor._id &&
            session.day.toLowerCase() === currentDay
              ? count++
              : null;
          });

          return mentor._id === currentUser.id ? (
            <div key={mentor._id} className="active-user-count">
              Yours: {count}
            </div>
          ) : (
            <div key={mentor._id} className="other-user-count">
              {mentor.first_name}: {count}
            </div>
          );
        })}
      </div>
    );
  };

  const filterAssigned = student => {
    setFilteredSessions(
      filteredSessions.filter(session => {
        session._id !== student._id;
      })
    );
  };

  const clearId = () => {
    setCurrentId("");
  };

  const setId = id => {
    setCurrentId(id);
  };

  const getMentors = () => {
    axios
      // .get("http://localhost:4000/mentors")
      .get("https://rec-scheduler-api.herokuapp.com/mentors")
      .then(res => {
        setMentors(res.data);
      })
      .catch(err => {
        console.log("getMentors Error: ", err);
      });
  };

  const handleFilter = filter => {
    setActiveButton(filter);
    clearId();
    getSessions(filter);
  };

  const getSessions = filter => {
    axios
      // .get(`http://localhost:4000/redis/completed`)
      .get(`https://rec-scheduler-api.herokuapp.com/redis/completed`)
      .then(res => {
        setRedisData(res.data);
      })
      .then(() => {
        axios
          // .get("http://localhost:4000/students")
          .get("https://rec-scheduler-api.herokuapp.com/students")
          .then(res => {
            setAllSessions(res.data);
            if (filter === "sessions") {
              setFilteredSessions(
                customData
                  .returnsDataWithSortedTimes(res.data)
                  .filter(student => {
                    return (
                      !student.archived &&
                      (student.assigned_to === null ||
                        student.assigned_to === "") &&
                      !redisData.includes(student._id) &&
                      student.day.toLowerCase() == currentDay
                    );
                  })
              );
            } else if (filter === "assigned") {
              setFilteredSessions(
                customData
                  .returnsDataWithSortedTimes(res.data)
                  .filter(student => {
                    return (
                      !student.archived &&
                      student.assigned_to === currentUser.id &&
                      !redisData.includes(student._id) &&
                      student.day.toLowerCase() == currentDay
                    );
                  })
              );
            } else if (filter === "completed") {
              handleCompleted(customData.returnsDataWithSortedTimes(res.data));
            }
          })
          .catch(err => {
            console.log("getSessions: ", err);
          });
      })
      .catch(err => console.log("getRedisData within Sessions err ", err));
  };

  const handleCompleted = students => {
    axios
      // .get(`http://localhost:4000/redis/completed`)
      .get(`https://rec-scheduler-api.herokuapp.com/redis/completed`)
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

  const handleReceiveMessage = messageData => {
    if (messageData.assigned_to === currentUser._id) {
      setTimeout(() => {
        document.title = "New Assigned!";
      }, 500);

      handleFilter("assigned");
      //  setFilteredSessions(filteredSessions.concat(JSON.parse(messageData)));
    } else {
      null;
    }
  };

  const handleSendMessage = messageData => {
    socket.send(JSON.stringify(messageData));
  };

  useEffect(() => {
    setAssignedCount(
      allSessions.filter(students => {
        return (
          !students.archived &&
          students.assigned_to === currentUser.id &&
          !redisData.includes(students._id) &&
          students.day.toLowerCase() == currentDay
        );
      }).length
    );

    document.title =
      assignedCount === 0
        ? "No Sessions Assigned"
        : assignedCount === 1
        ? "You Have 1 Session"
        : assignedCount > 1
        ? `You Have ${assignedCount} Sessions`
        : null;

    return () => (document.title = "Bottega Scheduler");
  }, [allSessions, filteredSessions, currentId]);

  useEffect(() => {
    const socket = new WebSocket("wss://rec-scheduler-wss.herokuapp.com");
    // const socket = new WebSocket("ws://localhost:8080");
    setSocket(socket);

    socket.addEventListener("message", e => {
      handleReceiveMessage(e.data);
    });

    return () => socket.close();
  }, []);

  useEffect(() => {
    getMentors();
    handleFilter("assigned");
  }, []);

  const authorizedRoutes = () => {
    return (
      <div color="#00c274">
        <button
          className={activeButton === "sessions" ? "active" : ""}
          onClick={() => handleFilter("sessions")}
        >
          Sessions
        </button>
        <button
          className={activeButton === "assigned" ? "active" : ""}
          onClick={() => handleFilter("assigned")}
        >
          Assigned
        </button>
        <button
          className={activeButton === "completed" ? "active" : ""}
          onClick={() => handleFilter("completed")}
        >
          Completed
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="grid-500-1fr">
        <div color="#00c274">
          {currentUser.roles.includes("admin") ? (
            authorizedRoutes()
          ) : (
            <div color="#00c274">
              <button
                className={activeButton === "assigned" ? "active" : ""}
                onClick={() => handleFilter("assigned")}
              >
                Assigned
              </button>
              <button
                className={activeButton === "completed" ? "active" : ""}
                onClick={() => handleFilter("completed")}
              >
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
            handleSendMessage={handleSendMessage}
            filterAssigned={filterAssigned}
          />
        ) : (
          renderAssignedCounter()
        )}
      </div>
    </div>
  );
};

export default Sessions;
