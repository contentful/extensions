import React from 'react';
import PropTypes from 'prop-types';

import { UnsupportedLanguage } from './unsupported-language.js';
import { LanguageChecker } from './language-checker.js';

const textFieldTypes = ['Symbol', 'Text', 'RichText'];

export function App ({ extension }) {
  const defaultLocale = extension.locales.default;
  if (!defaultLocale.startsWith('en-')) {
    return (
      <UnsupportedLanguage
        localeCode={defaultLocale}
        localeName={extension.locales.names[defaultLocale]}
      />
    );
  }

  const textFields = extension.contentType.fields.filter(({ type }) =>
    textFieldTypes.includes(type)
  );
  return <LanguageChecker entry={extension.entry} fieldsToCheck={textFields} />;
}

App.propTypes = {
  extension: PropTypes.object.isRequired
};
