import React from 'react';
import PropTypes from 'prop-types';
import { uniq, uniqBy } from 'lodash-es';

import {
  Notification,
  Spinner,
  FieldGroup,
  CheckboxField,
  TextLink
} from '@contentful/forma-36-react-components';
import { Workbench } from '@contentful/forma-36-react-components/dist/alpha';

import { parametersToConfig, configToParameters } from './config';
import {
  currentStateToEnabledContentTypes,
  enabledContentTypesToTargetState
} from './target-state';

import NetlifyConnection from './netlify-connection';
import NetlifyConfigEditor from './netlify-config-editor';
import * as NetlifyClient from './netlify-client';
import * as NetlifyIntegration from './netlify-integration';

import styles from './styles';

export default class NetlifyAppConfig extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  async componentDidMount() {
    this.init();
  }

  componenWillUnmount() {
    this.stopPolling();
  }

  state = { ready: false };

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

    this.setState({
      ready: true,
      config,
      enabledContentTypes,
      contentTypes: contentTypesResponse.items.map(ct => [ct.sys.id, ct.name]),
      netlifySites: uniqBy(netlifySites, s => s.id),
      ticketId
    });
  };

  onAppConfigure = async () => {
    if (!this.state.token) {
      this.notifyError('You must be connected to Netlify to configure the app.');
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
        if (err) {
          this.notifyError(err, 'Failed to connect with Netlify. Try again!');
        } else if (token) {
          this.initNetlifyConnection(token);
        }
      }
    );
  };

  initNetlifyConnection = async ({ token, email }) => {
    try {
      const { sites, counts } = await NetlifyClient.listSites(token);
      Notification.success('Netlify account connected successfully.');
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

  enableContentType = id => {
    this.setState(state => ({
      ...state,
      enabledContentTypes: uniq(state.enabledContentTypes.concat([id]))
    }));
  };

  disableContentType = id => {
    this.setState(state => ({
      ...state,
      enabledContentTypes: state.enabledContentTypes.filter(cur => cur !== id)
    }));
  };

  render() {
    return (
      <Workbench>
        <Workbench.Content>
          <div className={styles.section}>
            <h3>About</h3>
            <p>
              With this app developers can do a very quick set up, authors can control when the
              static pages are created and see the current status of the build process.
            </p>
          </div>

          {this.state.ready ? (
            <>
              <NetlifyConnection
                connected={!!this.state.token}
                email={this.state.email}
                netlifyCounts={this.state.netlifyCounts}
                onConnectClick={this.onConnectClick}
              />

              <div className={styles.section}>
                <h3>Build Netlify sites</h3>
                <p>
                  Pick the Netlify sites you want to enable build for.
                  {!this.state.token && ' Requires Netlify account.'}
                </p>
                <NetlifyConfigEditor
                  disabled={!this.state.token}
                  siteConfigs={this.state.config.sites}
                  netlifySites={this.state.netlifySites}
                  onSiteConfigsChange={this.onSiteConfigsChange}
                />
              </div>
              <div className={styles.section}>
                <h3>Enable for content types</h3>
                <p>
                  Select content types of which entries will have Netlify App in their sidebars.
                </p>
                <p>
                  <TextLink
                    disabled={!this.state.token}
                    onClick={() => {
                      this.state.contentTypes.forEach(([id]) => this.enableContentType(id));
                    }}>
                    Select all
                  </TextLink>
                </p>
                <FieldGroup>
                  {this.state.contentTypes.map(([name, id]) => (
                    <CheckboxField
                      key={id}
                      id={`ct-box-${id}`}
                      labelText={name}
                      onChange={e => {
                        if (e.target.checked) {
                          this.enableContentType(id);
                        } else {
                          this.disableContentType(id);
                        }
                      }}
                      disabled={!this.state.token}
                      checked={this.state.enabledContentTypes.includes(id)}
                    />
                  ))}
                </FieldGroup>
              </div>
            </>
          ) : (
            <div>
              Loading <Spinner />
            </div>
          )}
        </Workbench.Content>
      </Workbench>
    );
  }
}
