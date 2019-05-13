export default class OptimizelyClient {
  constructor({ sdk, token, project }) {
    this.sdk = sdk;
    this.token = token;
    this.project = project;
    this.baseURL = 'https://api.optimizely.com/v2';
  }

  makeRequest = url => {
    this.sdk.alpha('proxyGetRequest', {
      appId: 'optimizely',
      url: `${this.baseURL}${url}`,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  };

  getExperiment = experimentId => {
    return this.makeRequest(`/experiments/${experimentId}`);
  };

  getExperiments = () => {
    return this.makeRequest(`/experiments?project_id=${this.project}`);
  };

  getExperimentResults = experimentId => {
    return this.makeRequest(`/experiments/${experimentId}/results`);
  };

  getResultsUrl = (campainId, experimentId) => {
    return `https://app.optimizely.com/v2/projects/${
      this.project
    }/results/${campainId}/experiments/${experimentId}`;
  };
}
