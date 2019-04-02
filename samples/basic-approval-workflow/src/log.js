import React from 'react';
import PropTypes from 'prop-types';
import relativeDate from 'relative-date';

import {
  Paragraph, Card, Tag, HelpText,
} from '@contentful/forma-36-react-components';
import { spacingXs, colorElementLight } from '@contentful/forma-36-tokens';

import { eventTypes, eventNames, eventTagTypes } from './events';
import findUserById from './find-user';
import userName from './user-name';

import Avatar from './avatar';
import Vspace from './vspace';

const REFRESH_INTERVAL = 5000;

const CONTAINER_STYLE = { maxHeight: '300px', overflowY: 'auto' };
const CARD_STYLE = { display: 'flex', alignItems: 'center' };

const INFO_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: `1px solid ${colorElementLight}`,
  padding: `${spacingXs} ${spacingXs} 0`,
};

export default class Log extends React.Component {
  static propTypes = {
    log: PropTypes.arrayOf(PropTypes.object).isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  componentDidMount() {
    this.interval = window.setInterval(() => {
      // Force update to recompute relative date strings
      this.forceUpdate();
    }, REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  }

  renderLogItem = (item) => {
    const { users } = this.props;

    const user = findUserById(users, item.userId);
    const isReviewSubmitted = [eventTypes.APPROVED, eventTypes.REJECTED].includes(item.eventType);
    const hasComment = typeof item.comment === 'string' && item.comment.length > 0;

    return (
      <React.Fragment key={item.id}>
        <Card>
          <div style={CARD_STYLE}>
            <Avatar user={user} size="40px" />
            <div>
              <Tag tagType={eventTagTypes[item.eventType]}>
                {eventNames[item.eventType]}
              </Tag>
              <Paragraph>{userName(user)}</Paragraph>
              <HelpText>
                {item.local ? 'just now' : relativeDate(item.t)}
              </HelpText>
            </div>
          </div>

          {item.eventType === eventTypes.REVIEW_REQUESTED && this.renderReviewer(item)}
          {isReviewSubmitted && hasComment && this.renderComment(item)}
        </Card>
        <Vspace />
      </React.Fragment>
    );
  }

  renderReviewer = (item) => {
    const { users } = this.props;
    const reviewer = findUserById(users, item.reviewerId);

    return (
      <React.Fragment>
        <Vspace />
        <div style={INFO_STYLE}>
          <Paragraph>
            {'Reviewer: '}
            <strong>{userName(reviewer)}</strong>
          </Paragraph>
          <Avatar user={reviewer} size="20px" spacing="left" />
        </div>
      </React.Fragment>
    );
  }

  renderComment = item => (
    <React.Fragment>
      <Vspace />
      <div style={INFO_STYLE}>
        <Paragraph>
          {'Comment: '}
          <em>{item.comment}</em>
        </Paragraph>
      </div>
    </React.Fragment>
  )

  render() {
    const { log } = this.props;

    return (
      <div style={CONTAINER_STYLE}>
        {log.map(this.renderLogItem)}
      </div>
    );
  }
}
