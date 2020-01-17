import * as React from 'react';
import { render } from 'react-dom';
import { Button } from '@contentful/forma-36-react-components';
import {
  init,
  locations,
  DialogExtensionSDK,
  SidebarExtensionSDK
} from 'contentful-ui-extensions-sdk';
import tokens from '@contentful/forma-36-tokens';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export class DialogExtension extends React.Component<{
  sdk: DialogExtensionSDK;
}> {
  render() {
    return (
      <div style={{ margin: tokens.spacingM }}>
        <Button
          testId="close-dialog"
          buttonType="muted"
          onClick={() => {
            this.props.sdk.close('data from modal dialog');
          }}>
          Close modal
        </Button>
      </div>
    );
  }
}

export class SidebarExtension extends React.Component<{
  sdk: SidebarExtensionSDK;
}> {
  componentDidMount() {
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
    return (
      <Button
        testId="open-dialog"
        buttonType="positive"
        isFullWidth={true}
        onClick={this.onButtonClick}>
        Click on me to open dialog extension
      </Button>
    );
  }
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    render(<DialogExtension sdk={sdk as DialogExtensionSDK} />, document.getElementById('root'));
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
