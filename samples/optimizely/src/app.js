import * as React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import tokens from '@contentful/forma-36-tokens';
import OptimizelyClient from './optimizely-client';
import StatusBar from './components/status-bar';
import ReferencesSection from './components/references-section';
import ExperimentSection from './components/experiment-section';
import VariationsSection from './components/variations-section';
import SectionSplitter from './components/section-splitter';
import { Status } from './constants';
import prepareReferenceInfo from './reference-info';

const styles = {
  root: css({
    margin: tokens.spacingXl
  })
};

export default class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.shape({
      space: PropTypes.object.isRequired,
      ids: PropTypes.object.isRequired,
      locales: PropTypes.object.isRequired,
      entry: PropTypes.shape({
        fields: PropTypes.shape({
          experimentId: PropTypes.shape({
            getValue: PropTypes.func.isRequired,
            setValue: PropTypes.func.isRequired
          }).isRequired
        }).isRequired
      }).isRequired,
      parameters: PropTypes.shape({
        installation: PropTypes.shape({
          optimizelyProjectId: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.client = new OptimizelyClient({
      sdk: props.sdk,
      project: props.sdk.parameters.installation.optimizelyProjectId
    });
    this.state = {
      loaded: false,
      experiments: [],
      experimentId: props.sdk.entry.fields.experimentId.getValue()
    };
  }

  async componentDidMount() {
    const { sdk } = this.props;
    const { space, ids, locales } = sdk;

    const [contentTypesRes, entriesRes, experiments] = await Promise.all([
      space.getContentTypes(),
      space.getEntries({ links_to_entry: ids.entry, skip: 0, limit: 1000 }),
      this.client.getExperiments()
    ]);

    this.setState({
      loaded: true,
      experiments,
      referenceInfo: prepareReferenceInfo({
        contentTypes: contentTypesRes.items,
        entries: entriesRes.items,
        variationContainerId: ids.entry,
        variationContainerContentTypeId: ids.contentType,
        defaultLocale: locales.default
      })
    });
  }

  onChangeExperiment = experimentId => {
    this.setState({ experimentId });
    this.props.sdk.entry.fields.experimentId.setValue(experimentId);
  };

  getExperiment = () => {
    return this.state.experiments.find(
      experiment => experiment.id.toString() === this.state.experimentId
    );
  };

  getStatus = experiment => {
    if (!experiment) {
      return Status.SelectExperiment;
    }
    return Status.AddContent;
  };

  render() {
    const experiment = this.getExperiment();
    const status = this.getStatus(experiment);

    return (
      <div className={styles.root}>
        <StatusBar loaded={this.state.loaded} status={status} />
        <SectionSplitter />
        <ReferencesSection
          loaded={this.state.loaded}
          references={this.state.loaded ? this.state.referenceInfo.references : []}
          sdk={this.props.sdk}
        />
        <SectionSplitter />
        <ExperimentSection
          loaded={this.state.loaded}
          experiments={this.state.experiments}
          experiment={experiment}
          onChangeExperiment={this.onChangeExperiment}
        />
        <SectionSplitter />
        <VariationsSection loaded={this.state.loaded} experiment={experiment} />
        {/* {this.state.loaded && <IncomingReferences referenceInfo={this.state.referenceInfo} />} */}
      </div>
    );
  }
}
