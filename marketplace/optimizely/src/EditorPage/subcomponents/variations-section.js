import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import {
  Heading,
  Paragraph,
  SkeletonContainer,
  SkeletonBodyText
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { ExperimentType } from './prop-types';
import VariationItem from './variation-item';

const styles = {
  container: css({
    marginTop: tokens.spacingS,
    maxWidth: 1000
  }),
  unassignedHeader: css({
    marginTop: tokens.spacingXl
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

function mergeReferencesAndVariations(variationReferences, variations, meta) {
  const linkedReferences = Object.values(meta);

  const mappedVariations = variations.map(variation => {
    const entryId = meta[variation.key];
    const reference = variationReferences.find(item => item.sys.id === entryId);
    return {
      variation,
      sys: reference ? reference.sys : undefined
    };
  });

  const unmappedReferences = variationReferences.filter(
    item => linkedReferences.includes(item.sys.id) === false
  );

  return { mappedVariations, unmappedReferences };
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

  const { mappedVariations, unmappedReferences } = mergeReferencesAndVariations(
    props.variations,
    props.experiment.variations,
    props.meta
  );

  return (
    <Container>
      <Paragraph>
        Content created in this experiment is only available for this experiment.
      </Paragraph>
      {mappedVariations.map(item => (
        <VariationItem
          variation={item.variation}
          experimentResults={props.experimentResults}
          sys={item.sys}
          key={item.variation.key}
          onCreateVariation={props.onCreateVariation}
          onLinkVariation={props.onLinkVariation}
          onOpenEntry={props.onOpenEntry}
          onRemoveVariation={props.onRemoveVariation}
        />
      ))}
      {unmappedReferences.length > 0 && (
        <React.Fragment>
          <Heading element="h3" className={styles.unassignedHeader}>
            Unassigned content
          </Heading>
          <Paragraph>These entries have no corresponding variations in Optimizely.</Paragraph>
          {unmappedReferences.map(item => (
            <VariationItem
              sys={item.sys}
              key={item.sys.id}
              onOpenEntry={props.onOpenEntry}
              onRemoveVariation={props.onRemoveVariation}
            />
          ))}
        </React.Fragment>
      )}
    </Container>
  );
}

VariationsSection.propTypes = {
  loaded: PropTypes.bool.isRequired,
  experiment: ExperimentType,
  experimentResults: PropTypes.object,
  meta: PropTypes.object.isRequired,
  variations: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  onLinkVariation: PropTypes.func.isRequired,
  onOpenEntry: PropTypes.func.isRequired,
  onRemoveVariation: PropTypes.func.isRequired,
  onCreateVariation: PropTypes.func.isRequired
};
