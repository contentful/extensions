export default class OptimizelyClient {
  constructor({ project, accessToken, onReauth }) {
    if (typeof accessToken !== 'string' || !accessToken) {
      throw new Error('You must provide a valid access token!');
    }

    this.accessToken = accessToken;
    this.project = project;
    this.baseURL = 'https://api.optimizely.com/v2';
    this.onReauth = onReauth;
  }

  makeRequest = async url => {
    const response = await fetch(`${this.baseURL}${url}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });

    if (response.ok) {
      return await response.json();
    }

    // reauthing should hopefully fix the issue
    this.onReauth();
  };

  getProjects() {
    return this.makeRequest('/projects');
  }

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

  getResultsUrl = (campaignUrl, experimentId) => {
    return `https://app.optimizely.com/v2/projects/${this.project}/results/${campaignUrl}/experiments/${experimentId}`;
  };
}
