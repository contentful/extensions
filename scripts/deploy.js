'use strict';

// DEPLOYMENT HAPPENS HERE - tread carefully

const path = require('path');
const NetlifyAPI = require('netlify');
const ora = require('ora');
const logSymbols = require('log-symbols');

const { dirs } = require('./utils.js');

const BUILD_DIR = path.join(__dirname, '..', 'dist');
const client = new NetlifyAPI(process.env.NETLIFY_TOKEN);

function createOrUpdate(extensionName) {
  const siteName = `ctf-exts-${extensionName}`;
  const customDomain = `${extensionName}.contentfulexts.com`;

  return client
    .getSite({ site_id: customDomain })
    .then(
      site => {
        console.log('\nUpdating existing site', siteName);
        return site;
      },
      err => {
        if (err.status === 404) {
          console.log('Creating a new site', siteName);
          return client.createSiteInTeam({
            account_slug: 'contentful',
            body: {
              name: siteName,
              custom_domain: customDomain,
              ssl: true
            }
          });
        } else {
          return Promise.reject(err);
        }
      }
    )
    .then(site => {
      return client.deploy(site.id, path.join(BUILD_DIR, extensionName), {
        statusCb: deployProgressCb()
      });
    });
}

dirs(BUILD_DIR)
  .then(extensions => {
    return Promise.all(extensions.map(createOrUpdate));
  })
  .catch(err => console.error(err));

function deployProgressCb() {
  const events = {};

  return ev => {
    switch (ev.phase) {
      case 'start': {
        const spinner = 'earth';
        events[ev.type] = ora({
          text: ev.msg,
          spinner
        }).start();
        return;
      }
      case 'progress': {
        const spinner = events[ev.type];
        if (spinner) spinner.text = ev.msg;
        return;
      }
      case 'stop':
      default: {
        const spinner = events[ev.type];
        if (spinner) {
          spinner.stopAndPersist({ text: ev.msg, symbol: logSymbols.success });
          delete events[ev.type];
        }
        return;
      }
    }
  };
}
