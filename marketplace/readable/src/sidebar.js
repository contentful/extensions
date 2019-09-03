import React from 'react';
import PropTypes from 'prop-types';

import { UnsupportedLanguage } from './unsupported-language.js';
import { fetchReadableResults } from './fetch.js';

import {
  Icon,
  Typography,
  Subheading,
  SectionHeading,
  Paragraph,
  Tooltip,
  TextLink,
  Button
} from '@contentful/forma-36-react-components';

import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

function extractParameters({ instance, installation }) {
  const ignoredFields = instance.ignoredFields
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0);

  const readableConfig = { apiKey: installation.apiKey };

  return { readableConfig, ignoredFields };
}

const longTextFieldTypes = ['Text', 'RichText'];

export class Sidebar extends React.Component {
  render() {
    const { extension } = this.props;

    const defaultLocale = extension.locales.default;
    if (!defaultLocale.startsWith('en-')) {
      return (
        <UnsupportedLanguage
          localeCode={defaultLocale}
          localeName={extension.locales.names[defaultLocale]}
        />
      );
    }

    const { readableConfig, ignoredFields } = extractParameters(extension.parameters);

    const textFields = extension.contentType.fields.filter(
      ({ id, type }) => longTextFieldTypes.includes(type) && !ignoredFields.includes(id)
    );

    return (
      <Readable
        extension={extension}
        entry={extension.entry}
        fieldsToCheck={textFields}
        readableConfig={readableConfig}
      />
    );
  }
}

class Readable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fieldValues: {},
      readableResults: {}
    };

    this.recheckReadability = this.recheckReadability.bind(this);
  }

  componentDidMount() {
    const { entry, fieldsToCheck, readableConfig } = this.props;

    fieldsToCheck.forEach(fieldDefinition => {
      const fieldId = fieldDefinition.id;
      const field = entry.fields[fieldId];
      const currentValue = field.getValue();
      const isRichText = fieldDefinition.type === 'RichText';

      if (currentValue) {
        this.setState(({ fieldValues }) => {
          return {
            fieldValues: { ...fieldValues, [fieldId]: { isRichText, value: currentValue } }
          };
        });

        const value = isRichText ? documentToPlainTextString(currentValue) : currentValue;

        fetchReadableResults(readableConfig.apiKey, value).then(results => {
          this.setState(({ readableResults }) => {
            return { readableResults: { ...readableResults, [fieldId]: results } };
          });
        });
      }

      field.onValueChanged(value => {
        this.setState(({ fieldValues }) => {
          return { fieldValues: { ...fieldValues, [fieldId]: { isRichText, value } } };
        });
      });
    });
  }

  recheckReadability() {
    const { readableConfig } = this.props;
    const fieldValuesEntries = Object.entries(this.state.fieldValues);

    fieldValuesEntries.forEach(([fieldId, { value, isRichText }]) => {
      const text = isRichText ? documentToPlainTextString(value) : value;

      fetchReadableResults(readableConfig.apiKey, text).then(results => {
        this.setState(({ readableResults }) => {
          return { readableResults: { ...readableResults, [fieldId]: results } };
        });
      });
    });
  }

  openDetailsDialog = async readableResult => {
    const { extension } = this.props;

    await extension.dialogs.openExtension({
      width: 1000,
      title: 'Readable details',
      parameters: {
        dialog: 'details',
        readableResult
      }
    });
  };

  openHighlightedTextDialog() {}

  render() {
    const { fieldsToCheck } = this.props;
    const resultEntries = Object.entries(this.state.readableResults);

    return (
      <React.Fragment>
        {resultEntries.map(([fieldId, result]) => {
          const fieldDefinition = fieldsToCheck.find(({ id }) => id === fieldId);

          return (
            <div key={fieldId}>
              <SectionHeading className="f36-margin-bottom--m">
                {fieldDefinition.name}
              </SectionHeading>

              <Tooltip content="Readable's bespoke rating system grades you from A to E for readability. Text aimed at the general public should be grade B or better.">
                Rating: <span className={`rating rating${result.rating}`}>{result.rating}</span>
              </Tooltip>
              <Button
                buttonType="muted"
                size="small"
                onClick={() => this.openDetailsDialog(result)}>
                Show details
              </Button>
              <Button buttonType="muted" size="small">
                Show highlighted text
              </Button>
            </div>
          );
        })}
        <Button buttonType="muted" size="small" onClick={this.recheckReadability}>
          Recheck readability
        </Button>
      </React.Fragment>
    );
  }
}

Sidebar.propTypes = {
  extension: PropTypes.object.isRequired
};
