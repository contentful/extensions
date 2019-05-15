import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { slice } from 'lodash';
import {
  Heading,
  Paragraph,
  SkeletonContainer,
  SkeletonBodyText
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { ExperimentType } from '../prop-types';
import VariationItem from './variation-item';

const styles = {
  container: css({
    marginTop: tokens.spacingS,
    maxWidth: 1000
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

function mergeReferencesAndVariations(variationReferences, variations) {
  const linked = [];
  const invalid = [];

  variations.forEach((variation, index) => {
    linked.push({
      variation,
      sys: variationReferences[index] ? variationReferences[index].sys : undefined
    });
  });

  slice(variationReferences, variations.length).forEach(variationReference => {
    invalid.push({
      sys: variationReference.sys
    });
  });

  return { linked, invalid };
}

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

  const { linked, invalid } = mergeReferencesAndVariations(
    props.variations,
    props.experiment.variations
  );

  return (
    <Container>
      <Paragraph>
        Content created in this experiment is only available for this experiment.
      </Paragraph>
      {linked.map(item => (
        <VariationItem variation={item.variation} sys={item.sys} key={item.variation.key} />
      ))}

      {invalid.length > 0 && (
        <React.Fragment>
          <Heading>Invalid items</Heading>
          {invalid.map(item => (
            <VariationItem sys={item.sys} key={item.sys.id} />
          ))}
        </React.Fragment>
      )}
    </Container>
  );
}

VariationsSection.propTypes = {
  loaded: PropTypes.bool.isRequired,
  experiment: ExperimentType,
  variations: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired
};
