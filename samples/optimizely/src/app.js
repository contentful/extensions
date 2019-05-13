import * as React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import {
  Typography,
  Heading,
  Paragraph,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import OptimizelyClient from './optimizely-client';
import StatusBar from './components/status-bar';
import ReferencesSection from './components/references-section';
import ExperimentSection from './components/experiment-section';
import VariationsSection from './components/variations-section';
import SectionSplitter from './components/section-splitter';

import prepareReferenceInfo, * as ReferenceInfo from './reference-info';

const PROJECT_ID = '11699754004';
const TOKEN = '2:y65PaQwDbaNo8WZUkVskR0i14F6EYbCWSO3EMdDlhdBZ8JVdZIFs';

const styles = {
  root: css({
    margin: tokens.spacingL
  })
};

export default class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.shape({
      space: PropTypes.object.isRequired,
      ids: PropTypes.object.isRequired,
      locales: PropTypes.object.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.client = new OptimizelyClient({ sdk: props.sdk, token: TOKEN, project: PROJECT_ID });
    this.state = {
      loaded: false
    };
  }

  async componentDidMount() {
    const { sdk } = this.props;
    const { space, ids, locales } = sdk;

    const [contentTypesRes, entriesRes] = await Promise.all([
      space.getContentTypes(),
      space.getEntries({ links_to_entry: ids.entry, skip: 0, limit: 1000 })
    ]);

    this.setState({
      loaded: true,
      referenceInfo: prepareReferenceInfo({
        contentTypes: contentTypesRes.items,
        entries: entriesRes.items,
        variationContainerId: ids.entry,
        variationContainerContentTypeId: ids.contentType,
        defaultLocale: locales.default
      })
    });
  }

  renderCombinedLinkValidation = entry => {
    if (entry.combinedLinkValidationType === ReferenceInfo.COMBINED_LINK_VALIDATION_CONFLICT) {
      return 'Conflicting';
    }

    if (entry.combinedLinkValidationType === ReferenceInfo.COMBINED_LINK_VALIDATION_INTERSECTION) {
      if (entry.linkContentTypeNames.length > 1) {
        return `Intersection of content types used: ${entry.linkContentTypeNames.join(', ')}`;
      }
      return entry.linkContentTypeNames[0];
    }

    return 'All content types';
  };

  render() {
    if (!this.state.loaded) {
      return null;
    }

    return (
      <div className={styles.root}>
        <StatusBar />
        <SectionSplitter />
        <ReferencesSection references={this.state.referenceInfo.references} sdk={this.props.sdk} />
        <SectionSplitter />
        <ExperimentSection />
        <SectionSplitter />
        <VariationsSection />
        <SectionSplitter />
        <Typography>
          <Heading>Incoming references</Heading>
          <Paragraph>This variation container is used in the following entries:</Paragraph>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Entry title</TableCell>
                <TableCell>Content type name</TableCell>
                <TableCell>Referenced from fields</TableCell>
                <TableCell>Combined link validation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.referenceInfo.references.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.title}</TableCell>
                  <TableCell>{entry.contentTypeName}</TableCell>
                  <TableCell>{entry.referencedFromFields.join(', ')}</TableCell>
                  <TableCell>{this.renderCombinedLinkValidation(entry)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Typography>
      </div>
    );
  }
}
