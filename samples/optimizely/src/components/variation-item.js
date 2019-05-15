import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import get from 'lodash.get';
import { Paragraph, Subheading, EntryCard, TextLink } from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { SDKContext, ContentTypesContext } from '../all-context';

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

  useEffect(() => {
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
      title={entry.title}
      status={entry.status}
      contentType={entry.contentType}
    />
  );
}

SelectedReference.propTypes = {
  sys: PropTypes.object.isRequired
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
      {props.sys && <SelectedReference sys={props.sys} />}
      {!props.sys && (
        <div>
          <div>
            <TextLink>Create entry and link</TextLink>
          </div>
          <div>
            <TextLink>Link an existing entry</TextLink>
          </div>
        </div>
      )}
    </div>
  );
}

VariationItem.propTypes = {
  variation: PropTypes.object,
  sys: PropTypes.object
};
