import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { init } from 'contentful-ui-extensions-sdk';
import { Select, Option } from '@contentful/forma-36-react-components';
import NeflifySideBarBuildButton from './NetlifySideBarBuildButton';

const readCsvParam = csv =>
  (csv || '')
    .split(',')
    .map(val => val.trim())
    .filter(val => val.length > 0);

function createSiteStructure(parameters = {}) {
  const buildHooks = readCsvParam(parameters.buildHookUrls);
  const channels = readCsvParam(parameters.channels);
  const siteIds = readCsvParam(parameters.netlifySiteIds);
  const names = readCsvParam(parameters.names);
  const urls = readCsvParam(parameters.netlifySiteUrls);

  return buildHooks.reduce(
    (acc, _, i) =>
      acc.concat([
        {
          buildHookUrl: buildHooks[i],
          channel: channels[i],
          netlifySiteId: siteIds[i],
          name: names[i],
          url: urls[i]
        }
      ]),
    []
  );
}

export default class NetlifyExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
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
    this.setState({ selectedSiteIndex: parseInt(e.target.value, 10) });
  };

  render() {
    return (
      <>
        <NeflifySideBarBuildButton
          users={this.state.users}
          userId={this.props.sdk.user.sys.id}
          site={this.state.sites[this.state.selectedSiteIndex]}
          publishKey={this.props.sdk.parameters.installation.publishKey}
          subscribeKey={this.props.sdk.parameters.installation.subscribeKey}
        />
        <Select onChange={this.selectSite}>
          {this.state.sites.map((site, index) => (
            <Option key={site.netlifySiteId} value={`${index}`}>
              {site.name}
            </Option>
          ))}
        </Select>
      </>
    );
  }
}

init(sdk => {
  ReactDOM.render(<NetlifyExtension sdk={sdk} />, document.getElementById('root'));
});
