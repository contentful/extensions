import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { CheckboxField, Tooltip, Icon } from '@contentful/forma-36-react-components';
import { VARIATION_CONTAINER_ID } from './constants';
import { css } from 'emotion';

const styles = {
  container: css({
    position: 'relative'
  }),
  tooltip: css({
    'z-index': '99999'
  }),
  tooltipContainer: css({
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '3px'
  })
};

ReferenceField.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  contentType: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default function ReferenceField({ id, checked, contentType, onSelect }) {
  const field = findFieldById(id, contentType);
  const disabled = !hasFieldLinkValidations(field);

  return (
    <div className={styles.container}>
      <CheckboxField
        id={`reference-field-${id}`}
        checked={checked || disabled}
        disabled={disabled}
        onChange={e => onSelect(e.target.checked)}
        labelText={field.name}
        labelIsLight={true}
      />
      {disabled ? (
        <div className={styles.tooltipContainer}>
          <Tooltip
            className={styles.tooltip}
            content="This field can have a variation container assigned to it by default because it has no explicit validations."
            place="right">
            <Icon color="muted" icon="HelpCircle" />
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
}

export function findFieldById(id, contentType) {
  return contentType.fields.find(field => field.id === id);
}

export function getFieldLinkValidations(field) {
  return get(field, ['items', 'validations'], field.validations).filter(v => v.linkContentType);
}

export function getNonFieldLinkValidations(field) {
  return get(field, ['items', 'validations'], field.validations).filter(v => !v.linkContentType);
}

export function hasFieldLinkValidations(field) {
  return getFieldLinkValidations(field).length > 0;
}

export function hasVariationContainerInFieldLinkValidations(field) {
  if (!hasFieldLinkValidations(field)) return false;

  let linkContentTypeValidations = getFieldLinkValidations(field)[0].linkContentType;
  if (typeof linkContentTypeValidations === 'string') {
    linkContentTypeValidations = [linkContentTypeValidations];
  }

  if (!Array.isArray(linkContentTypeValidations)) {
    linkContentTypeValidations = [];
  }

  return linkContentTypeValidations.includes(VARIATION_CONTAINER_ID);
}
