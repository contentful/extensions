import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import tokens from '@contentful/forma-36-tokens';
import { Select, Option, Button, Icon } from '@contentful/forma-36-react-components';

import NeflifySidebarBuildButton from './build-button';

import { parametersToConfig } from '../config';

const styles = {
  previewButton: css({
    margin: `${tokens.spacingS} 0`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  previewContent: css({
    display: 'flex',
    alignContent: 'center'
  }),
  previewIcon: css({
    marginRight: tokens.spacing2Xs,
    marginTop: '1px'
  })
}

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
          {this.state.sites.map((site, idx) => (
            <Option key={site.buildHookId} value={`${idx}`} data-testid={`option-${idx}`}>
              {site.name}
            </Option>
          ))}
        </Select>
      </>
    );
  }
}
