import React, { useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import useInterval from '@use-it/interval';
import {
  Paragraph,
  Subheading,
  EntryCard,
  DropdownList,
  DropdownListItem,
  Note,
  TextLink
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { SDKContext, GlobalStateContext } from './all-context';
import VariationSelect from './variation-select';
import VariationStats from './variations-stats';
import { getAdditionalEntryInformation } from './utils';

const styles = {
  variationContainer: css({
    marginTop: tokens.spacingXl
  }),
  variationTitle: css({
    small: {
      color: tokens.colorTextLight,
      fontWeight: tokens.fontWeightNormal,
      marginLeft: tokens.spacingXs,
      fontSize: tokens.fontSizeL
    }
  }),
  variationDescription: css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: tokens.colorTextLight,
    marginTop: tokens.spacingXs
  }),
  entryCard: css({
    marginTop: tokens.spacingM
  }),
  missingNote: css({
    marginTop: tokens.spacingM
  })
};

function getPercentOfTraffic(variation) {
  return Math.floor(variation.weight) / 100;
}

function useEntryCard(id) {
  const sdk = useContext(SDKContext);
  const [state, actions] = useContext(GlobalStateContext);
  const allContentTypes = state.contentTypes;

  const entry = state.entries[id];

  const [error, setError] = useState(false);

  const fetchEntry = useCallback(() => {
    sdk.space
      .getEntry(id)
      .then(entry => {
        const data = {
          ...entry,
          meta: getAdditionalEntryInformation(entry, allContentTypes, sdk.locales.default)
        };
        actions.setEntry(id, data);
        return entry;
      })
      .catch(() => {
        setError(true);
      });
  }, [actions, allContentTypes, id, sdk.locales.default, sdk.space]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  useInterval(() => {
    fetchEntry();
  }, 3000);

  return {
    entry,
    loading: !entry,
    error
  };
}

export function SelectedReference(props) {
  const { entry, loading, error } = useEntryCard(props.sys.id);

  if (loading) {
    return <EntryCard loading className={styles.entryCard} />;
  }

  if (error) {
    return (
      <Note noteType="warning" title="Entry is missing" className={styles.missingNote}>
        <TextLink linkType="secondary" onClick={props.onRemoveClick}>
          Remove missing entry
        </TextLink>
      </Note>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <EntryCard
      className={styles.entryCard}
      size={entry.meta.description ? 'default' : 'small'}
      onClick={props.onEditClick}
      title={entry.meta.title}
      description={entry.meta.description}
      status={entry.meta.status}
      contentType={entry.meta.contentType}
      dropdownListElements={
        <DropdownList>
          <DropdownListItem onClick={props.onEditClick}>Edit</DropdownListItem>
          <DropdownListItem onClick={props.onRemoveClick}>Remove</DropdownListItem>
        </DropdownList>
      }
    />
  );
}

SelectedReference.propTypes = {
  sys: PropTypes.object.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired
};

export default function VariationItem(props) {
  const variation = props.variation;

  return (
    <div className={styles.variationContainer}>
      {props.variation && (
        <React.Fragment>
          <Subheading className={styles.variationTitle}>
            {variation.key} <small>({getPercentOfTraffic(variation)}% of traffic)</small>
          </Subheading>
          {variation.description && (
            <Paragraph className={styles.variationDescription}>
              Description: {variation.description}
            </Paragraph>
          )}
        </React.Fragment>
      )}
      {props.sys && (
        <SelectedReference
          sys={props.sys}
          onEditClick={() => {
            props.onOpenEntry(props.sys.id);
          }}
          onRemoveClick={() => {
            props.onRemoveVariation(props.sys.id, variation);
          }}
        />
      )}
      {props.variation && props.sys && (
        <VariationStats
          variationId={props.variation.variation_id}
          experimentResults={props.experimentResults}
        />
      )}
      {!props.sys && (
        <VariationSelect
          onCreate={contentType => {
            props.onCreateVariation(props.variation, contentType);
          }}
          onDuplicateClick={() => {}}
          onLinkExistingClick={() => {
            props.onLinkVariation(props.variation);
          }}
        />
      )}
    </div>
  );
}

VariationItem.propTypes = {
  variation: PropTypes.object,
  experimentResults: PropTypes.object,
  sys: PropTypes.object,
  onCreateVariation: PropTypes.func,
  onLinkVariation: PropTypes.func,
  onOpenEntry: PropTypes.func.isRequired,
  onRemoveVariation: PropTypes.func.isRequired
};
