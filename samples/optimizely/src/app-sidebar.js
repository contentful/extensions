import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { css } from 'emotion';

const styles = {
  button: css({
    marginBottom: tokens.spacingS
  })
};

export default function AppSidebar(props) {
  const [experimentId, setExperimentId] = useState(props.sdk.entry.fields.experimentId.getValue());

  useEffect(() => {
    const unsubscribe = props.sdk.entry.fields.experimentId.onValueChanged(value => {
      setExperimentId(value);
    });
    return () => {
      return unsubscribe();
    };
  }, []);

  return (
    <div>
      <Button
        buttonType="primary"
        isFullWidth
        className={styles.button}
        disabled={!experimentId}
        href={props.client.getExperimentUrl(experimentId)}
        target="_blank">
        View in Optimizely
      </Button>
      <Button
        buttonType="muted"
        isFullWidth
        className={styles.button}
        target="_blank"
        href={props.client.getAllExperimentsUrl()}>
        View all experiments
      </Button>
    </div>
  );
}

AppSidebar.propTypes = {
  sdk: PropTypes.shape({
    entry: PropTypes.shape({
      fields: PropTypes.shape({
        experimentId: PropTypes.object.isRequired
      }).isRequired
    })
  }).isRequired,
  client: PropTypes.object.isRequired
};
