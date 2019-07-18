// Filters by assigned bool
// Add response box
// This needs to hold all things scroll box related
import React from "react";

import SessionCard from "./sessionCard";

export default class ScrollContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <div className="scroll-box">
          {this.props.sessions.map(session => {
            return (
              <SessionCard
                key={session._id}
                setId={this.props.setId}
                session={session}
                clearId={this.props.clearId}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
