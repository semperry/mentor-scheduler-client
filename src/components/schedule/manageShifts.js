import React, { useState, useRef, useEffect } from 'react'
import moment from "moment"
import axios from "axios"

const ManageShifts = props => {
	const [allMentors, setAllMentors] = useState(props.allMentors)
	const [ currentWeek, setCurrentWeek ] = useState(props.currentWeek)
	const [showModal, setShowModal] = useState(false)
	const [clickedDate, setClickedDate] = useState("nothin yet")
	const [clickedMentor, setClickedMentor] = useState("nothin yet")
	const [clickedWeek, setClickedWeek] = useState("nothin yet")
	const [clickedDay, setClickedDay] = useState("nothin yet")
	const [startTime, setStartTime] = useState("")
	const [endTime, setEndTime] = useState("")

	const modalRef = useRef()
	const startOfCurrentWeek = moment().startOf("week")
	const startOfNextWeek = moment().startOf("week").add(7, "days")
	
	const weekObj = {
		"week_one": [
			`Sun ${startOfCurrentWeek.format("MMM D")}`, 
			`Mon ${startOfCurrentWeek.add(1, "days").format("MMM D")}`,
			`Tue ${startOfCurrentWeek.add(1, "days").format("MMM D")}`,
			`Wed ${startOfCurrentWeek.add(1, "days").format("MMM D")}`, 
			`Thu ${startOfCurrentWeek.add(1, "days").format("MMM D")}`, 
			`Fri ${startOfCurrentWeek.add(1, "days").format("MMM D")}`, 
			`Sat ${startOfCurrentWeek.add(1, "days").format("MMM D")}`
		],
		"week_two": [
			`Sun ${startOfNextWeek.format("MMM D")}`,
			`Mon ${startOfNextWeek.add(1, "days").format("MMM D")}`,
			`Tue ${startOfNextWeek.add(1, "days").format("MMM D")}`, 
			`Wed ${startOfNextWeek.add(1, "days").format("MMM D")}`, 
			`Thu ${startOfNextWeek.add(1, "days").format("MMM D")}`, 
			`Fri ${startOfNextWeek.add(1, "days").format("MMM D")}`, 
			`Sat ${startOfNextWeek.add(1, "days").format("MMM D")}`
		]
	}	

	const timeArr = [
		"8:00 am",
		"9:00 am",
		"10:00 am",
		"11:00 am",
		"12:00 pm",
		"1:00 pm",
		"2:00 pm",
		"3:00 pm",
		"4:00 pm",
		"5:00 pm",
		"6:00 pm",
		"7:00 pm",
		"8:00 pm",
		"9:00 pm",
		"10:00 pm"
	]

	const closeModal = () => {
		setStartTime("")
		setEndTime("")
		props.handleUpdateValue()
		setShowModal(false)
	}

	const handleClick = (date, mentor, week, day) => {
		setClickedDate(date)
	  setClickedMentor(mentor)
	  setClickedWeek(week)
	  setClickedDay(day)
		setShowModal(true)
	}

	const handleModalSubmission = event => {
		event.preventDefault();
			updatingUser({"start": startTime, "end": endTime })
	}

	const updatingUser = shiftObject => {
		clickedMentor[clickedWeek][0][clickedDay] = shiftObject
		delete clickedMentor[clickedWeek][0]._id
		axios
			.post(`https://rec-scheduler-api.herokuapp.com/mentors/update/${clickedMentor._id}`, clickedMentor)
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
				<table className="cr-table" >  
					<thead>
						<tr>
							<th></th>
							{weekObj[currentWeek].map( dayOfWeek => {
								return <th key={dayOfWeek}>{dayOfWeek}</th>
							})}
						</tr>
					</thead>
				{allMentors.map( mentor => (
					<tbody className="to-bold" key={mentor._id} >
							<tr>
								<th>{mentor.first_name}</th>
								<th onClick={ () => handleClick(weekObj[currentWeek][0], mentor, currentWeek, "sunday")} className="editable" >{`${mentor[currentWeek][0].sunday.start} - ${mentor[currentWeek][0].sunday.end}`}</th>
								<th onClick={ () => handleClick(weekObj[currentWeek][1], mentor, currentWeek, "monday")}    className="editable" >{`${mentor[currentWeek][0].monday.start} - ${mentor[currentWeek][0].monday.end}`}</th>
								<th onClick={ () => handleClick(weekObj[currentWeek][2], mentor, currentWeek, "tuesday")}   className="editable" >{`${mentor[currentWeek][0].tuesday.start} - ${mentor[currentWeek][0].tuesday.end}`}</th>
								<th onClick={ () => handleClick(weekObj[currentWeek][3], mentor, currentWeek, "wednesday")} className="editable" >{`${mentor[currentWeek][0].wednesday.start} - ${mentor[currentWeek][0].wednesday.end}`}</th>
								<th onClick={ () => handleClick(weekObj[currentWeek][4], mentor, currentWeek, "thursday")}  className="editable" >{`${mentor[currentWeek][0].thursday.start} - ${mentor[currentWeek][0].thursday.end}`}</th>
								<th onClick={ () => handleClick(weekObj[currentWeek][5], mentor, currentWeek, "friday")}    className="editable" >{`${mentor[currentWeek][0].friday.start} - ${mentor[currentWeek][0].friday.end}`}</th>
								<th onClick={ () => handleClick(weekObj[currentWeek][6], mentor, currentWeek, "saturday")}  className="editable" >{`${mentor[currentWeek][0].saturday.start} - ${mentor[currentWeek][0].saturday.end}`}</th>
							</tr>
						</tbody>
				))}
				</table>
        {
          showModal ? 
			<div className="cr-modal-wrapper" >
				<section className="cr-modal" ref={modalRef} >
					<div className="cr-modal-date" >{clickedDate}</div>
					<div className="cr-modal-header" >{`Schedule ${clickedMentor.first_name}:`}</div>
					<div className="bottom-section-wrapper">
						<div className="schedule-block-row" >
							<button className="cr-block-button" onClick={() =>  updatingUser({"start": "8AM", "end": "4PM"})}>8AM - 4PM</button>
							<button className="cr-block-button" onClick={() =>  updatingUser({"start": "9AM", "end": "5PM"})}>9AM - 5PM</button>
							<button className="cr-block-button" onClick={() =>  updatingUser({"start": "10AM", "end": "6PM"})}>10AM - 6PM</button>
						</div>
						<div className="schedule-block-row"  >
							<button className="cr-block-button" onClick={() =>  updatingUser({"start": "12PM", "end": "8PM"})}>12PM - 8PM</button>
							<button className="cr-block-button" onClick={() =>  updatingUser({"start": "1PM", "end": "9PM"})}>1PM - 9PM</button>
							<button className="cr-block-button" onClick={() =>  updatingUser({"start": "2PM", "end": "10PM"})}>2PM - 10PM</button>
						</div>
						<form className="schedule-block-row" onSubmit={handleModalSubmission}>
							<select value={startTime} onChange={e => setStartTime(e.target.value)} >
								<option >Start</option>
								{timeArr.map(time => {
									return <option key={`${time}${startTime}`} value={time.length === 7 ? time[0] + time.slice(-2).toUpperCase() : time[0]+time[1] + time.slice(-2).toUpperCase() }>{time}</option>
								})}
								
							</select>
							<select value={endTime} onChange={e => setEndTime(e.target.value)} >
								<option >End</option>
								{timeArr.map(time => {
									return <option key={`${time}${endTime}`}value={time.length === 7 ? time[0] + time.slice(-2).toUpperCase() : time[0]+time[1] + time.slice(-2).toUpperCase() }>{time}</option>
								})}
							</select>
							<input  className="cr-block-button submit" type="submit" value="submit" />
						</form>
						<div className="delete-close-wrapper" >
							<button className="delete-close-button" onClick={() => updatingUser({"start": "", "end": ""})}>Delete shift</button>
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