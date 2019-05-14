import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Heading, SelectField, Option, Paragraph } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  heading: css({
    marginBottom: tokens.spacingL
  }),
  description: css({
    marginTop: tokens.spacingS,
    color: tokens.colorTextLight
  })
};

export default function ExperimentSection(props) {
  const experiment = useMemo(() => {
    return props.experiments.find(experiment => experiment.id.toString() === props.experimentId);
  }, [props.experimentId, props.experiments]);

  return (
    <React.Fragment>
      <Heading element="h2" className={styles.heading}>
        Experiment:
      </Heading>
      <SelectField
        labelText="Optimizely experiment"
        required
        value={props.experimentId}
        onChange={e => {
          props.onChangeExperiment(e.target.value);
        }}
        selectProps={{ width: 'large', isDisabled: props.loaded === false }}
        id="experiment"
        name="experiment">
        {props.loaded === false && <Option value="-1">Fetching experiments...</Option>}
        {props.loaded && (
          <React.Fragment>
            <Option value="-1">Select Optimizely experiment</Option>
            {props.experiments.map(experiment => (
              <Option key={experiment.id.toString()} value={experiment.id.toString()}>
                {experiment.name || experiment.key} ({experiment.status})
              </Option>
            ))}
          </React.Fragment>
        )}
      </SelectField>
      {experiment && experiment.description && (
        <Paragraph className={styles.description}>Description: {experiment.description}</Paragraph>
      )}
    </React.Fragment>
  );
}

ExperimentSection.propTypes = {
  loaded: PropTypes.bool.isRequired,
  experimentId: PropTypes.string,
  experiments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onChangeExperiment: PropTypes.func.isRequired
};

ExperimentSection.defaultProps = {
  experiments: []
};
