import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Heading, SelectField, Option } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  heading: css({
    marginBottom: tokens.spacingL
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
        value=""
        onChange={() => {}}
        selectProps={{ width: 'large', isDisabled: props.loaded === false }}
        id="experiment"
        name="experiment">
        {props.loaded === false && <Option value="-1">Fetching experiments...</Option>}
        {props.loaded &&
          props.experiments.map(experiment => (
            <Option key={experiment.id} value={experiment.id}>
              {experiment.name || experiment.key} ({experiment.status})
            </Option>
          ))}
      </SelectField>
    </React.Fragment>
  );
}

ExperimentSection.propTypes = {
  loaded: PropTypes.bool.isRequired,
  experiments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};

ExperimentSection.defaultProps = {
  experiments: []
};
