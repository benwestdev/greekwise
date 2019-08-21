import React, { Component } from "react";
import { Container, Header, Dimmer, Loader, Button } from "semantic-ui-react";

import { withFirebase } from "../Firebase";
import { withAuthorization, AuthUserContext } from "../Session";
import * as ROLES from "../../constants/roles";
import EventList from "./eventList";
import { compose } from "recompose";

class EventsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      allEvents: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.events().on("value", snapshot => {
      const eventObject = snapshot.val();

      if (eventObject) {
        const eventList = Object.keys(eventObject).map(key => ({
          ...eventObject[key],
          uid: key
        }));
        this.setState({
          allEvents: eventList,
          loading: false
        });
      } else {
        this.setState({ allEvents: [], loading: false });
      }
    });
  }

  handleAttend = (event, userId) => {
    console.log("attending ", event.uid, " - ", userId);
  };

  render() {
    const { allEvents, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Container className="body-container">
            <Header as="h1" textAlign="center">
              All Events
            </Header>
            {loading && (
              <Dimmer active inverted>
                <Loader inverted />
              </Dimmer>
            )}
            {allEvents.length > 0 ? (
              <Container>
                <EventList
                  events={allEvents}
                  userId={authUser.uid}
                  onAttend={this.handleAttend}
                />
              </Container>
            ) : (
              <p>Events to attend</p>
            )}
          </Container>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => authUser && !!authUser.roles[ROLES.STUDENT];
export default compose(
  withAuthorization(condition),
  withFirebase
)(EventsPage);