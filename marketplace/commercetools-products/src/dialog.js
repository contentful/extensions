/* global CTPicker */

import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@contentful/forma-36-react-components';

export class CommerceToolsDialog extends React.Component {
  constructor(props) {
    super(props);

    this.pickerContainerRef = React.createRef();
    this.picker = null;

    this.onCancel = this.onCancel.bind(this);
    this.onInsert = this.onInsert.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <div ref={this.pickerContainerRef} className="picker-container" />

        <div className="picker-controls">
          <Button onClick={this.onInsert} buttonType="positive" style={{ marginRight: 16 }}>
            Insert selected Products
          </Button>
          <Button onClick={this.onCancel} buttonType="muted">
            Cancel
          </Button>
        </div>
        <div>
          {/* Horrible hack for making autoresize work as expected. Autoresize doesn't like calc witchcraft */}
          &nbsp;
        </div>
      </React.Fragment>
    );
  }

  onCancel() {
    this.props.extension.close(null);
  }

  onInsert() {
    this.picker.getSelectedItems().then(items => {
      this.props.extension.close(items.map(item => item.masterVariant.sku));
    });
  }

  componentDidMount() {
    const { parameters, isSingle } = this.props;

    this.picker = new CTPicker(
      {
        config: {
          authUri: parameters.authUri,
          projectKey: parameters.projectKey,
          credentials: {
            clientId: parameters.clientId,
            clientSecret: parameters.clientSecret
          },
          apiUri: parameters.apiUri
        },
        mode: 'embedded',
        pickerMode: 'product',
        selectionMode: isSingle ? 'single' : 'multiple',
        displayOptions: {
          showHeader: false
        },
        pageSize: 20,
        language: parameters.locale
      },
      this.pickerContainerRef.current
    );

    this.picker.init().then(() => this.picker.show('embedded'));
  }
}

CommerceToolsDialog.propTypes = {
  extension: PropTypes.object.isRequired,
  parameters: PropTypes.shape({
    projectKey: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    clientSecret: PropTypes.string.isRequired,
    apiUri: PropTypes.string.isRequired,
    authUri: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired
  }).isRequired,
  isSingle: PropTypes.bool.isRequired
};
