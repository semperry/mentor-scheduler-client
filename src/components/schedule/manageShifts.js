import React, { useState, useRef, useEffect } from 'react'

import moment from "moment"
import axios from "axios"

const ManageShifts = props => {

	const allMentors = props.allMentors

	const modalRef = useRef()

    const startOfCurrentWeek = moment().startOf("week")
	const startOfNextWeek = moment().startOf("week").add(7, "days")
	
	const thisWeekSunday =   `Sun ${startOfCurrentWeek.format("MMM D")}` 
	const thisWeekMonday =   `Mon ${startOfCurrentWeek.add(1, "days").format("MMM D")}`
	const thisWeekTuesday =  `Tue ${startOfCurrentWeek.add(1, "days").format("MMM D")}` 
	const thisWeekWednesday =`Wed ${startOfCurrentWeek.add(1, "days").format("MMM D")}` 
	const thisWeekThursday = `Thu ${startOfCurrentWeek.add(1, "days").format("MMM D")}` 
	const thisWeekFriday =   `Fri ${startOfCurrentWeek.add(1, "days").format("MMM D")}` 
	const thisWeekSaturday = `Sat ${startOfCurrentWeek.add(1, "days").format("MMM D")}` 

	const nextWeekSunday =   `Sun ${startOfNextWeek.format("MMM D")}` 
	const nextWeekMonday =   `Mon ${startOfNextWeek.add(1, "days").format("MMM D")}`
	const nextWeekTuesday =  `Tue ${startOfNextWeek.add(1, "days").format("MMM D")}` 
	const nextWeekWednesday =`Wed ${startOfNextWeek.add(1, "days").format("MMM D")}` 
	const nextWeekThursday = `Thu ${startOfNextWeek.add(1, "days").format("MMM D")}` 
	const nextWeekFriday =   `Fri ${startOfNextWeek.add(1, "days").format("MMM D")}` 
	const nextWeekSaturday = `Sat ${startOfNextWeek.add(1, "days").format("MMM D")}` 
    
    const [showModal, setShowModal] = useState(false)
    const [clickedDate, setClickedDate] = useState("nothin yet")
	const [clickedMentor, setClickedMentor] = useState("nothin yet")
	const [clickedWeek, setClickedWeek] = useState("nothin yet")
	const [clickedDay, setClickedDay] = useState("nothin yet")
	const [startTime, setStartTime] = useState("")
	const [endTime, setEndTime] = useState("")

    const closeModal = () => {
		setStartTime("")
		setEndTime("")
      	setShowModal(false)
    }

    const handleClick = (date, mentor, week, day) => {
      setClickedDate(date)
	  setClickedMentor(mentor)
	  setClickedWeek(week)
	  setClickedDay(day)
      setShowModal(true)

	}

	const handleStartChange = event => {
		setStartTime(event.target.value)
	}

	const handleEndChange = event => {
		setEndTime(event.target.value)
	}

	const  handleShiftDelete = () => {
		let shiftObject = {
			"start": "",
			"end": ""
		}
		updatingUser(shiftObject)
	}

	const handleModalSubmission = event => {
		event.preventDefault();
		let shiftObject = {
			"start": startTime,
			"end": endTime
		}
        updatingUser(shiftObject)
	}

	const createShiftObject = (start, end) => {
		let shiftObject = {
			"start": start,
			"end": end
		}
		updatingUser(shiftObject)
	}

	const updatingUser = shiftObject => {
		clickedMentor[clickedWeek][0][clickedDay] = shiftObject
        delete clickedMentor[clickedWeek][0]._id
		axios.post(`https://rec-scheduler-api.herokuapp.com/mentors/update/${clickedMentor._id}`, clickedMentor)
		// axios.post(`http://localhost:4000/mentors/update/${clickedMentor._id}`, clickedMentor)

		closeModal()
		setStartTime("")
		setEndTime("")
	}

	const handleClickOutside = event => {
		if (modalRef.current.contains(event.target)) {
		  return
		}
		setShowModal(false)
	  }

	useEffect( () => {
		if (showModal) {
		  document.addEventListener("mousedown", handleClickOutside);
		} else {
		  document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
		  document.removeEventListener("mousedown", handleClickOutside);
		}
	  }, [showModal])

    return (
      <div>
		<div className="home-header">
        	<h2>Manage Shifts</h2>
		</div>
		<div  className="tables-section" >
			<div className="two-tables-wrapper">
				<div className="table-label" >This week</div>
				<table className="cr-table" >  
					<thead>
						<tr>
							<th></th>
							<th>{thisWeekSunday}</th>
							<th>{thisWeekMonday}</th>
							<th>{thisWeekTuesday}</th>
							<th>{thisWeekWednesday}</th>
							<th>{thisWeekThursday}</th>
							<th>{thisWeekFriday}</th>
							<th>{thisWeekSaturday}</th>
						</tr>
					</thead>
				{allMentors.map( mentor => (
					<tbody className="to-bold" key={mentor._id} >
							<tr>
								<th>{mentor.first_name}</th>
								<th onClick={ () => handleClick(thisWeekSunday,    mentor, "week_one", "sunday")}    className="editable" >{`${mentor.week_one[0].sunday.start} - ${mentor.week_one[0].sunday.end}`}</th>
								<th onClick={ () => handleClick(thisWeekMonday,    mentor, "week_one", "monday")}    className="editable" >{`${mentor.week_one[0].monday.start} - ${mentor.week_one[0].monday.end}`}</th>
								<th onClick={ () => handleClick(thisWeekTuesday,   mentor, "week_one", "tuesday")}   className="editable" >{`${mentor.week_one[0].tuesday.start} - ${mentor.week_one[0].tuesday.end}`}</th>
								<th onClick={ () => handleClick(thisWeekWednesday, mentor, "week_one", "wednesday")} className="editable" >{`${mentor.week_one[0].wednesday.start} - ${mentor.week_one[0].wednesday.end}`}</th>
								<th onClick={ () => handleClick(thisWeekThursday,  mentor, "week_one", "thursday")}  className="editable" >{`${mentor.week_one[0].thursday.start} - ${mentor.week_one[0].thursday.end}`}</th>
								<th onClick={ () => handleClick(thisWeekFriday,    mentor, "week_one", "friday")}    className="editable" >{`${mentor.week_one[0].friday.start} - ${mentor.week_one[0].friday.end}`}</th>
								<th onClick={ () => handleClick(thisWeekSaturday,  mentor, "week_one", "saturday")}  className="editable" >{`${mentor.week_one[0].saturday.start} - ${mentor.week_one[0].saturday.end}`}</th>
							</tr>
						</tbody>
				))}
				</table>
				<div className="table-label" >Next week</div>
				<table className="cr-table" >
					<thead>
						<tr>
							<th></th>
							<th>{nextWeekSunday}</th>
							<th>{nextWeekMonday}</th>
							<th>{nextWeekTuesday}</th>
							<th>{nextWeekWednesday}</th>
							<th>{nextWeekThursday}</th>
							<th>{nextWeekFriday}</th>
							<th>{nextWeekSaturday}</th>
						</tr>
					</thead>
				{allMentors.map( mentor => (
					<tbody  className="to-bold" key={mentor._id} >
							<tr>
								<th>{mentor.first_name}</th>
								<th onClick={ () => handleClick(nextWeekSunday,    mentor, "week_two", "sunday")}    className="editable" >{`${mentor.week_two[0].sunday.start} - ${mentor.week_two[0].sunday.end}`}</th>
								<th onClick={ () => handleClick(nextWeekMonday,    mentor, "week_two", "monday")}    className="editable" >{`${mentor.week_two[0].monday.start} - ${mentor.week_two[0].monday.end}`}</th>
								<th onClick={ () => handleClick(nextWeekTuesday,   mentor, "week_two", "tuesday")}   className="editable" >{`${mentor.week_two[0].tuesday.start} - ${mentor.week_two[0].tuesday.end}`}</th>
								<th onClick={ () => handleClick(nextWeekWednesday, mentor, "week_two", "wednesday")} className="editable" >{`${mentor.week_two[0].wednesday.start} - ${mentor.week_two[0].wednesday.end}`}</th>
								<th onClick={ () => handleClick(nextWeekThursday,  mentor, "week_two", "thursday")}  className="editable" >{`${mentor.week_two[0].thursday.start} - ${mentor.week_two[0].thursday.end}`}</th>
								<th onClick={ () => handleClick(nextWeekFriday,    mentor, "week_two", "friday")}    className="editable" >{`${mentor.week_two[0].friday.start} - ${mentor.week_two[0].friday.end}`}</th>
								<th onClick={ () => handleClick(nextWeekSaturday,  mentor, "week_two", "saturday")}  className="editable" >{`${mentor.week_two[0].saturday.start} - ${mentor.week_two[0].saturday.end}`}</th>
							</tr>
						</tbody>
					))}
				</table>
			</div>
		</div>
        {
          showModal ? 
			<div className="cr-modal-wrapper" >
				<section className="cr-modal" ref={modalRef} >
					<div className="cr-modal-date" >{clickedDate}</div>
					<div className="cr-modal-header" >{`Schedule ${clickedMentor.first_name}:`}</div>
					<div className="bottom-section-wrapper">
						<div className="schedule-block-row" >
							<button className="cr-block-button" onClick={() =>  createShiftObject("8AM", "4PM")}>8AM - 4PM</button>
							<button className="cr-block-button" onClick={() =>  createShiftObject("9AM", "5PM")}>9AM - 5PM</button>
							<button className="cr-block-button" onClick={() =>  createShiftObject("10AM", "6PM")}>10AM - 6PM</button>
						</div>
						<div className="schedule-block-row"  >
							<button className="cr-block-button" onClick={() =>  createShiftObject("12PM", "8PM")}>12PM - 8PM</button>
							<button className="cr-block-button" onClick={() =>  createShiftObject("1PM", "9PM")}>1PM - 9PM</button>
							<button className="cr-block-button" onClick={() =>  createShiftObject("2PM", "10PM")}>2PM - 10PM</button>
						</div>
						<form className="schedule-block-row" onSubmit={handleModalSubmission}>
							<select value={startTime} onChange={handleStartChange} >
								<option >Start</option>
								<option value="8AM" >8:00 am </option>
								<option value="9AM" >9:00 am </option>
								<option value="10AM">10:00 am</option>
								<option value="11AM">11:00 am</option>
								<option value="12PM">12:00 pm</option>
								<option value="1PM" >1:00 pm </option>
								<option value="2PM" >2:00 pm </option>
								<option value="3PM" >3:00 pm </option>
								<option value="4PM" >4:00 pm </option>
								<option value="5PM" >5:00 pm </option>
								<option value="6PM" >6:00 pm </option>
								<option value="7PM" >7:00 pm </option>
								<option value="8PM" >8:00 pm </option>
								<option value="9PM" >9:00 pm </option>
								<option value="10PM">10:00 pm</option>
							</select>
							<select value={endTime} onChange={handleEndChange} >
								<option >End</option>
								<option value="8AM" >8:00 am </option>
								<option value="9AM" >9:00 am </option>
								<option value="10AM">10:00 am</option>
								<option value="11AM">11:00 am</option>
								<option value="12PM">12:00 pm</option>
								<option value="1PM" >1:00 pm </option>
								<option value="2PM" >2:00 pm </option>
								<option value="3PM" >3:00 pm </option>
								<option value="4PM" >4:00 pm </option>
								<option value="5PM" >5:00 pm </option>
								<option value="6PM" >6:00 pm </option>
								<option value="7PM" >7:00 pm </option>
								<option value="8PM" >8:00 pm </option>
								<option value="9PM" >9:00 pm </option>
								<option value="10PM">10:00 pm</option>
							</select>
							<input  className="cr-block-button submit" type="submit" value="submit" />
						</form>
						<div className="delete-close-wrapper" >
							<button className="delete-close-button" onClick={handleShiftDelete}>Delete shift</button>
							<button className="delete-close-button" onClick={closeModal}>Close</button>
						</div>
					</div>
				</section>
			</div> 
			: null
        }
      </div>
    );
};

export default ManageShifts;