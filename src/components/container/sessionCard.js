import React, { useState } from "react";

const SessionCard = props => {
  const [session, setSession] = useState(props.session);

  const handleClick = id => {
    props.clearId();
    props.setId(id);
  };

  const setId = id => {
    props.setId(id);
  };

  return (
      <div
        className="ticket-sidebar-wrapper__items-wrapper__item"
        onClick={() => handleClick(session._id)}
      >
      <div className="ticket-sidebar-wrapper__items-wrapper__item__left">
        {session.day
          .split("")
          .splice(0, 3)
          .join("")
          .toUpperCase()}

        <div className="ticket-sidebar-wrapper__items-wrapper__item__left__title">
          {session.first_name + " " + session.last_name}
        </div>
      </div>
      <div className="ticket-sidebar-wrapper__items-wrapper__item__timestamp">
        {session.time}
      </div>
    </div>
  )
}

export default SessionCard;
