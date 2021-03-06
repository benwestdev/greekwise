import React, { Component } from "react";
import { compose } from "recompose";
import { Container, Header, List, Divider, Card } from "semantic-ui-react";
import moment from "moment";
import "./style.css";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import * as STATUSES from "../../constants/statuses";

class PointsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { attendances: [], loading: false, pointMap: null };
  }

  componentDidMount() {
    this.props.firebase.AttendanceApi.getAttendanceByUser(
      this.props.authUser.uid
    ).then(attendances => {
      let pointMap = Object.assign({}, STATUSES.EVENT_TYPES_MAP);
      attendances.forEach(attendance => {
        if (attendance.status === STATUSES.APPROVED) {
          if (pointMap.hasOwnProperty(attendance.eventType)) {
            pointMap[attendance.eventType] += Number(attendance.points);
          }
        }
      });
      this.setState({ attendances, pointMap });
    });
  }

  render() {
    const { pointMap, attendances } = this.state;
    return (
      <Container className="body-container">
        <Header as="h1" textAlign="center">
          My Points
        </Header>
        <TotalPoints pointMap={pointMap} />
        <EventAttendance attendances={attendances} />
      </Container>
    );
  }
}

const EventAttendance = ({ attendances }) => (
  <Container>
    <Header textAlign="center" className="top-margin" as="h1">
      My Attended Events
    </Header>
    <Card.Group className="top-margin" centered>
      {attendances.map(attendance => {
        return (
          <Card key={attendance.uid} className="effect6">
            <Card.Content>
              <Card.Header>{attendance.eventName}</Card.Header>
              <Card.Meta content={attendance.eventType} />
              <Card.Description>
                <p>{moment(attendance.date).format("LL")}</p>
                <div>
                  {attendance.status === STATUSES.APPROVED && (
                    <p className="green status-big">{attendance.status}</p>
                  )}
                  {attendance.status === STATUSES.PENDING && (
                    <p className="orange status-big">{attendance.status}</p>
                  )}
                  {attendance.status === STATUSES.DENIED && (
                    <p className="red status-big">{attendance.status}</p>
                  )}
                  {attendance.status === STATUSES.APPROVED && (
                    <p className="green big-points">{attendance.points}</p>
                  )}
                  {attendance.status === STATUSES.PENDING && (
                    <p className="orange big-points">{attendance.points}</p>
                  )}
                  {attendance.statua === STATUSES.DENIED && (
                    <p className="red big-points">{attendance.points}</p>
                  )}
                </div>
              </Card.Description>
            </Card.Content>
          </Card>
        );
      })}
    </Card.Group>
  </Container>
);

const TotalPoints = ({ pointMap }) => (
  <Container textAlign="center">
    <List className="centered-list">
      {pointMap &&
        Object.keys(pointMap).map((key, index) => {
          return (
            <div key={key}>
              <List.Item>
                <List.Content>
                  <List.Header className="huge-count">
                    {pointMap[key] < 50 && (
                      <span className="red">{pointMap[key]}</span>
                    )}
                    {pointMap[key] >= 50 && pointMap[key] < 100 && (
                      <span className="orange">{pointMap[key]}</span>
                    )}
                    {pointMap[key] >= 100 && (
                      <span className="green">{pointMap[key]}</span>
                    )}
                  </List.Header>
                  {key}
                </List.Content>
              </List.Item>
              <Divider />
            </div>
          );
        })}
    </List>
  </Container>
);

const condition = authUser => authUser && !!authUser.roles[ROLES.STUDENT];
export default compose(
  withAuthorization(condition),
  withFirebase
)(PointsPage);
