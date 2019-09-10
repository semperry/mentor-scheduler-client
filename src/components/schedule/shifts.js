import React, { useState, useEffect } from "react";

const Shifts = props => {
  const [currentWeek, setCurrentWeek] = useState("");
  const [allMentors, setAllMentors] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [days, setDays] = useState([
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ]);

  const renderTable = () => {
    return (
      <table className="cr-table">
        <thead>
          <tr className="table-top">
            <th></th>
            {days.map(day => {
              return <th key={day}>{day.toUpperCase()}</th>;
            })}
          </tr>
        </thead>
        {allMentors.map(mentor => (
          <tbody
            className={mentor.email === currentUser.email ? "highlight" : null}
            key={mentor._id}
          >
            <tr>
              <th>{`${mentor.first_name} ${mentor.last_name}`}</th>
              {mentor[currentWeek].map(shift => {
                return days.map(i => {
                  return (
                    <th key={i}>{`${shift[i].start} - ${shift[i].end}`}</th>
                  );
                });
              })}
            </tr>
          </tbody>
        ))}
      </table>
    );
  };

  useEffect(() => {
    setCurrentWeek(props.currentWeek);
    setAllMentors(props.allMentors);
    setCurrentUser(props.currentUser);
  });

  return <div>{renderTable()}</div>;
};

export default Shifts;
