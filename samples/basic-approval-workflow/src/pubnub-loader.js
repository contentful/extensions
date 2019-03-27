const PUBNUB_SDK_URL = 'https://cdn.pubnub.com/sdk/javascript/pubnub.4.21.7.min.js';

export default function loadPubNub() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = PUBNUB_SDK_URL;

    script.onerror = () => reject(new Error('Failed to load PubNub.'));
    script.onload = () => resolve(window.PubNub);

    document.getElementsByTagName('head')[0].appendChild(script);
  });
}
