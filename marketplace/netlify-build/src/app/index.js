import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
import { SkeletonContainer, SkeletonBodyText } from '@contentful/forma-36-react-components';
import {
  currentStateToEnabledContentTypes,
  enabledContentTypesToTargetState
} from './target-state';

import NetlifyConnection from './netlify-connection';
import NetlifyConfigEditor from './netlify-config-editor';
import NetlifyContentTypes from './netlify-content-types';
import * as NetlifyClient from './netlify-client';
import * as NetlifyIntegration from './netlify-integration';
import NetlifyIcon from './NetlifyIcon';
import styles from './styles';

import { parametersToConfig, configToParameters } from '../config';

export default class NetlifyAppConfig extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  state = {
    ready: false
  };

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  init = async () => {
    const { sdk } = this.props;
    const { app } = sdk.platformAlpha;

    app.onConfigure(this.onAppConfigure);

    const [parameters, currentState, contentTypesResponse] = await Promise.all([
      app.getParameters(),
      app.getCurrentState(),
      sdk.space.getContentTypes()
    ]);

    const config = parametersToConfig(parameters);
    const enabledContentTypes = currentStateToEnabledContentTypes(currentState);

    // First empty site (so no UI click is needed).
    if (!Array.isArray(config.sites) || config.sites.length < 1) {
      config.sites = [{}];
    }

    // Initially we are not connected to Netlify and we don't have
    // a full list of Netlify sites.
    // Here we are computing a list consisting of sites we know
    // of so we can offer Netlify site labels even before connecting.
    const netlifySites = config.sites
      .filter(s => s.netlifySiteName)
      .map(s => ({ id: s.netlifySiteId, name: s.netlifySiteName }));

    const ticketId = await NetlifyClient.createTicket();

    this.setState(
      {
        ready: true,
        config,
        enabledContentTypes,
        contentTypes: contentTypesResponse.items.map(ct => [ct.sys.id, ct.name]),
        netlifySites: uniqBy(netlifySites, s => s.id),
        ticketId
      },
      app.setReady
    );
  };

  onAppConfigure = async () => {
    if (!this.state.token) {
      this.notifyError('You must be connected to Netlify to configure the app.');
      return false;
    }

    const configuredNetlifySiteIds = this.state.config.sites.map(site => site.netlifySiteId);
    const availableNetlifySiteIds = this.state.netlifySites.map(site => site.id);

    if (!configuredNetlifySiteIds.every(id => availableNetlifySiteIds.includes(id))) {
      this.notifyError(
        'Looks like some sites were deleted in Netlify. Pick a new site or remove outdated configuration.'
      );
      return false;
    }

    try {
      const isInstalled = await this.props.sdk.platformAlpha.app.isInstalled();
      const method = isInstalled ? 'update' : 'install';
      const config = await NetlifyIntegration[method]({
        config: this.state.config, // eslint-disable-line react/no-access-state-in-setstate
        accessToken: this.state.token // eslint-disable-line react/no-access-state-in-setstate
      });

      this.setState({ config });

      return {
        parameters: configToParameters(config),
        targetState: enabledContentTypesToTargetState(
          this.state.contentTypes,
          this.state.enabledContentTypes
        )
      };
    } catch (err) {
      this.notifyError(err, 'Failed to configure the app.');
      return false;
    }
  };

  notifyError = (err, fallbackMessage) => {
    let message = fallbackMessage || 'Operation failed.';
    if (typeof err === 'string') {
      message = err;
    } else if (err.useMessage && err.message) {
      message = err.message;
    }

    this.props.sdk.notifier.error(message);
  };

  stopPolling = () => {
    // Once authentication process is started, we poll for results.
    // When we leave this page or start a new OAuth flow authentication
    // process is aborted and the polling needs to be cancelled.
    if (this.cancelTicketPolling) {
      this.cancelTicketPolling();
    }
  };

  onConnectClick = async () => {
    this.stopPolling();

    this.cancelTicketPolling = NetlifyClient.getAccessTokenWithTicket(
      this.state.ticketId,
      (err, token) => {
        if (err || !token) {
          this.notifyError(err, 'Failed to connect with Netlify. Try again!');
        } else {
          this.initNetlifyConnection(token);
        }
      }
    );
  };

  initNetlifyConnection = async ({ token, email }) => {
    try {
      const { sites, counts } = await NetlifyClient.listSites(token);
      this.props.sdk.notifier.success('Netlify account connected successfully.');
      this.setState({ token, email, netlifySites: sites, netlifyCounts: counts });
    } catch (err) {
      this.notifyError(err, 'Failed to connect with Netlify. Try again!');
    }
  };

  onSiteConfigsChange = siteConfigs => {
    this.setState(state => ({
      ...state,
      config: { ...state.config, sites: siteConfigs }
    }));
  };

  onEnabledContentTypesChange = enabledContentTypes => {
    this.setState({ enabledContentTypes });
  };

  render() {
    const disabled = !this.state.token;
    return (
      <>
        <div className={styles.background} />
        <div className={styles.body}>
          <NetlifyConnection
            ready={this.state.ready}
            connected={!disabled}
            hasConfig={!!this.state.config}
            email={this.state.email}
            netlifyCounts={this.state.netlifyCounts}
            onConnectClick={this.onConnectClick}
          />
          {this.state.ready ? (
            <div className={styles.relative}>
              {disabled && <div className={styles.configurationProtector} />}
              <NetlifyConfigEditor
                disabled={disabled}
                siteConfigs={this.state.config.sites}
                netlifySites={this.state.netlifySites}
                onSiteConfigsChange={this.onSiteConfigsChange}
              />
              <NetlifyContentTypes
                disabled={disabled}
                contentTypes={this.state.contentTypes}
                enabledContentTypes={this.state.enabledContentTypes}
                onEnabledContentTypesChange={this.onEnabledContentTypesChange}
              />
            </div>
          ) : (
            <SkeletonContainer width="100%">
              <SkeletonBodyText numberOfLines={3} offsetTop={55} />
            </SkeletonContainer>
          )}
        </div>
        <div className={styles.icon}>
          <NetlifyIcon />
        </div>
      </>
    );
  }
}
