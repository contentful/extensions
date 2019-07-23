import React from 'react';
import PropTypes from 'prop-types';

import { Select, Option, Button, Icon } from '@contentful/forma-36-react-components';

import { parametersToConfig } from './config';
import NeflifySidebarBuildButton from './netlify-sidebar-build-button';

import styles from './styles';

export default class NetlifySidebar extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { sites } = parametersToConfig(this.props.sdk.parameters.installation);

    this.state = {
      users: [],
      sites,
      selectedSiteIndex: 0
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
    this.loadUsers();
  }

  loadUsers = async () => {
    const { items } = await this.props.sdk.space.getUsers();

    this.setState({ users: items });
  };

  selectSite = e => {
    this.setState({ selectedSiteIndex: parseInt(e.target.value, 10) });
  };

  render() {
    const { sites, selectedSiteIndex, users } = this.state;
    const selectedSite = sites[selectedSiteIndex];

    return (
      <>
        <NeflifySidebarBuildButton
          key={`${selectedSiteIndex},${users.length}`}
          users={users}
          userId={this.props.sdk.user.sys.id}
          site={selectedSite}
        />
        <Button
          href={selectedSite.netlifySiteUrl}
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
            <Option key={site.buildHookId} value={`${index}`} data-testid={`option-${index}`}>
              {site.name}
            </Option>
          ))}
        </Select>
      </>
    );
  }
}
