import React, { useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import extension from '../extension.json';
import BynderDialog from './BynderDialog';
import Thumbnail from './Thumbnail';

function reducer(state, action) {
  switch (action.type) {
    case 'add-all-assets':
      return [...state, ...action.payload];
    case 'remove-asset':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
}

function Field({ sdk }) {
  const [assets, dispatch] = useReducer(reducer, sdk.field.getValue() || []);

  useEffect(() => {
    sdk.window.startAutoResizer();
    return () => {
      sdk.window.stopAutoResizer();
    };
  }, []);

  useEffect(() => {
    sdk.field.setValue(assets);
  }, [assets]);

  const onBynderDialogOpen = async () => {
    const assets = await sdk.dialogs.openExtension({
      id: extension.id,
      width: 900,
      title: 'Select images from contentful.getbynder.com',
      shouldCloseOnEscapePress: true,
    });
    if (assets) {
      dispatch({ type: 'add-all-assets', payload: assets });
    }
  };

  return (
    <React.Fragment>
      {assets.length > 0 && (
        <div className="thumbnail-list">
          {assets.map(asset => (
            <Thumbnail
              key={asset.id}
              id={asset.id}
              src={asset.src}
              onDeleteClick={() => {
                dispatch({ type: 'remove-asset', payload: asset.id });
              }}
            />
          ))}
        </div>
      )}
      <div className="actions">
        <div className="logo" />
        <Button
          icon="Asset"
          buttonType="muted"
          size="small"
          onClick={onBynderDialogOpen}
        >
          Select images in Bynder
        </Button>
      </div>
    </React.Fragment>
  );
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(
      <BynderDialog sdk={sdk} />,
      document.getElementById('root')
    );
  } else {
    ReactDOM.render(<Field sdk={sdk} />, document.getElementById('root'));
  }
});

// if (module.hot) {
//   module.hot.accept();
// }
