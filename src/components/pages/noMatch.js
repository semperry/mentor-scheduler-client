import React from "react";

const NoMatch = props => {
  return (
    <div>
      <h1>Couldn't find page: {props.location.pathname.split("/")}</h1>
    </div>
  );
};

export default NoMatch;
