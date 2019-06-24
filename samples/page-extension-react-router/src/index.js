import React, { useEffect } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { Router, Switch, Route, Link } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { init, locations } from 'contentful-ui-extensions-sdk';
import { Tab, Tabs, TabPanel, Heading, Button } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss';
import './index.css';

function MainPage() {
  return (
    <TabPanel id="main" className="f36-margin-top--l">
      Main page
    </TabPanel>
  );
}

function OtherPage() {
  return (
    <TabPanel id="other" className="f36-margin-top--l">
      <div>Other page</div>
      <Link to="/">Go back to main tab</Link>
    </TabPanel>
  );
}

function Page404() {
  return <Heading>404</Heading>;
}

class PageExtension extends React.Component {
  constructor(props) {
    super(props);
    this.history = createMemoryHistory({ initialEntries: [props.sdk.parameters.invocation.path] });
    this.history.listen(location => {
      this.props.sdk.navigator.openPageExtension({ path: location.pathname });
    });
  }

  render = () => {
    return (
      <div className="f36-margin--l">
        <Router history={this.history}>
          <Tabs>
            <Route
              render={props => (
                <>
                  <Tab
                    id="main"
                    selected={props.location.pathname === '/'}
                    onSelect={() => {
                      props.history.push('/');
                    }}>
                    Main
                  </Tab>
                  <Tab
                    id="other"
                    selected={props.location.pathname === '/other'}
                    onSelect={() => {
                      props.history.push('/other');
                    }}>
                    Other
                  </Tab>
                </>
              )}
            />
          </Tabs>
          <Switch>
            <Route path="/" exact render={MainPage} />
            <Route path="/other" exact render={OtherPage} />
            <Route render={Page404} />
          </Switch>
        </Router>
      </div>
    );
  };
}

PageExtension.propTypes = {
  sdk: PropTypes.object.isRequired
};

function SidebarExtension(props) {
  useEffect(() => {
    return props.sdk.window.startAutoResizer();
  }, [props.sdk]);

  return (
    <Button
      onClick={() => {
        props.sdk.navigator.openPageExtension({ path: '/' });
      }}>
      Open page extension
    </Button>
  );
}

SidebarExtension.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  if (sdk.location.is(locations.LOCATION_PAGE)) {
    render(<PageExtension sdk={sdk} />, document.getElementById('root'));
  } else if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    render(<SidebarExtension sdk={sdk} />, document.getElementById('root'));
  } else {
    return null;
  }
});
