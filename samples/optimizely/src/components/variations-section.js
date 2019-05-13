import React from 'react';
import { css } from 'emotion';
import { Heading, Paragraph, Subheading, EntryCard } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  variationContainer: css({
    marginTop: tokens.spacingXl,
    maxWidth: 1000
  }),
  variationTitle: css({
    marginBottom: tokens.spacingS
  })
};

export default function VariationsSection() {
  return (
    <React.Fragment>
      <Heading element="h2">Variations:</Heading>
      <Paragraph>
        Content created in this experiment is only available for this experiment.
      </Paragraph>

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
    </React.Fragment>
  );
}
