import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import tokens from '@contentful/forma-36-tokens';
import { Button, ValidationMessage } from '@contentful/forma-36-react-components';

import { normalizeMessage, isOutOfOrder, isDuplicate, messageToState } from './message-processor';
import { createPubSub } from './pubnub-client';

import { EVENT_TRIGGERED, EVENT_TRIGGER_FAILED } from '../constants';

const styles = {
  info: css({
    color: tokens.colorTextLight,
    marginTop: tokens.spacingS,
    marginBottom: tokens.spacingM,
    fontSize: tokens.fontSizeS,
    fontWeight: tokens.fontWeightNormal
  }),
  header: css({
    display: 'flex',
    marginBottom: tokens.spacingS
  })
};

export default class NeflifySidebarBuildButton extends React.Component {
  static propTypes = {
    site: PropTypes.object.isRequired,
    users: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    userId: PropTypes.string.isRequired
  };

  state = { history: [] };

  componentDidMount() {
    this.createPubSub();
  }

  createPubSub = async () => {
    const { site } = this.props;

    if (!site.name || !site.netlifySiteId || !site.buildHookId) {
      this.setState({ misconfigured: true });
      return;
    }

    this.pubsub = createPubSub(
      site.netlifySiteId + site.buildHookId,
      normalizeMessage.bind(null, site.netlifySiteId, this.props.users)
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

    const { buildHookId } = this.props.site;
    const buildHookUrl = `https://api.netlify.com/build_hooks/${buildHookId}`;
    const res = await fetch(buildHookUrl, { method: 'POST' });

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
        <Button disabled={!ready || busy} loading={busy} isFullWidth onClick={this.build}>
          {busy && status ? status : 'Build website'}
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
