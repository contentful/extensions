import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { init } from 'contentful-ui-extensions-sdk';
import { Select, Option, Button, Icon } from '@contentful/forma-36-react-components';
import NeflifySideBarBuildButton from './NetlifySideBarBuildButton';

import styles from './styles';

const readCsvParam = csv =>
  (csv || '')
    .split(',')
    .map(val => val.trim())
    .filter(val => val.length > 0);

function createSiteStructure(parameters = {}) {
  const buildHooks = readCsvParam(parameters.buildHookUrls);
  const siteIds = readCsvParam(parameters.netlifySiteIds);
  const names = readCsvParam(parameters.names);
  const urls = readCsvParam(parameters.netlifySiteUrls);

  return buildHooks.reduce(
    (acc, _, i) =>
      acc.concat([
        {
          buildHookUrl: buildHooks[i],
          channel: buildHooks[i].split('/').pop(),
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

  openPreview = () => {
    window.open(this.state.sites[this.state.selectedSiteIndex].url);
  };

  render() {
    return (
      <>
        <NeflifySideBarBuildButton
          users={this.state.users}
          userId={this.props.sdk.user.sys.id}
          site={this.state.sites[this.state.selectedSiteIndex]}
        />
        <Button
          onClick={this.openPreview}
          buttonType="muted"
          isFullWidth
          data-testid="preview-button"
          className={styles.previewButton}>
          <Icon icon="ExternalLink" color="muted" className={styles.previewIcon} />
          Open preview
        </Button>
        <Select onChange={this.selectSite} data-testid="site-selector">
          {this.state.sites.map((site, index) => (
            <Option key={site.netlifySiteId} value={`${index}`} data-testid={`option-${index}`}>
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
