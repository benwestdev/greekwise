import React, { Component } from "react";
import { Icon } from "semantic-ui-react";

import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => (
  <Icon name="sign-out" onClick={firebase.AuthApi.doSignOut} />
);

class SignOutBase extends Component {
  componentDidMount() {
    this.props.firebase.AuthApi.doSignOut();
  }
  render() {
    return <h1>Singing out</h1>;
  }
}

const SignOut = withFirebase(SignOutBase);
export { SignOut };
export default withFirebase(SignOutButton);
