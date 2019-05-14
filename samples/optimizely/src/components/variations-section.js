import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import {
  Heading,
  Paragraph,
  Subheading,
  EntryCard,
  SkeletonContainer,
  SkeletonDisplayText
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  container: css({
    marginTop: tokens.spacingL
  }),
  variationContainer: css({
    marginTop: tokens.spacingXl,
    maxWidth: 1000
  }),
  variationTitle: css({
    marginBottom: tokens.spacingS
  })
};

function Container(props) {
  return (
    <React.Fragment>
      <Heading element="h2">Variations:</Heading>
      <Paragraph>
        Content created in this experiment is only available for this experiment.
      </Paragraph>

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
        <div className={styles.variationContainer}>
          <SkeletonContainer svgHeight={40} clipId="variations-section">
            <SkeletonDisplayText numberOfLines={1} />
          </SkeletonContainer>
          <EntryCard loading />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.variationContainer}>
        <Subheading className={styles.variationTitle}>variation_1</Subheading>
        <EntryCard
          title="Closer"
          description="Closer is the second and final studio album by English rock band Joy Division. It was released on 18 July 1980 on Factory Records, following the May 1980 suicide of lead singer Ian Curtis. The album was produced by Martin Hannett."
          status="draft"
          contentType="Album"
        />
      </div>

      <div className={styles.variationContainer}>
        <Subheading className={styles.variationTitle}>variation_2</Subheading>
        <EntryCard
          title="Closer"
          description="Closer is the second and final studio album by English rock band Joy Division. It was released on 18 July 1980 on Factory Records, following the May 1980 suicide of lead singer Ian Curtis. The album was produced by Martin Hannett."
          status="draft"
          contentType="Album"
        />
      </div>
    </Container>
  );
}

VariationsSection.propTypes = {
  loaded: PropTypes.bool.isRequired
};
