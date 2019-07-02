import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';
import { Button, ValidationMessage } from '@contentful/forma-36-react-components';
import { normalizeMessage, isOutOfOrder, isDuplicate, messageToState } from './message-processor';
import { createPubSub } from './pubnub-client';

import '@contentful/forma-36-react-components/dist/styles.css';
import styles from './styles';

import { EVENT_TRIGGERED, EVENT_TRIGGER_FAILED } from './contstants';

export default class NeflifySideBarBuildButton extends React.Component {
  static propTypes = {
    site: PropTypes.object.isRequired,
    users: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    userId: PropTypes.string.isRequired,
    publishKey: PropTypes.string.isRequired,
    subscribeKey: PropTypes.string.isRequired
  };

  state = { history: [] };

  async componentDidMount() {
    this.createPubSub();
  }

  componentDidUpdate(newProps) {
    if (this.props.site !== newProps.site && this.pubsub) {
      this.pubsub.stop();
      this.createPubSub();
    }
  }

  createPubSub = async () => {
    const { site } = this.props;

    if (!site.channel || !site.netlifySiteId || !site.buildHookUrl) {
      this.setState({ misconfigured: true });
      return;
    }

    this.pubsub = createPubSub(
      site.channel,
      normalizeMessage.bind(null, site.netlifySiteId, this.props.users),
      this.props.publishKey,
      this.props.subscribeKey
    );

    this.pubsub.addListener(msg => {
      const inOrder = !isOutOfOrder(msg, this.state.history);
      const notDuplicate = !isDuplicate(msg, this.state.history);

      if (inOrder && notDuplicate) {
        this.setState(({ history }) => {
          return {
            history: [msg].concat(history),
            ...messageToState(msg)
          };
        });
      }
    });

    await this.pubsub.start();

    const history = await this.pubsub.getHistory();
    const filteredHistory = history
      .filter((msg, i, history) => !isOutOfOrder(msg, history.slice(i + 1)))
      .filter((msg, i, history) => !isDuplicate(msg, history.slice(i + 1)));

    if (filteredHistory.length > 0) {
      this.setState({
        history: filteredHistory,
        ...messageToState(filteredHistory[0])
      });
    }

    this.setState({ ready: true });
  };

  componentWillUnmount() {
    if (this.pubsub) {
      this.pubsub.stop();
    }
  }

  build = async () => {
    this.pubsub.publish({
      contentful: true,
      event: EVENT_TRIGGERED,
      userId: this.props.userId
    });

    const res = await fetch(this.props.site.buildHookUrl, { method: 'POST' });

    if (!res.ok) {
      this.pubsub.publish({
        contentful: true,
        event: EVENT_TRIGGER_FAILED
      });
    }
  };

  render() {
    const { ready, busy, status, misconfigured, info, ok } = this.state;

    return (
      <div className={styles.body}>
        <Button
          disabled={!ready || busy}
          loading={busy}
          isFullWidth
          onClick={this.build}
          data-testid="build-button"
          className={styles.button}>
          {busy && status ? status : 'Build'}
        </Button>
        {misconfigured && (
          <div className={styles.info}>
            <ValidationMessage>Check Netlify App configuration!</ValidationMessage>
          </div>
        )}
        {info && (
          <div className={styles.info}>
            {ok && info}
            {!ok && <ValidationMessage>{info}</ValidationMessage>}
          </div>
        )}
      </div>
    );
  }
}
