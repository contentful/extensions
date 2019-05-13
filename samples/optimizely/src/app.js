import * as React from 'react';
import PropTypes from 'prop-types';
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

import prepareReferenceInfo, * as ReferenceInfo from './reference-info';

export default class App extends React.Component {
  state = {};

  static propTypes = {
    sdk: PropTypes.shape({
      space: PropTypes.object.isRequired,
      ids: PropTypes.object.isRequired,
      locales: PropTypes.object.isRequired
    }).isRequired
  };

  async componentDidMount() {
    const { sdk } = this.props;
    const { space, ids, locales } = sdk;

    const [contentTypesRes, entriesRes, apiData] = await Promise.all([
      space.getContentTypes(),
      space.getEntries({ links_to_entry: ids.entry, skip: 0, limit: 1000 }),
      sdk.alpha('proxyGetRequest', {
        appId: 'optimizely',
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        headers: {}
      })
    ]);

    console.log(apiData);

    this.setState({
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
    const { referenceInfo } = this.state;

    if (!referenceInfo) {
      return null;
    }

    const { references } = referenceInfo;

    return (
      <div style={{ padding: tokens.spacingL }}>
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
              {references.map(entry => (
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
