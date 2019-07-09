import { locations } from '../src/sdk';

describe('Optimizely UIE entry', () => {
  const mockInit = jest.fn();

  jest.mock('../src/sdk', () => {
    return {
      __esModule: true,
      init: mockInit,
      locations
    };
  });

  jest.mock('../src/optimizely-client', () => {
    return {
      __esModule: true,
      init: mockInit,
      locations
    };
  });

  it('should instantiate the optimizely client on init', () => {});
  it('should render MissingProjectId screen if no projectId exists', () => {});
  it('should render App if contentType is valid', () => {});
  it('should render IncorrectContentType if contentType is invalid', () => {});
  it('should render AppSidebar if in sidebar location', () => {});
});
