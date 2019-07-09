import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import useMethods from 'use-methods';
import tokens from '@contentful/forma-36-tokens';
import { Note } from '@contentful/forma-36-react-components';
import StatusBar from './components/status-bar';
import ReferencesSection from './components/references-section';
import ExperimentSection from './components/experiment-section';
import VariationsSection from './components/variations-section';
import SectionSplitter from './components/section-splitter';
import prepareReferenceInfo, { COMBINED_LINK_VALIDATION_CONFLICT } from './reference-info';
import useInterval from '@use-it/interval';

import { SDKContext, GlobalStateContext } from './all-context';

const styles = {
  root: css({
    margin: tokens.spacingXl
  })
};

const methods = state => {
  return {
    setInitialData({ experiments, contentTypes, referenceInfo }) {
      state.experiments = experiments;
      state.contentTypes = contentTypes;
      state.referenceInfo = referenceInfo;
      state.loaded = true;
    },
    setError(message) {
      state.error = message;
    },
    setExperimentId(id) {
      state.experimentId = id;
      state.meta = {};
    },
    setVariations(variations) {
      state.variations = variations;
    },
    setEntry(id, entry) {
      state.entries[id] = entry;
    },
    setMeta(meta) {
      state.meta = meta;
    },
    setExperimentResults(id, results) {
      state.experimentsResults[id] = results;
    },
    updateExperiment(id, experiment) {
      const index = state.experiments.findIndex(
        experiment => experiment.id.toString() === id.toString()
      );
      if (index !== -1) {
        state.experiments[index] = experiment;
      }
    }
  };
};

const getInitialValue = sdk => ({
  loaded: false,
  error: false,
  experiments: [],
  contentTypes: [],
  meta: sdk.entry.fields.meta.getValue() || {},
  variations: sdk.entry.fields.variations.getValue() || [],
  experimentId: sdk.entry.fields.experimentId.getValue(),
  entries: {},
  experimentsResults: {}
});

const fetchInitialData = async (sdk, client) => {
  const { space, ids, locales } = sdk;

  const [contentTypesRes, entriesRes, experiments] = await Promise.all([
    space.getContentTypes(),
    space.getEntries({ links_to_entry: ids.entry, skip: 0, limit: 1000 }),
    client.getExperiments()
  ]);

  return {
    experiments,
    contentTypes: contentTypesRes.items,
    referenceInfo: prepareReferenceInfo({
      contentTypes: contentTypesRes.items,
      entries: entriesRes.items,
      variationContainerId: ids.entry,
      variationContainerContentTypeId: ids.contentType,
      defaultLocale: locales.default
    })
  };
};

