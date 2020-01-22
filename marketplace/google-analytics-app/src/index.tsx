import * as React from 'react';
import { render } from 'react-dom';
// import PropTypes from 'prop-types';
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

const CLIENT_ID = '318721834234-s3td95ohvub1bkksn3aicimnltvmtts8.apps.googleusercontent.com';

export class SidebarExtension extends React.Component<
  {
    sdk: SidebarExtensionSDK;
  },
  {
    parameters: object;
    isAuthorized: boolean;
    hasSlug: boolean;
    pagePath: boolean;
  }
> {
  constructor(props) {
    super(props);
    const { sdk } = props;
    const { parameters, entry } = sdk;
    const { prefix, slugId } = parameters;
    const hasSlug = slugId in entry.fields;

    const pagePath = hasSlug
      ? `/${prefix ? `${prefix}/` : ''}${entry.fields[slugId].getValue()}/`
      : '';

    this.state = {
      isAuthorized: false,
      hasSlug,
      pagePath
    };
  }

  componentDidMount() {
    const { auth } = window.gapi.analytics;

    auth.on('signIn', () => this.setState({ isAuthorized: true }));
    auth.on('signOut', () => this.setState({ isAuthorized: false }));
    auth.authorize({
      container: 'auth-button',
      clientid: CLIENT_ID
    });

    this.props.sdk.window.startAutoResizer();
  }

  onButtonClick = async () => {
    const result = await this.props.sdk.dialogs.openExtension({
      width: 800,
      title: 'The same extension rendered in modal window'
    });
    // eslint-disable-next-line no-console
    console.log(result);
  };

  render() {
    const { isAuthorized, pagePath, hasSlug } = this.state;
    const { sdk } = this.props;
    const { parameters } = sdk;

    if (!isAuthorized) {
      return null;
    }

    if (!hasSlug) {
      return <p>Slug field is not correctly defined.</p>;
    }

    return (
      <section>
        <Analytics pagePath={pagePath} viewId={parameters.viewId} />
      </section>
    );
  }
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(<AppConfig sdk={sdk as AppExtensionSDK} />, document.getElementById('root'));
  } else {
    render(<SidebarExtension sdk={sdk as SidebarExtensionSDK} />, document.getElementById('root'));
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
