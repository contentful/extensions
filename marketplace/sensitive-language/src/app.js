import React from 'react';
import PropTypes from 'prop-types';

import { UnsupportedLanguage } from './unsupported-language.js';
import { LanguageChecker } from './language-checker.js';

const textFieldTypes = ['Symbol', 'Text', 'RichText'];

function extractParameters({ instance, installation }) {
  const profanitySureness = parseInt(installation.profanitySureness, 10);
  const ignoredFields = instance.ignoredFields
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0);
  const ignoredRules = [
    ...installation.ignoredRules.split(','),
    ...instance.ignoredRules.split(',')
  ]
    .map(id => id.trim())
    .filter(id => id.length > 0);

  const alexConfig = { profanitySureness, allow: ignoredRules };

  return { ignoredFields, alexConfig };
}

export function App({ extension }) {
  const defaultLocale = extension.locales.default;
  if (!defaultLocale.startsWith('en-')) {
    return (
      <UnsupportedLanguage
        localeCode={defaultLocale}
        localeName={extension.locales.names[defaultLocale]}
      />
    );
  }

  const { ignoredFields, alexConfig } = extractParameters(extension.parameters);
  const textFields = extension.contentType.fields.filter(
    ({ id, type }) => textFieldTypes.includes(type) && !ignoredFields.includes(id)
  );

  return (
    <LanguageChecker entry={extension.entry} fieldsToCheck={textFields} alexConfig={alexConfig} />
  );
}

App.propTypes = {
  extension: PropTypes.object.isRequired
};
