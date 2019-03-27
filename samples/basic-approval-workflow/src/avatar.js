import React from 'react';
import PropTypes from 'prop-types';

import { spacingM } from '@contentful/forma-36-tokens';

const DEFAULT_AVATAR_SIZE = '50px';
const DEFAULT_SPACING = 'right';
const ALT_SPACING = 'left';

export default class Avatar extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      avatarUrl: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
    }).isRequired,
    size: PropTypes.string,
    spacing: PropTypes.oneOf([DEFAULT_SPACING, ALT_SPACING]),
  }

  static defaultProps = {
    size: DEFAULT_AVATAR_SIZE,
    spacing: DEFAULT_SPACING,
  }

  constructor(props) {
    super(props);

    const { size, spacing } = props;

    const style = {
      width: size,
      height: size,
      borderRadius: size,
    };

    if (spacing === DEFAULT_SPACING) {
      style.marginRight = spacingM;
    } else if (spacing === ALT_SPACING) {
      style.marginLeft = spacingM;
    }

    this.state = { style };
  }

  render() {
    const { user } = this.props;
    const { style } = this.state;

    return (
      <img
        src={user.avatarUrl}
        alt={user.firstName}
        style={style}
      />
    );
  }
}
