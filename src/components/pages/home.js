// TODO: Pass mentors as context to sessions for sessionDetails
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment"
import ManageShifts from "../schedule/manageShifts";

const Home = props => {

    const currentUser = props.currentUser

    const startOfCurrentWeek = moment().startOf("week")
    const startOfNextWeek = moment().startOf("week").add(7, "days")
    const today = moment().format("dddd").toLowerCase()

	const [allMentors, setAllMentors] = useState(null)
	

    useEffect( () => {
		axios
            .get("https://rec-scheduler-api.herokuapp.com/mentors")
            // .get("http://localhost:4000/mentors")
            .then (response => setAllMentors(response.data))
            .catch (error => console.log(error))
	},[])

    return (
        <div className="home-wrapper" >
            {allMentors === null || currentUser === null ? <div> Loading... </div> : 
            <div>
                <div className="home-header">
                    <h2> Welcome, {currentUser.first_name}</h2>
                    { currentUser.week_one[0][today].start !== "" ? 
                    <div className="working-today" >{`You work today from ${currentUser.week_one[0][today].start} to ${currentUser.week_one[0][today].end}`}</div>
                    : <div className="working-today" >You don't work today</div> 
                  }
                </div>
                <div className="tables-section">
                    <div className="two-tables-wrapper">
                        <div className="table-label" >
                            <div>This is everyone's current week</div>
                            <div>{`Sun ${startOfCurrentWeek.format("MMM D")} — Sat ${startOfCurrentWeek.add(6, "days").format("MMM D")}`}</div>
                        </div>
                        <table className="cr-table" >
                            <thead>
                                <tr className="table-top" >
                                    <th></th>
                                    <th>SUNDAY   </th>
                                    <th>MONDAY   </th>
                                    <th>TUESDAY  </th>
                                    <th>WEDNESDAY</th>
                                    <th>THURSDAY </th>
                                    <th>FRIDAY   </th>
                                    <th>SATURDAY </th>
                                </tr>
                            </thead>
                            {allMentors.map( mentor => (
                                <tbody className={mentor.email === currentUser.email ? "highlight" : null} key={mentor._id} >
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
                                </tbody>
                            ))}
                        </table>
                        <div className="table-label" >
                            <div>This is everyone's upcoming week</div>
                            <div>{`Sun ${startOfNextWeek.format("MMM D")} — Sat ${startOfNextWeek.add(6, "days").format("MMM D")}`}</div>
                        </div>
                        <table className="cr-table" >
                            <thead>
                                <tr className="table-top" >
                                    <th></th>
                                    <th>SUNDAY   </th>
                                    <th>MONDAY   </th>
                                    <th>TUESDAY  </th>
                                    <th>WEDNESDAY</th>
                                    <th>THURSDAY </th>
                                    <th>FRIDAY   </th>
                                    <th>SATURDAY </th>
                                </tr>
                            </thead>
                            {allMentors.map( mentor => (
                                <tbody className={mentor.email === currentUser.email ? "highlight" : null} key={mentor._id} >
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
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
                 {currentUser.role === "admin"  ? 
                    <div>
                        <ManageShifts allMentors={allMentors} />
                    </div>  
                    : null }
                }
            </div>
            }
        </div>
    );
};

export default Home;