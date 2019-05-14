import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import {
  Heading,
  Paragraph,
  Subheading,
  EntryCard,
  SkeletonContainer,
  SkeletonBodyText
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { ExperimentType } from '../prop-types';

const styles = {
  container: css({
    marginTop: tokens.spacingS,
    maxWidth: 1000
  }),
  variationContainer: css({
    marginTop: tokens.spacingXl
  }),
  variationTitle: css({
    marginBottom: tokens.spacingS
  })
};

function Container(props) {
  return (
    <React.Fragment>
      <Heading element="h2">Variations:</Heading>
      <div className={styles.container}>{props.children}</div>
    </React.Fragment>
  );
}

Container.propTypes = {
  children: PropTypes.any
};

export default function VariationsSection(props) {
  if (!props.loaded) {
    return (
      <Container>
        <SkeletonContainer svgHeight={100} clipId="variations-section">
          <SkeletonBodyText numberOfLines={3} offsetTop={20} />
        </SkeletonContainer>
      </Container>
    );
  }

  if (!props.experiment) {
    return (
      <Container>
        <Paragraph>To see variations, select an experiment.</Paragraph>
      </Container>
    );
  }

  const { variations } = props.experiment;

  return (
    <Container>
      <Paragraph>
        Content created in this experiment is only available for this experiment.
      </Paragraph>
      {variations.map(variation => (
        <div key={variation.key} className={styles.variationContainer}>
          <Subheading className={styles.variationTitle}>{variation.key}</Subheading>
          <EntryCard
            title="Closer"
            description="Closer is the second and final studio album by English rock band Joy Division. It was released on 18 July 1980 on Factory Records, following the May 1980 suicide of lead singer Ian Curtis. The album was produced by Martin Hannett."
            status="draft"
            contentType="Album"
          />
        </div>
      ))}
    </Container>
  );
}

VariationsSection.propTypes = {
  loaded: PropTypes.bool.isRequired,
  experiment: ExperimentType
};
