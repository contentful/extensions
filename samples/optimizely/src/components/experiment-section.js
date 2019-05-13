import React from 'react';
import { css } from 'emotion';
import { Heading, SelectField, Option } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  heading: css({
    marginBottom: tokens.spacingL
  })
};

export default function ExperimentSection() {
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
        selectProps={{ width: 'large' }}
        id="experiment"
        name="experiment">
        <Option value="1">Some experiment</Option>
        <Option value="2">Some other experiment</Option>
      </SelectField>
    </React.Fragment>
  );
}
