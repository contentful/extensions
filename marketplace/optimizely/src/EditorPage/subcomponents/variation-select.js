import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  TextLink,
  Dropdown,
  DropdownList,
  DropdownListItem
} from '@contentful/forma-36-react-components';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';
import { GlobalStateContext } from './all-context';

const styles = {
  container: css({
    marginTop: tokens.spacingM
  }),
  item: css({
    marginBottom: tokens.spacingXs
  })
};

export default function VariationSelect(props) {
  const [isDropdownShown, setShowDropdown] = useState(false);
  const [state] = useContext(GlobalStateContext);

  const linkContentTypes = state.referenceInfo.linkContentTypes || [];
  const linkContentTypeNames = state.referenceInfo.linkContentTypeNames || [];

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <Dropdown
          isOpen={isDropdownShown}
          onClose={() => {
            setShowDropdown(false);
          }}
          toggleElement={
            <TextLink
              icon="Plus"
              onClick={() => {
                setShowDropdown(true);
              }}>
              Create entry and link
            </TextLink>
          }>
          <DropdownList maxHeight={300}>
            <DropdownListItem isTitle>Select content type</DropdownListItem>
            {linkContentTypes.map((value, index) => (
              <DropdownListItem
                key={value}
                onClick={() => {
                  props.onCreate(value);
                  setShowDropdown(false);
                }}>
                {linkContentTypeNames[index]}
              </DropdownListItem>
            ))}
          </DropdownList>
        </Dropdown>
      </div>
      <div className={styles.item}>
        <TextLink icon="Link" onClick={props.onLinkExistingClick}>
          Link an existing entry
        </TextLink>
      </div>
    </div>
  );
}

VariationSelect.propTypes = {
  onLinkExistingClick: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};
