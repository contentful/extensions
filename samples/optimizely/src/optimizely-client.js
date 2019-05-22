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

  _getExperimentsPerPage = (perPage, page) => {
    return this.makeRequest(
      `/experiments?project_id=${
        this.project
      }&per_page=${perPage.toString()}&page=${page.toString()}`
    );
  };

  getExperiments = async () => {
    let experiments = [];
    const PER_PAGE = 100;
    const MAX_REQUESTS = 5;

    for (let i = 1; i <= MAX_REQUESTS; i++) {
      const results = await this._getExperimentsPerPage(PER_PAGE, i);
      experiments = [...experiments, ...results];
      if (results.length < PER_PAGE) {
        break;
      }
    }

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

  getExperimentUrl = experimentId => {
    return `https://app.optimizely.com/v2/projects/${
      this.project
    }/experiments/${experimentId}/variations`;
  };

  getAllExperimentsUrl = () => {
    return `https://app.optimizely.com/v2/projects/${this.project}/experiments`;
  };
}
