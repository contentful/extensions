import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { init } from 'contentful-ui-extensions-sdk';
import { createPubSub } from './pubnub-client';
import { Select, Option } from '@contentful/forma-36-react-components';
import NeflifySideBarBuildButton from './NetlifySideBarBuildButton';

function createSiteStructure(parameters = {}) {
  const buildHooks = parameters.buildHookUrls.split(',');
  const channels = parameters.channels.split(',');
  const siteIds = parameters.netlifySiteIds.split(',');
  const names = parameters.names.split(',');
  const urls = parameters.netlifySiteUrls.split(',');

  const sites = [];

  for (let i = 0; i < buildHooks.length; i++) {
    sites.push({
      buildHookUrl: buildHooks[i],
      channel: channels[i],
      netlifySiteId: siteIds[i],
      name: names[i],
      url: urls[i]
    });
  }

  return sites;
}

export default class NetlifyExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
    createPubSub: PropTypes.func.isRequired
  };

  state = {
    users: [],
    sites: createSiteStructure(this.props.sdk.parameters.installation),
    selectedSiteIndex: 0
  };

  async componentDidMount() {
    this.props.sdk.window.startAutoResizer();
    const { items } = await this.props.sdk.space.getUsers();
    this.setState({ users: items });
  }

  selectSite = e => {
    this.setState({ selectedSiteIndex: Number(e.target.value) });
  };

  render() {
    if (!this.state.users.length) {
      return null;
    }

    return (
      <>
        <NeflifySideBarBuildButton
          users={this.state.users}
          createPubSub={this.props.createPubSub}
          userId={this.props.sdk.user.sys.id}
          site={this.state.sites[this.state.selectedSiteIndex]}
          publishKey={this.props.sdk.parameters.installation.publishKey}
          subscribeKey={this.props.sdk.parameters.installation.subscribeKey}
        />
        <Select onChange={this.selectSite}>
          {this.state.sites.map((site, index) => (
            <Option key={site.netlifySiteId} value={index}>
              {site.name} (Netlify app)
            </Option>
          ))}
        </Select>
      </>
    );
  }
}

init(sdk => {
  ReactDOM.render(
    <NetlifyExtension sdk={sdk} createPubSub={createPubSub} />,
    document.getElementById('root')
  );
});
