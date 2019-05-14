export default class OptimizelyClient {
  constructor({ sdk, project }) {
    this.sdk = sdk;
    this.project = project;
    this.baseURL = 'https://api.optimizely.com/v2';
  }

  makeRequest = async url => {
    const response = await this.sdk.alpha('proxyGetRequest', {
      appId: 'optimizely',
      url: `${this.baseURL}${url}`,
      headers: {
        Authorization: `Bearer 2:y65PaQwDbaNo8WZUkVskR0i14F6EYbCWSO3EMdDlhdBZ8JVdZIFs`
      }
    });
    if (response.status === 200) {
      return JSON.parse(response.body);
    } else {
      throw Error('Failed optimizely request: ' + response.status);
    }
  };

  getExperiment = experimentId => {
    return this.makeRequest(`/experiments/${experimentId}`);
  };

  getExperiments = async () => {
    // todo: make several request if page is full
    let experiments = await this.makeRequest(
      `/experiments?project_id=${this.project}&per_page=100&page=1`
    );
    experiments = experiments.filter(experiment => {
      return experiment.status !== 'archived';
    });
    return experiments;
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
