import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import tokens from '@contentful/forma-36-tokens';
import { Select, Option, Button } from '@contentful/forma-36-react-components';

import NeflifySidebarBuildButton from './build-button';

import { parametersToConfig } from '../config';

const styles = {
  previewContent: css({
    display: 'flex',
    alignContent: 'center'
  }),
  separator: css({
    marginTop: tokens.spacingS
  })
};

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
        <Select onChange={this.selectSite}>
          {this.state.sites.map((site, idx) => (
            <Option key={site.buildHookId} value={`${idx}`}>
              {site.name}
            </Option>
          ))}
        </Select>
        <div className={styles.separator} />
        <NeflifySidebarBuildButton
          key={`${selectedSiteIndex},${users.length}`}
          users={users}
          userId={this.props.sdk.user.sys.id}
          site={selectedSite}
        />
        <div className={styles.separator} />
        <Button
          icon="ExternalLink"
          href={selectedSite.netlifySiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          buttonType="muted"
          isFullWidth>
          <div className={styles.previewContent}>Open preview</div>
        </Button>
      </>
    );
  }
}
