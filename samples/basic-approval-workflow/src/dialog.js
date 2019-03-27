import React from 'react';
import PropTypes from 'prop-types';

import {
  Card, Subheading, HelpText, Note, Button,
} from '@contentful/forma-36-react-components';
import { spacingM } from '@contentful/forma-36-tokens';

import userName from './user-name';

import Vspace from './vspace';
import Avatar from './avatar';

const CONTAINER_STYLE = { padding: spacingM };
const LIST_STYLE = { maxHeight: '300px', overflowY: 'auto' };
const CARD_STYLE = { display: 'flex', alignItems: 'center' };

export default class Dialog extends React.Component {
  static propTypes = {
    sdk: PropTypes.shape({
      parameters: PropTypes.shape({
        invocation: PropTypes.object.isRequired,
      }).isRequired,
      user: PropTypes.object.isRequired,
      close: PropTypes.func.isRequired,
      window: PropTypes.shape({
        startAutoResizer: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }

  componentDidMount() {
    const { sdk } = this.props;
    sdk.window.startAutoResizer();
  }

  render() {
    const { sdk } = this.props;
    const { user, close } = sdk;
    const parameters = sdk.parameters.invocation;

    // Do not render the current user
    const users = parameters.users.filter(current => current.sys.id !== user.sys.id);

    return (
      <div style={CONTAINER_STYLE}>
        <div style={LIST_STYLE}>
          {users.length > 0 && users.map(cur => (
            <React.Fragment key={cur.sys.id}>
              <Card onClick={() => close(cur)}>
                <div style={CARD_STYLE}>
                  <Avatar user={cur} size="40px" />
                  <div>
                    <Subheading>{userName(cur)}</Subheading>
                    <HelpText>{cur.email}</HelpText>
                  </div>
                </div>
              </Card>
              <Vspace />
            </React.Fragment>
          ))}
          {users.length < 1 && (
          <Note
            noteType="warning"
            title="You're the only user in the space"
          >
            {'There\'s nobody to review your changes. '}
            {'Invite your colleagues to use approval workflow.'}
          </Note>
          )}
        </div>
        <Vspace />
        <Button
          buttonType="muted"
          isFullWidth
          onClick={() => close(undefined)}
        >
          {users.length > 0 ? 'Cancel' : 'OK'}
        </Button>
      </div>
    );
  }
}
