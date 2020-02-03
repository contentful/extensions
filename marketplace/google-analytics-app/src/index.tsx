import * as React from 'react';
import debounce from 'lodash/debounce';
import { render } from 'react-dom';
import {
  init,
  locations,
  AppExtensionSDK,
  SidebarExtensionSDK
} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import AppConfig from './AppConfig';

import Analytics from './Analytics';
import { SidebarExtensionState, SidebarExtensionProps, Gapi, SavedParams } from './typings';
import styles from './styles';

export class SidebarExtension extends React.Component<
  SidebarExtensionProps,
  SidebarExtensionState
> {
  state: SidebarExtensionState;

  constructor(props: SidebarExtensionProps) {
    super(props);

    this.state = {
      isAuthorized: props.gapi.analytics.auth.isAuthorized(),
      ...this.getEntryStateFields()
    };
  }

  componentDidMount() {
    const { sdk, gapi } = this.props;
    const { auth } = gapi.analytics;

    sdk.window.startAutoResizer();

    auth.on('signIn', () => this.setState({ isAuthorized: true }));
    auth.on('signOut', () => this.setState({ isAuthorized: false }));

    this.props.sdk.entry.onSysChanged(
      debounce(() => {
        this.setState(this.getEntryStateFields());
      }, 500)
    );
  }

  getEntryStateFields() {
    const { entry, parameters } = this.props.sdk;
    const contentTypeId = (entry.getSys() as { contentType: { sys: { id: string } } }).contentType
      .sys.id;
    const { urlPrefix, slugField } = (parameters.installation as SavedParams).contentTypes[
      contentTypeId
    ];
    const hasSlug = slugField in entry.fields;

    const pagePath = hasSlug
      ? `/${urlPrefix || ''}${entry.fields[slugField].getValue() || ''}`
      : '';

    return {
      hasSlug,
      pagePath,
      contentTypeId
    };
  }

  render() {
    const { isAuthorized, pagePath, hasSlug, contentTypeId } = this.state;
    const { parameters, entry, notifier } = this.props.sdk;
    const { clientId, viewId } = parameters.installation as SavedParams;

    if (!isAuthorized) {
      const renderAuthButton = async (authButton: HTMLDivElement) => {
        try {
          this.props.gapi.analytics.auth.authorize({
            container: authButton,
            clientid: clientId
          });
        } catch (error) {
          notifier.error("The client ID set in this app's config is invalid");
        }
      };

      return (
        <div
          ref={renderAuthButton}
          className={isAuthorized ? styles.hidden : styles.signInButton}
        />
      );
    }

    if (!hasSlug) {
      return <p>This {contentTypeId} entry doesn&apos;t have a valid slug field.</p>;
    }

    if (!(entry.getSys() as { publishedAt?: Date }).publishedAt) {
      return <p>This {contentTypeId} entry hasn&apos;t been published.</p>;
    }

    return (
      <section>
        <Analytics
          sdk={this.props.sdk}
          gapi={this.props.gapi}
          pagePath={pagePath}
          viewId={viewId}
        />
      </section>
    );
  }
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(<AppConfig sdk={sdk as AppExtensionSDK} />, document.getElementById('root'));
  } else {
    render(
      <SidebarExtension
        sdk={sdk as SidebarExtensionSDK}
        gapi={((window as unknown) as { gapi: Gapi }).gapi}
      />,
      document.getElementById('root')
    );
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
