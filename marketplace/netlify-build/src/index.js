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
          // we are taking the last part of the url which is a generated ID made by netlify
          // they will be unique and unguessable, suitable for using as a channel
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

    // eslint-disable-next-line
    this.setState({ users: items });
  }

  selectSite = e => {
    this.setState({ selectedSiteIndex: parseInt(e.target.value, 10) });
  };

  render() {
    const { sites, selectedSiteIndex } = this.state;
    const selectedSite = sites[selectedSiteIndex];

    return (
      <>
        <NeflifySideBarBuildButton
          users={this.state.users}
          userId={this.props.sdk.user.sys.id}
          site={selectedSite}
        />
        <Button
          href={selectedSite.url}
          target="_blank"
          rel="noopener noreferrer"
          buttonType="muted"
          isFullWidth
          data-testid="preview-button"
          className={styles.previewButton}>
          <div className={styles.previewContent}>
            <Icon icon="ExternalLink" color="muted" className={styles.previewIcon} />
            Open preview
          </div>
        </Button>
        <Select onChange={this.selectSite} data-testid="site-selector">
          {' '}
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
