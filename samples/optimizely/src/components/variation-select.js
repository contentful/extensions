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
import { GlobalStateContext } from '../all-context';

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

  return (
    <div className={styles.container}>
      {/* {props.duplicate && (
        <div className={styles.item}>
          <TextLink icon="Copy" disabled onClick={props.onDuplicateClick}>
            Duplicate {props.duplicate}
          </TextLink>
        </div>
      )} */}
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
            {state.referenceInfo.linkContentTypes.map((value, index) => (
              <DropdownListItem
                key={value}
                onClick={() => {
                  props.onCreate(value);
                  setShowDropdown(false);
                }}>
                {state.referenceInfo.linkContentTypeNames[index]}
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
  duplicate: PropTypes.string,
  onLinkExistingClick: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDuplicateClick: PropTypes.func.isRequired
};
