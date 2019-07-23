import React from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/forma-36-tokens';
import {css} from 'emotion';

import Features from './Features';
import Connect from './Connect';
import Config from './Config';

const styles = {
    body: css({
        margin: '0 auto',
        padding: '0 40px',
        width: '70%'
    }),
    section: css({
        margin: '10px 0',
    }),
    featuresListItem: css({
        listStyleType: 'disc',
        marginLeft: tokens.spacingM
    }),
};

export default class AppPage extends React.Component {
    static propTypes = {
        openAuth: PropTypes.func.isRequired,
        accessToken: PropTypes.string,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.body}>
                <div className={styles.section}>
                    <Features />
                </div>

                <div className={styles.section}>
                    {!this.props.accessToken
                        ? <Connect openAuth={this.props.openAuth} />
                        : <Config />
                    }
                </div>
            </div>
        );
    }
}

