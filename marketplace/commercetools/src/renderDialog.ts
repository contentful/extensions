// Allow lodash uniq usage. We have lodash installed anyway and using
// the ES6 alternative (...new Set()), would require enabling downleveling
// iteration in TS Config which with the end transpilation cost incurred
// would be a worse solution.
/* eslint-disable-next-line you-dont-need-lodash-underscore/uniq */
import uniq from 'lodash/uniq';
import get from 'lodash/get';
import { Hash } from './interfaces';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';

export async function renderDialog(sdk: DialogExtensionSDK) {
  const { projectKey, locale, clientId, clientSecret } = sdk.parameters.installation as Hash;

  const ID = 'dialog-root';
  const container = document.createElement('div');
  container.id = ID;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  document.body.appendChild(container);

  const fieldTypeIsArray = get(sdk, ['parameters', 'invocation', 'fieldType']) === 'Array';

  const pickerModeIsCategory = get(sdk, ['parameters', 'invocation', 'pickerMode']) === 'category';

  const pickerOptions = {
    project: {
      projectKey,
      credentials: {
        clientId,
        clientSecret
      }
    },
    mode: 'embedded',
    searchLanguage: locale,
    selectionMode: fieldTypeIsArray ? 'multiple' : 'single',
    pickerMode: pickerModeIsCategory ? 'category' : 'product',
    uiLocale: 'en-US',
    displayOptions: {
      showHeader: false,
      showCancelButton: false,
      showSelectButton: true
    }
  };

  const ctPicker = new (window as any).CTPicker(pickerOptions, container);
  try {
    sdk.window.updateHeight(660);

    const result = await ctPicker.show();
    const data = result.map((entry: Hash): string => {
      // If the user is picking a category we save the internal ID of the category.
      // For products we save the SKU.
      return pickerModeIsCategory ? entry.id : entry.masterVariant.sku;
    });

    const persistedData = get(sdk, ['parameters', 'invocation', 'fieldValue'], []);

    // For single selection we want to replace the persisted SKU for the new one
    // For multi selection, we want to append the new results to the previous, keeping
    // only unique values.
    const finalData = fieldTypeIsArray ? uniq([...persistedData, ...data]) : data;
    sdk.close(finalData);
  } catch (error) {
    if (error !== 'cancel') {
      // Widget is going to throw if the user closes the product picking dialog
      // without selecting a product. We need to swallow these exceptions and throw the rest.
      throw new Error(error);
    }
  }

  sdk.window.startAutoResizer();
}
