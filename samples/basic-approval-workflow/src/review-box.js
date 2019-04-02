import React from 'react';
import PropTypes from 'prop-types';

import { Button, Textarea } from '@contentful/forma-36-react-components';
import { spacingXs } from '@contentful/forma-36-tokens';

import Vspace from './vspace';

const BUTTONS_STYLE = { display: 'flex', justifyContent: 'space-between' };
const HSPACE = { paddingLeft: spacingXs };

export default class ReviewBox extends React.Component {
  state = { comment: '' }

  static propTypes = {
    onApproved: PropTypes.func.isRequired,
    onRejected: PropTypes.func.isRequired,
  }

  onChange = e => this.setState({ comment: e.target.value })

  onSubmit = (isApproved) => {
    const { onApproved, onRejected } = this.props;
    const { comment } = this.state;

    if (isApproved) {
      onApproved({ comment });
    } else {
      onRejected({ comment });
    }
  }

  render() {
    const { comment } = this.state;

    return (
      <React.Fragment>
        <Textarea
          rows={4}
          maxLength={256}
          placeholder="Provide a comment... (optional)"
          value={comment}
          onChange={this.onChange}
        />
        <Vspace />
        <div style={BUTTONS_STYLE}>
          <Button
            buttonType="positive"
            icon="ThumbUp"
            onClick={() => this.onSubmit(true)}
            isFullWidth
          >
            Approve
          </Button>
          <div style={HSPACE} />
          <Button
            buttonType="negative"
            icon="ThumbDown"
            onClick={() => this.onSubmit(false)}
            isFullWidth
          >
            Reject
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
