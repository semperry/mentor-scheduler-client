import React, { useState, useEffect } from "react";

const Shifts = props => {
  const [currentWeek, setCurrentWeek] = useState("");
  const [allMentors, setAllMentors] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  const renderTable = () => {
    return (
      <table className="cr-table">
        <thead>
          <tr className="table-top">
            <th></th>
            <th>SUNDAY </th>
            <th>MONDAY </th>
            <th>TUESDAY </th>
            <th>WEDNESDAY</th>
            <th>THURSDAY </th>
            <th>FRIDAY </th>
            <th>SATURDAY </th>
          </tr>
        </thead>
        {allMentors.map(mentor => (
          <tbody
            className={mentor.email === currentUser.email ? "highlight" : null}
            key={mentor._id}
          >
            {currentWeek == "week_one" ? (
              <tr>
                <th>{`${mentor.first_name} ${mentor.last_name}`}</th>
                <th>{`${mentor.week_one[0].sunday.start} -    ${mentor.week_one[0].sunday.end}`}</th>
                <th>{`${mentor.week_one[0].monday.start} -    ${mentor.week_one[0].monday.end}`}</th>
                <th>{`${mentor.week_one[0].tuesday.start} -   ${mentor.week_one[0].tuesday.end}`}</th>
                <th>{`${mentor.week_one[0].wednesday.start} - ${mentor.week_one[0].wednesday.end}`}</th>
                <th>{`${mentor.week_one[0].thursday.start} -  ${mentor.week_one[0].thursday.end}`}</th>
                <th>{`${mentor.week_one[0].friday.start} -    ${mentor.week_one[0].friday.end}`}</th>
                <th>{`${mentor.week_one[0].saturday.start} -  ${mentor.week_one[0].saturday.end}`}</th>
              </tr>
            ) : (
              <tr>
                <th>{`${mentor.first_name} ${mentor.last_name}`}</th>
                <th>{`${mentor.week_two[0].sunday.start} -    ${mentor.week_two[0].sunday.end}`}</th>
                <th>{`${mentor.week_two[0].monday.start} -    ${mentor.week_two[0].monday.end}`}</th>
                <th>{`${mentor.week_two[0].tuesday.start} -   ${mentor.week_two[0].tuesday.end}`}</th>
                <th>{`${mentor.week_two[0].wednesday.start} - ${mentor.week_two[0].wednesday.end}`}</th>
                <th>{`${mentor.week_two[0].thursday.start} -  ${mentor.week_two[0].thursday.end}`}</th>
                <th>{`${mentor.week_two[0].friday.start} -    ${mentor.week_two[0].friday.end}`}</th>
                <th>{`${mentor.week_two[0].saturday.start} -  ${mentor.week_two[0].saturday.end}`}</th>
              </tr>
            )}
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
