import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Paragraph } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

const normalize = part => part.replace(/\/$/, '');

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.detachFn = this.props.sdk.entry.onSysChanged(this.onSysChanged);

    this.props.sdk.window.startAutoResizer();
  };

  componentWillUnmount = () => {
    this.detachFn();
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }
  };

  onError = error => {
    this.setState({ working: false });
    this.props.sdk.notifier.error(error.message);
  };

  onSysChanged = () => {
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }
    this.debounceInterval = setInterval(this.refreshGatsbyPreview, 1000);
  };

  refreshGatsbyPreview = () => {
    if (this.debounceInterval) {
      clearInterval(this.debounceInterval);
    }

    const { webhookUrl } = this.props.sdk.parameters.installation;

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-preview-update-source': 'contentful-sidebar-extension'
      },
      body: JSON.stringify({})
    }).then(
      () => this.props.sdk.notifier.success('Gatsby Preview updated!'),
      () => this.props.sdk.notifier.error('Gatsby Preview failed :(')
    );
  };

  openPreviewTab = async () => {
    const {
      parameters: { installation, instance },
      entry
    } = this.props.sdk;
    const { previewUrl } = installation;
    const { contentTypeSlug } = instance;
    const { slug: contentSlug } = entry.fields;

    const normalizedPreviewUrl = normalize(previewUrl)

    try {
      const res = await fetch(`${normalizedPreviewUrl}/___graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query:
            'query getQualifiedSlug($slugExpr:String) { sitePage( path:{ regex:$slugExpr } ) { path } }',
          variables: {
            slugExpr: `/${contentSlug ? contentSlug.getValue() : contentTypeSlug}\/?$/`
          }
        })
      })
      const { data } = await res.json()
      const slug = data  ? data.sitePage.path : ``

      window.open(`${normalizedPreviewUrl}${slug}`);
    } catch (e) {
      console.error(e);

      let slug = contentTypeSlug || '';

      if (contentSlug) {
        slug += '/' + contentSlug.getValue();
      }

      window.open(`${normalizedPreviewUrl}${slug}`);
    }
  };

  render = () => {
    return (
      <div className="extension">
        <div className="flexcontainer">
          <Button buttonType="positive" onClick={this.openPreviewTab} isFullWidth>
            Open preview
          </Button>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Paragraph style={{ marginRight: '5%' }}>Powered by:</Paragraph>

            <img src={require('./gatsby.svg')} className="gatsby-logo" alt="Gatsby" />
          </div>
        </div>
      </div>
    );
  };
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
