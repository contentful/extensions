import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Heading, SelectField, Option, Paragraph } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { ExperimentType } from '../prop-types';

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
  return (
    <React.Fragment>
      <Heading element="h2" className={styles.heading}>
        Experiment:
      </Heading>
      <SelectField
        labelText="Optimizely experiment"
        required
        value={props.experiment ? props.experiment.id.toString() : ''}
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

      {props.experiment && props.experiment.description && (
        <Paragraph className={styles.description}>
          Description: {props.experiment.description}
        </Paragraph>
      )}
    </React.Fragment>
  );
}

ExperimentSection.propTypes = {
  loaded: PropTypes.bool.isRequired,
  experiment: ExperimentType,
  experiments: PropTypes.arrayOf(ExperimentType.isRequired).isRequired,
  onChangeExperiment: PropTypes.func.isRequired
};

ExperimentSection.defaultProps = {
  experiments: []
};
