import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import {
  Heading,
  SelectField,
  Option,
  Paragraph,
  TextLink
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { ExperimentType } from '../prop-types';

const styles = {
  heading: css({
    marginBottom: tokens.spacingL
  }),
  description: css({
    marginTop: tokens.spacingS,
    color: tokens.colorTextLight,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  clearDescription: css({
    marginTop: tokens.spacingXs,
    color: tokens.colorTextLightest
  })
};

const NOT_SELECTED = '-1';

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
          const value = e.target.value;
          if (value === NOT_SELECTED) {
            props.onChangeExperiment({
              experimentId: '',
              experimentKey: ''
            });
          } else {
            const experiment = props.experiments.find(
              experiment => experiment.id.toString() === value
            );
            if (experiment) {
              props.onChangeExperiment({
                experimentId: experiment.id.toString(),
                experimentKey: experiment.key.toString()
              });
            }
          }
        }}
        selectProps={{
          width: 'large',
          isDisabled: props.disabled === true || props.loaded === false
        }}
        id="experiment"
        name="experiment">
        {props.loaded === false && <Option value={NOT_SELECTED}>Fetching experiments...</Option>}
        {props.loaded && (
          <React.Fragment>
            <Option value={NOT_SELECTED}>Select Optimizely experiment</Option>
            {props.experiments.map(experiment => (
              <Option key={experiment.id.toString()} value={experiment.id.toString()}>
                {experiment.name || experiment.key} ({experiment.status})
              </Option>
            ))}
          </React.Fragment>
        )}
      </SelectField>
      {props.disabled === true && (
        <Paragraph className={styles.clearDescription}>
          To change experiment, first{' '}
          <TextLink onClick={props.onClearVariations}>clear the content assigned</TextLink>.
        </Paragraph>
      )}
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
  disabled: PropTypes.bool,
  experiment: ExperimentType,
  experiments: PropTypes.arrayOf(ExperimentType.isRequired).isRequired,
  onChangeExperiment: PropTypes.func.isRequired,
  onClearVariations: PropTypes.func.isRequired
};

ExperimentSection.defaultProps = {
  experiments: []
};
