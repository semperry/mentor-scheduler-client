import React, { Component } from "react";

export default class SessionCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: props.session
    };
  }

  setId = id => {
    this.props.setId(id);
  };

  render() {
    const session = this.state.session;
    return (
      <div
        className="ticket-sidebar-wrapper__items-wrapper__item"
        onClick={() => this.setId(session._id)}
      >
        <div className="ticket-sidebar-wrapper__items-wrapper__item__left">
          image
          <div className="ticket-sidebar-wrapper__items-wrapper__item__left__title">
            {session.name}
          </div>
        </div>
        <div className="ticket-sidebar-wrapper__items-wrapper__item__timestamp">
          {session.time}
        </div>
      </div>
    );
  }
}
