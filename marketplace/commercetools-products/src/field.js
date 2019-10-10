import React from 'react';
import PropTypes from 'prop-types';

import { Button, Spinner } from '@contentful/forma-36-react-components';
import { ApolloProvider } from '@apollo/react-components';
import { SortableContainer } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { getApolloClient } from './apollo';
import { SortableProductCard } from './product-card';

const SortableList = SortableContainer(function SortableList({
  items,
  removeItem,
  locale,
  sortable,
  isDisabled,
  projectKey
}) {
  return (
    <ol className="product-list">
      {items.map((sku, index) => {
        return (
          <li key={index} className="product-list__item">
            <SortableProductCard
              sku={sku}
              index={index}
              itemIndex={index}
              removeItem={removeItem}
              locale={locale}
              sortable={sortable}
              disabled={isDisabled}
              isDisabled={isDisabled}
              projectKey={projectKey}
            />
          </li>
        );
      })}
    </ol>
  );
});

export class CommerceToolsField extends React.Component {
  constructor(props) {
    super(props);

    const { extension } = props;

    let value = extension.field.getValue();
    if (value === undefined) {
      value = [];
    }

    this.state = {
      fieldValue: Array.isArray(value) ? value : [value],
      apolloClient: null,
      isDisabled: false
    };

    this.onDialogOpen = this.onDialogOpen.bind(this);
    this.updateFieldValue = this.updateFieldValue.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  componentDidMount() {
    const { extension } = this.props;

    getApolloClient(this.props.parameters)
      .then(apolloClient => {
        this.setState({ apolloClient });
      })
      .catch(err => console.error(err));

    this.unsubscribeOnValue = extension.field.onValueChanged(value => {
      if (value === undefined) {
        value = [];
      }

      this.setState({ fieldValue: Array.isArray(value) ? value : [value] });
    });

    // Disable editing (e.g. when field is not editable due to R&P).
    this.unsubscribeOnIsDisabled = extension.field.onIsDisabledChanged(isDisabled => {
      this.setState({ isDisabled });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeOnValue) {
      this.unsubscribeOnValue();
    }

    if (this.unsubscribeOnIsDisabled) {
      this.unsubscribeOnIsDisabled();
    }
  }

  onDialogOpen() {
    const { isSingle, extension } = this.props;

    extension.dialogs
      .openExtension({
        id: extension.ids.extension,
        position: 'center',
        title: isSingle ? 'Select Product' : 'Select Products',
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscapePress: true,
        parameters: {
          isSingle
        },
        width: 1400
      })
      .then(data => {
        if (data.length === 0) {
          return;
        }

        const newValue = [...(this.state.fieldValue || []), ...data];
        this.updateFieldValue(newValue);
      });
  }

  updateFieldValue(value) {
    const { isSingle, extension } = this.props;

    this.setState({ fieldValue: value });
    if (value.length === 0) {
      extension.field.removeValue();
    } else if (isSingle && value.length === 1) {
      extension.field.setValue(value[0]);
    } else {
      extension.field.setValue(value);
    }
  }

  onRemoveItem(indexToRemove) {
    const newValue = this.state.fieldValue.filter((_, i) => {
      return i !== indexToRemove;
    });

    this.updateFieldValue(newValue);
  }

  onSortEnd({ oldIndex, newIndex }) {
    const fieldValue = arrayMove(this.state.fieldValue, oldIndex, newIndex);

    this.updateFieldValue(fieldValue);
  }

  render() {
    const { isSingle, parameters } = this.props;
    const { fieldValue, isDisabled } = this.state;
    const { locale, projectKey } = parameters;

    if (!this.state.apolloClient) {
      return <Spinner size="large" />;
    }

    const showLinkButtons = !isDisabled && (!isSingle || fieldValue.length === 0);
    let button = null;
    if (showLinkButtons) {
      button = (
        <Button icon="ShoppingCart" buttonType="muted" size="small" onClick={this.onDialogOpen}>
          {isSingle ? 'Select Product' : 'Select Products'}
        </Button>
      );
    }

    return (
      <React.Fragment>
        <ApolloProvider client={this.state.apolloClient}>
          <SortableList
            axis="y"
            lockAxis="y"
            items={this.state.fieldValue}
            removeItem={this.onRemoveItem}
            locale={locale}
            onSortEnd={this.onSortEnd}
            sortable={!isSingle}
            isDisabled={isDisabled}
            projectKey={projectKey}
            useDragHandle
          />
        </ApolloProvider>
        {button}
      </React.Fragment>
    );
  }
}

CommerceToolsField.propTypes = {
  extension: PropTypes.object.isRequired,
  parameters: PropTypes.shape({
    projectKey: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    clientSecret: PropTypes.string.isRequired,
    apiUri: PropTypes.string.isRequired,
    authUri: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired
  }).isRequired,
  isSingle: PropTypes.bool.isRequired
};