export default function App(props) {
  const globalState = useMethods(methods, getInitialValue(props.sdk));
  const [state, actions] = globalState;

  const experiment = state.experiments.find(
    experiment => experiment.id.toString() === state.experimentId
  );

  /**
   * Fetch initial portion of data required to render initial state
   */
  useEffect(() => {
    fetchInitialData(props.sdk, props.client)
      .then(data => {
        actions.setInitialData(data);
        return data;
      })
      .catch(() => {
        actions.setError('Unable to load initial data');
      });
  }, []);

  /**
   * Pulling current experiment every 5s to get new status and variations
   */
  useInterval(() => {
    if (state.experimentId) {
      props.client
        .getExperiment(state.experimentId)
        .then(experiment => {
          actions.updateExperiment(state.experimentId, experiment);
          return experiment;
        })
        .catch(() => {});
    }
  }, 5000);

  /**
   * Subscribe for changes in entry
   */
  useEffect(() => {
    const unsubsribeExperimentChange = props.sdk.entry.fields.experimentId.onValueChanged(data => {
      actions.setExperimentId(data);
    });
    const unsubsribeVariationsChange = props.sdk.entry.fields.variations.onValueChanged(data => {
      actions.setVariations(data || []);
    });
    const unsubscribeMetaChange = props.sdk.entry.fields.meta.onValueChanged(data => {
      actions.setMeta(data || {});
    });
    return () => {
      unsubsribeExperimentChange();
      unsubsribeVariationsChange();
      unsubscribeMetaChange();
    };
  }, []);

  /**
   * Update title every time experiment is changed
   */
  useEffect(() => {
    if (state.loaded) {
      const title = experiment ? `[Optimizely] ${experiment.name}` : '';
      props.sdk.entry.fields.experimentTitle.setValue(title);
    }
  }, [experiment, state.loaded]);

  /**
   * Fetch experiment results every time experiment is changed
   */
  useEffect(() => {
    if (state.loaded && experiment) {
      props.client
        .getExperimentResults(experiment.id)
        .then(results => {
          actions.setExperimentResults(experiment.id, results);
          return results;
        })
        .catch(() => {});
    }
  }, [experiment, state.loaded]);

  const getExperimentResults = experiment => {
    if (!experiment) {
      return undefined;
    }
    return {
      url: props.client.getResultsUrl(experiment.campaign_id, experiment.id),
      results: state.experimentsResults[experiment.id]
    };
  };

  /**
   * Handlers
   */

  const onChangeExperiment = useCallback(value => {
    props.sdk.entry.fields.meta.setValue({});
    props.sdk.entry.fields.experimentId.setValue(value.experimentId);
    props.sdk.entry.fields.experimentKey.setValue(value.experimentKey);
  });

  const onLinkVariation = useCallback(async variation => {
    const data = await props.sdk.dialogs.selectSingleEntry({
      locale: props.sdk.locales.default,
      contentTypes: state.referenceInfo.linkContentTypes
    });

    if (!data) {
      return;
    }

    const values = props.sdk.entry.fields.variations.getValue() || [];
    const meta = props.sdk.entry.fields.meta.getValue() || {};
    props.sdk.entry.fields.meta.setValue({
      ...meta,
      [variation.key]: data.sys.id
    });
    props.sdk.entry.fields.variations.setValue([
      ...values,
      {
        sys: {
          type: 'Link',
          id: data.sys.id,
          linkType: 'Entry'
        }
      }
    ]);
  });

  const onOpenEntry = useCallback(entryId => {
    props.sdk.navigator.openEntry(entryId, { slideIn: true });
  });

  const onCreateVariation = useCallback(async (variation, contentTypeId) => {
    const data = await props.sdk.navigator.openNewEntry(contentTypeId, {
      slideIn: true
    });

    if (!data) {
      return;
    }

    const values = props.sdk.entry.fields.variations.getValue() || [];
    const meta = props.sdk.entry.fields.meta.getValue() || {};

    props.sdk.entry.fields.meta.setValue({
      ...meta,
      [variation.key]: data.entity.sys.id
    });
    props.sdk.entry.fields.variations.setValue([
      ...values,
      {
        sys: {
          type: 'Link',
          id: data.entity.sys.id,
          linkType: 'Entry'
        }
      }
    ]);
  });

  const onRemoveVariation = useCallback((entryId, variation) => {
    const values = props.sdk.entry.fields.variations.getValue() || [];
    const meta = props.sdk.entry.fields.meta.getValue() || {};
    if (variation) {
      delete meta[variation.key];
    }
    props.sdk.entry.fields.meta.setValue(meta);
    props.sdk.entry.fields.variations.setValue(values.filter(item => item.sys.id !== entryId));
  });

  const onClearVariations = useCallback(() => {
    props.sdk.entry.fields.meta.setValue({});
    props.sdk.entry.fields.variations.setValue([]);
  });

  const { combinedLinkValidationType } = state.referenceInfo || {};
  if (combinedLinkValidationType === COMBINED_LINK_VALIDATION_CONFLICT) {
    return (
      <Note noteType="negative" title="Conflict">
        Validations of reference fields in incoming references yield conflicting references for the
        Variation Container. Loosen validations or change incoming references so there is at least
        one shared Content Type validation.
      </Note>
    );
  }

  return (
    <SDKContext.Provider value={props.sdk}>
      <GlobalStateContext.Provider value={globalState}>
        <div className={styles.root}>
          <StatusBar
            loaded={state.loaded}
            experiment={experiment}
            variations={state.variations}
            entries={state.entries}
          />
          <SectionSplitter />
          <ReferencesSection
            loaded={state.loaded}
            references={state.loaded ? state.referenceInfo.references : []}
            sdk={props.sdk}
          />
          <SectionSplitter />
          <ExperimentSection
            loaded={state.loaded}
            disabled={experiment && state.variations.length > 0}
            experiments={state.experiments}
            experiment={experiment}
            onChangeExperiment={onChangeExperiment}
            onClearVariations={onClearVariations}
          />
          <SectionSplitter />
          <VariationsSection
            loaded={state.loaded}
            contentTypes={state.contentTypes}
            experiment={experiment}
            experimentResults={getExperimentResults(experiment)}
            meta={state.meta}
            variations={state.variations}
            onCreateVariation={onCreateVariation}
            onLinkVariation={onLinkVariation}
            onOpenEntry={onOpenEntry}
            onRemoveVariation={onRemoveVariation}
          />
        </div>
      </GlobalStateContext.Provider>
    </SDKContext.Provider>
  );
}

const AppTypes = {
  client: PropTypes.any.isRequired,
  sdk: PropTypes.shape({
    space: PropTypes.object.isRequired,
    ids: PropTypes.object.isRequired,
    locales: PropTypes.object.isRequired,
    navigator: PropTypes.shape({
      openEntry: PropTypes.func.isRequired,
      openNewEntry: PropTypes.func.isRequired
    }).isRequired,
    dialogs: PropTypes.shape({
      selectSingleEntry: PropTypes.func.isRequired
    }).isRequired,
    entry: PropTypes.shape({
      fields: PropTypes.shape({
        experimentId: PropTypes.object.isRequired,
        experimentKey: PropTypes.object.isRequired,
        variations: PropTypes.object.isRequired,
        meta: PropTypes.object.isRequired,
        experimentTitle: PropTypes.object.isRequired
      }).isRequired,
      getSys: PropTypes.func.isRequired
    }).isRequired,
    parameters: PropTypes.shape({
      installation: PropTypes.shape({
        optimizelyProjectId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};

App.propTypes = AppTypes;
