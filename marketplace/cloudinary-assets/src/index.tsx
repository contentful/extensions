import * as React from "react";
import { render } from "react-dom";
import {
  init,
  FieldExtensionSDK,
  locations,
  DialogExtensionSDK,
} from "contentful-ui-extensions-sdk";
import "@contentful/forma-36-react-components/dist/styles.css";
import "./index.css";
import { CloudinaryField } from "./components/cloudinaryField/cloudinaryField";
import CloudinaryDialog from "./components/cloudinaryDialog/cloudinaryDialog";

init(sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    render(
      <CloudinaryDialog sdk={sdk as DialogExtensionSDK} />,
      document.getElementById("root"),
    );
  } else {
    render(
      <CloudinaryField sdk={sdk as FieldExtensionSDK} />,
      document.getElementById("root"),
    );
  }
});
