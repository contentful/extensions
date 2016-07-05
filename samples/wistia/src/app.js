import Wistia from './components/wistia';
import '../node_modules/contentful-ui-extensions-sdk/dist/cf-extension.css';
import './css/styles.css';

// Id of project in Wistia.
const WISTIA_PROJECT_ID = 'on2x2ho05v';
// URL to wistia's api including our read-only API key.
const WISTIA_API_URL = 'https://api.wistia.com/v1/medias.json?api_password=1317a87dbf0a' +
  '869f2a7e025c3e2c0c984208c0bc6107dd041108fd3ba2ae782d';
let sdk = require('contentful-ui-extensions-sdk');
sdk.init(function (widget) {
  let wistia = new Wistia(widget, WISTIA_PROJECT_ID, WISTIA_API_URL);
});
