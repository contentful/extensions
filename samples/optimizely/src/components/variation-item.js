import React, { useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import get from 'lodash.get';
import useInterval from '@use-it/interval';
import {
  Paragraph,
  Subheading,
  EntryCard,
  DropdownList,
  DropdownListItem
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { SDKContext, ContentTypesContext } from '../all-context';
import VariationSelect from './variation-select';

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
  })
};

function getPercentOfTraffic(variation) {
  return Math.floor(variation.weight) / 100;
}

const getEntryStatus = sys => {
  if (sys.archivedVersion) {
    return 'archived';
  } else if (sys.publishedVersion) {
    if (sys.version > sys.publishedVersion + 1) {
      return 'changed';
    } else {
      return 'published';
    }
  } else {
    return 'draft';
  }
};

const getCardProperties = (entry, allContentTypes, defaultLocale) => {
  const contentTypeId = get(entry, ['sys', 'contentType', 'sys', 'id']);
  const contentType = allContentTypes.find(contentType => contentType.sys.id === contentTypeId);
  if (!contentType) {
    throw new Error(`Content type #${contentTypeId} is not present`);
  }

  const displayField = contentType.displayField;
  const title = get(entry, ['fields', displayField, defaultLocale], 'Untitled');
  const status = getEntryStatus(entry.sys);

  return {
    title,
    contentType: contentType.name,
    status
  };
};

function useEntryCard(id) {
  const sdk = useContext(SDKContext);
  const allContentTypes = useContext(ContentTypesContext);

  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState(false);

  const fetchEntry = useCallback(() => {
    sdk.space
      .getEntry(id)
      .then(entry => {
        setLoading(false);
        setEntry(getCardProperties(entry, allContentTypes, sdk.locales.default));
        return entry;
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [id, sdk]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  useInterval(() => {
    fetchEntry();
  }, 3000);

  return {
    entry,
    loading,
    error
  };
}

export function SelectedReference(props) {
  const { entry, loading, error } = useEntryCard(props.sys.id);

  if (loading) {
    return <EntryCard loading className={styles.entryCard} />;
  }

  if (error) {
    // todo: provide a correct placeholder with ability to delete reference
    return <div>Error</div>;
  }

  if (!entry) {
    return null;
  }

  return (
    <EntryCard
      className={styles.entryCard}
      size="small"
      onClick={props.onEditClick}
      title={entry.title}
      status={entry.status}
      contentType={entry.contentType}
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
            props.onOpenVariation(props.sys.id);
          }}
          onRemoveClick={() => {
            props.onRemoveVariation(props.sys.id);
          }}
        />
      )}
      {!props.sys && (
        <VariationSelect
          duplicate="variation_1"
          onCreateClick={() => {}}
          onDuplicateClick={() => {}}
          onLinkExistingClick={() => {
            props.onLinkVariation(props.index);
          }}
        />
      )}
    </div>
  );
}

VariationItem.propTypes = {
  index: PropTypes.number.isRequired,
  variation: PropTypes.object,
  sys: PropTypes.object,
  onLinkVariation: PropTypes.func.isRequired,
  onOpenVariation: PropTypes.func.isRequired,
  onRemoveVariation: PropTypes.func.isRequired
};
