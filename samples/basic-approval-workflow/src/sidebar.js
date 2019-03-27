import React from 'react';
import PropTypes from 'prop-types';

import { Note, SkeletonContainer, SkeletonBodyText } from '@contentful/forma-36-react-components';

import loadPubNub from './pubnub-loader';
import createPubNubClient from './pubnub-client';
import App from './app';

export default class Sidebar extends React.Component {
  state = {}

  static propTypes = {
    sdk: PropTypes.shape({
      entry: PropTypes.shape({
        getSys: PropTypes.func.isRequired,
      }).isRequired,
      space: PropTypes.shape({
        getUsers: PropTypes.func.isRequired,
      }).isRequired,
      parameters: PropTypes.shape({
        instance: PropTypes.shape({
          publishKey: PropTypes.string.isRequired,
          subscribeKey: PropTypes.string.isRequired,
          channelPrefix: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      window: PropTypes.shape({
        startAutoResizer: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }

  async componentDidMount() {
    try {
      this.setState(await this.initialize());
    } catch (error) {
      this.setState({ error });
    }
  }

  componentWillUnmount() {
    const { pubnub } = this.state;
    if (pubnub) {
      pubnub.disconnect();
    }
  }

  initialize = async () => {
    const { sdk } = this.props;

    const [PubNub, users] = await Promise.all([
      loadPubNub(),
      sdk.space.getUsers(),
      // Avoid blink if things are too fast:
      new Promise(resolve => setTimeout(resolve, 300)),
    ]);

    sdk.window.startAutoResizer();

    const parameters = sdk.parameters.instance;
    const pubnub = await createPubNubClient({
      PubNub,
      publishKey: parameters.publishKey,
      subscribeKey: parameters.subscribeKey,
      channelPrefix: parameters.channelPrefix,
      entrySys: sdk.entry.getSys(),
      onChange: log => this.setState({ log }),
    });

    return {
      sdk, users: users.items, pubnub, log: pubnub.log,
    };
  }

  render = () => {
    const {
      error, sdk, users, pubnub, log,
    } = this.state;

    if (error) {
      return (
        <Note noteType="warning" title="Failed to load">
          We failed to load this extension. Please reload the page!
        </Note>
      );
    }

    if (sdk && pubnub && log) {
      return (
        <App sdk={sdk} users={users} pubnub={pubnub} log={log} />
      );
    }

    return (
      <SkeletonContainer>
        <SkeletonBodyText numberOfLines={5} />
      </SkeletonContainer>
    );
  };
}
