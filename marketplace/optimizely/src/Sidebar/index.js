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

const getExperimentUrl = (projectId, experimentId) => {
  return `https://app.optimizely.com/v2/projects/${projectId}/experiments/${experimentId}/variations`;
};

const getAllExperimentsUrl = projectId => {
  return `https://app.optimizely.com/v2/projects/${projectId}/experiments`;
};

export default function Sidebar(props) {
  const [experimentId, setExperimentId] = useState(props.sdk.entry.fields.experimentId.getValue());
  const { parameters } = props.sdk;

  useEffect(() => {
    props.sdk.window.startAutoResizer();
    return () => {
      props.sdk.window.stopAutoResizer();
    };
  }, [props.sdk.window]);

  useEffect(() => {
    const unsubscribe = props.sdk.entry.fields.experimentId.onValueChanged(value => {
      setExperimentId(value);
    });
    return () => {
      return unsubscribe();
    };
  }, [props.sdk.entry.fields.experimentId]);

  const projectId = parameters.installation.optimizelyProjectId;

  return (
    <div data-test-id="sidebar">
      <Button
        buttonType="primary"
        isFullWidth
        className={styles.button}
        disabled={!experimentId}
        href={getExperimentUrl(projectId, experimentId)}
        target="_blank"
        data-test-id="view-experiment">
        View in Optimizely
      </Button>
      <Button
        buttonType="muted"
        isFullWidth
        className={styles.button}
        target="_blank"
        href={getAllExperimentsUrl(projectId)}
        data-test-id="view-all">
        View all experiments
      </Button>
    </div>
  );
}

Sidebar.propTypes = {
  sdk: PropTypes.shape({
    entry: PropTypes.shape({
      fields: PropTypes.shape({
        experimentId: PropTypes.object.isRequired
      }).isRequired
    }),
    window: PropTypes.object.isRequired,
    parameters: PropTypes.shape({
      installation: PropTypes.shape({
        optimizelyProjectId: PropTypes.string.isRequired
      })
    })
  }).isRequired
};
