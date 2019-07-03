'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Typography,
  Subheading,
  SectionHeading,
  Paragraph
} from '@contentful/forma-36-react-components';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import alex from 'alex';

import { NoIssues } from './no-issues.js';
import { Message } from './message.js';

function checkContent(isRichText, value, config = {}) {
  const { messages } = isRichText
    ? alex.text(documentToPlainTextString(value), config)
    : alex.markdown(value, config);

  return messages;
}

export class LanguageChecker extends React.Component {
  constructor() {
    super();
    this.state = { messageMap: {} };
  }

  componentDidMount() {
    const { entry, fieldsToCheck, alexConfig } = this.props;

    fieldsToCheck.forEach(fieldDefinition => {
      const fieldId = fieldDefinition.id;
      const field = entry.fields[fieldId];
      const currentValue = field.getValue();
      const isRichText = fieldDefinition.type === 'RichText';

      if (currentValue) {
        const messages = checkContent(isRichText, currentValue, alexConfig);

        this.setState(({ messageMap }) => {
          return { messageMap: { ...messageMap, [fieldId]: messages } };
        });
      }

      field.onValueChanged(value => {
        const messages = checkContent(isRichText, value, alexConfig);

        this.setState(({ messageMap }) => {
          return { messageMap: { ...messageMap, [fieldId]: messages } };
        });
      });
    });
  }

  render() {
    const messageEntries = Object.entries(this.state.messageMap);
    const { fieldsToCheck } = this.props;
    const messageCount = messageEntries.reduce((count, [, messages]) => {
      return count + messages.length;
    }, 0);

    if (messageCount === 0) {
      return <NoIssues />;
    }

    return (
      <React.Fragment>
        <Typography>
          <Subheading className="align-center">
            <Icon icon="Warning" color="warning" className="f36-margin-right--xs" />
            Issues found
          </Subheading>
          <Paragraph>There are some issues with the content in the following fields:</Paragraph>
        </Typography>
        {messageEntries.map(([fieldId, messages]) => {
          if (messages.length === 0) {
            return null;
          }

          const fieldDefiniton = fieldsToCheck.find(({ id }) => id === fieldId);

          return (
            <div key={fieldId}>
              <SectionHeading className="f36-margin-bottom--m">
                {fieldDefiniton.name}
              </SectionHeading>

              <ul className="warning-list f36-margin-bottom--m">
                {messages.map((message, index) => (
                  <Message message={message} key={index} />
                ))}
              </ul>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

LanguageChecker.propTypes = {
  fieldsToCheck: PropTypes.array.isRequired,
  entry: PropTypes.object.isRequired,
  alexConfig: PropTypes.shape({
    noBinary: PropTypes.bool,
    profanitySureness: PropTypes.oneOf([0, 1, 2]),
    allow: PropTypes.arrayOf(PropTypes.string)
  })
};

LanguageChecker.defaultProps = {
  alexConfig: {
    profanitySureness: 0,
    allow: []
  }
};
