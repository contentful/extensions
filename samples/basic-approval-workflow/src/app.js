import React from 'react';
import PropTypes from 'prop-types';

import { Button, Paragraph, Note } from '@contentful/forma-36-react-components';

import { eventTypes } from './events';
import id from './id';
import findUserById from './find-user';
import userName from './user-name';

import Vspace from './vspace';
import Log from './log';
import ReviewBox from './review-box';

export default class App extends React.Component {
  state = {}

  static propTypes = {
    log: PropTypes.arrayOf(PropTypes.object).isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    sdk: PropTypes.shape({
      entry: PropTypes.shape({
        onSysChanged: PropTypes.func.isRequired,
        getSys: PropTypes.func.isRequired,
      }).isRequired,
      space: PropTypes.shape({
        getEntry: PropTypes.func.isRequired,
        publishEntry: PropTypes.func.isRequired,
      }),
      user: PropTypes.object.isRequired,
      dialogs: PropTypes.shape({
        openExtension: PropTypes.func.isRequired,
      }).isRequired,
      notifier: PropTypes.shape({
        success: PropTypes.func.isRequired,
        error: PropTypes.func.isRequired,
      }).isRequired,
      parameters: PropTypes.shape({
        instance: PropTypes.shape({
          webhookUrl: PropTypes.string,
        }).isRequired,
      }).isRequired,
      ids: PropTypes.shape({
        extension: PropTypes.string.isRequired,
        space: PropTypes.string.isRequired,
        environment: PropTypes.string.isRequired,
        entry: PropTypes.string.isRequired,
      }),
    }).isRequired,
    pubnub: PropTypes.shape({
      publish: PropTypes.func.isRequired,
    }).isRequired,
  }

  componentDidMount() {
    const { sdk } = this.props;
    this.off = sdk.entry.onSysChanged((sys) => {
      this.setState({ currentVersion: sys.version });
    });
  }

  componentWillUnmount() {
    if (typeof this.off === 'function') {
      this.off();
    }
  }

  render = () => {
    const { log, users } = this.props;
    const { currentVersion, busy } = this.state;

    const [last] = log;
    const eventType = last && last.eventType;
    const isApproved = eventType === eventTypes.APPROVED;
    const canPublish = isApproved && last.version === currentVersion;

    const renderChildren = {
      [eventTypes.REVIEW_REQUESTED]: () => this.renderReviewInProgress(last),
      [eventTypes.APPROVED]: () => this.renderApproved(last, canPublish),
    }[eventType] || (() => this.renderRequestButton());

    return (
      <React.Fragment>
        {renderChildren()}
        <Vspace />
        <Button
          buttonType={canPublish ? 'positive' : 'muted'}
          icon="CheckCircle"
          onClick={this.publish}
          disabled={!canPublish || busy}
          loading={busy}
          isFullWidth
        >
          Publish
        </Button>
        <Vspace />
        <Log log={log} users={users} />
      </React.Fragment>
    );
  }

  renderRequestButton = () => (
    <Button
      buttonType="primary"
      icon="Users"
      onClick={this.requestReview}
      isFullWidth
    >
      Pick a reviewer
    </Button>
  )

  renderReviewInProgress = (item) => {
    const { users, sdk } = this.props;

    const requester = findUserById(users, item.userId);
    const reviewer = findUserById(users, item.reviewerId);

    const isRequester = sdk.user.sys.id === requester.sys.id;
    if (isRequester) {
      return (
        <React.Fragment>
          <Paragraph>
            {'You\'re awaiting review of '}
            <strong>{userName(reviewer)}</strong>
            {'.'}
          </Paragraph>
          <Vspace />
          <Button
            buttonType="negative"
            onClick={this.cancelReviewRequest}
            isFullWidth
          >
            Cancel review request
          </Button>
        </React.Fragment>
      );
    }

    const isReviewer = sdk.user.sys.id === reviewer.sys.id;
    if (isReviewer) {
      return (
        <React.Fragment>
          <Paragraph>
            <strong>{userName(requester)}</strong>
            {' is awaiting your review.'}
          </Paragraph>
          <Vspace />
          <ReviewBox onApproved={this.approve} onRejected={this.reject} />
        </React.Fragment>
      );
    }

    return (
      <Note>
        {userName(requester)}
        {' is awaiting review of '}
        <strong>{userName(reviewer)}</strong>
        {'.'}
      </Note>
    );
  }

  renderApproved = (item, canPublish) => {
    const { users } = this.props;
    const { busy } = this.state;

    if (busy) {
      return null;
    }

    const reviewer = findUserById(users, item.userId);

    return (
      <React.Fragment>
        {canPublish && (
        <Paragraph>
          {'The current version was approved by '}
          <strong>{userName(reviewer)}</strong>
          {'.'}
        </Paragraph>
        )}
        {!canPublish && (
        <React.Fragment>
          <Note>
            {'The entry was modified since the last approval by '}
            <strong>{userName(reviewer)}</strong>
            {'. This needs to be reviewed again.'}
          </Note>
          <Vspace />
          {this.renderRequestButton()}
        </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  requestReview = async () => {
    const { sdk, users } = this.props;

    const reviewer = await sdk.dialogs.openExtension({
      title: 'Pick a reviewer',
      id: sdk.ids.extension,
      width: 400,
      parameters: { users },
    });

    if (reviewer) {
      this.dispatchChange(eventTypes.REVIEW_REQUESTED, {
        reviewerId: reviewer.sys.id,
      });
      sdk.notifier.success(`Requested review from ${userName(reviewer)}.`);
    }
  }

  cancelReviewRequest = () => this.dispatchChange(eventTypes.REVIEW_REQUEST_CANCELED)

  approve = data => this.dispatchChange(eventTypes.APPROVED, data)

  reject = data => this.dispatchChange(eventTypes.REJECTED, data)

  publish = async () => {
    const { sdk } = this.props;
    const { space, entry, notifier } = sdk;

    this.setState({ busy: true });

    try {
      const data = await space.getEntry(entry.getSys().id);
      await space.publishEntry(data);
      this.dispatchChange(eventTypes.PUBLISHED);
      notifier.success('Entry published successfully.');
    } catch (err) {
      notifier.error('Failed to publish the entry. Try again!');
    }

    this.setState({ busy: false });
  }

  dispatchChange = (eventType, data = {}) => {
    const { sdk, pubnub } = this.props;
    const { currentVersion } = this.state;

    const item = {
      ...data,
      eventType,
      id: id(),
      userId: sdk.user.sys.id,
      version: currentVersion,
      spaceId: sdk.ids.space,
      environmentId: sdk.ids.environment,
      entryId: sdk.ids.entry,
    };

    this.callWebhook(item);

    // Send a message for real-time sync and persistence
    pubnub.publish(item);

    // Update local state for instant changes
    this.setState(state => ({
      ...state,
      log: [{ ...item, local: true }].concat(state.log),
    }));
  }

  callWebhook = async (data) => {
    // Failing to deliver a webhook call should not crash the app.
    try {
      const { sdk } = this.props;
      const { webhookUrl } = sdk.parameters.instance;
      const valid = typeof webhookUrl === 'string' && webhookUrl.startsWith('https://');

      if (valid) {
        const [url] = webhookUrl.split('?'); // Ignore provided QS
        const qs = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
        await fetch(`${url}?${qs}`);
      }
    } catch (err) {
      // Ignore no matter what...
    }
  }
}
