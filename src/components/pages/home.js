// TODO: Assigned counter per mentor
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import ManageShifts from "../schedule/manageShifts";
import Shifts from "../schedule/shifts";

const Home = props => {
  const startOfCurrentWeek = moment().startOf("week");
  const startOfNextWeek = moment()
    .startOf("week")
    .add(7, "days");
  const today = moment()
    .format("dddd")
    .toLowerCase();

  const [allMentors, setAllMentors] = useState(null);
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [ updateValue, setUpdateValue ] = useState(false)

  const handleUpdateValue = () => {
    setUpdateValue(!updateValue)
  }

  useEffect(() => {
    axios
      .get("https://rec-scheduler-api.herokuapp.com/mentors")
      // .get("http://localhost:4000/mentors")
      .then(response => setAllMentors(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="home-wrapper">
      {allMentors === null || !currentUser ? (
        <div> Loading... </div>
      ) : (
        <div>
          <div className="home-header">
            <h2> Welcome, {currentUser.first_name}</h2>
            {currentUser.week_one[0][today].start !== "" ? (
              <div className="working-today">{`You work today from ${currentUser.week_one[0][today].start} to ${currentUser.week_one[0][today].end}`}</div>
            ) : (
              <div className="working-today">You don't work today</div>
            )}
          </div>
          <div className="tables-section">
            <div className="two-tables-wrapper">
              <div className="table-label">
                <div>This is everyone's current week</div>
                <div>{`Sun ${startOfCurrentWeek.format(
                  "MMM D"
                )} — Sat ${startOfCurrentWeek
                  .add(6, "days")
                  .format("MMM D")}`}</div>
              </div>

              <Shifts
                currentWeek={"week_one"}
                currentUser={currentUser}
                allMentors={allMentors}
                updateValue={updateValue}
              />

              <div className="table-label">
                <div>This is everyone's upcoming week</div>
                <div>{`Sun ${startOfNextWeek.format(
                  "MMM D"
                )} — Sat ${startOfNextWeek
                  .add(6, "days")
                  .format("MMM D")}`}</div>
              </div>

              <Shifts
                currentWeek={"week_two"}
                currentUser={currentUser}
                allMentors={allMentors}
                updateValue={updateValue}
              />
            </div>
          </div>
          {currentUser.role === "admin" ? (
            <div>
              <div  className="tables-section" >
                <div className="two-tables-wrapper">
                  <div className="table-label" >This week</div>
                    <ManageShifts allMentors={allMentors} currentWeek={"week_one"} handleUpdateValue={handleUpdateValue} />

                  <div className="table-label" >Next week</div>
                    <ManageShifts allMentors={allMentors} currentWeek={"week_two"} handleUpdateValue={handleUpdateValue} />
            </div>
            </div>
            </div>
          ) : null}
          }
        </div>
      )}
    </div>
  );
};

export default Home;
