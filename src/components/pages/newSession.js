import React, { Component } from "react";

import NewSessionForm from "../forms/newSessionForm";

export default class NewSession extends Component {
  constructor() {
    super();
  }

  render() {
    return (
    <div className="container">
      <NewSessionForm />
    </div>
    )
  }
}
