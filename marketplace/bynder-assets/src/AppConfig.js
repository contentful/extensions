import React from 'react';
import PropTypes from 'prop-types';

export default class AppConfig extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = { ready: false, bynderURL: '' };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { platformAlpha, space } = this.props.sdk;
    const { app } = platformAlpha;

    app.onConfigure(this.onAppConfigure);

    const [parameters, currentState, contentTypes] = await Promise.all([
      app.getParameters(),
      app.getCurrentState(),
      space.getContentTypes()
    ]);

    const bynderURL = parameters ? parameters.bynderURL || '' : '';

    this.setState({
      ready: true,
      bynderURL,
      currentState,
      contentTypes
    });
  };

  onAppConfigure = () => {
    this.props.sdk.notifier.error('Not implemented');
    return false;
  };

  render() {
    if (this.state.ready) {
      return <pre>{JSON.stringify(this.state, null, 2)}</pre>;
    } else {
      return <div>Loading...</div>;
    }
  }
}
