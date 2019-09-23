'use strict';

const { writeFile, rename } = require('fs-extra');
const path = require('path');
const makeDir = require('make-dir');
const cpy = require('cpy');

const { dirs, readJsonFile, writeJsonFile } = require('./utils.js');

const BASE_DIR = path.join(__dirname, '..', 'marketplace');
const BUILD_DIR = path.join(__dirname, '..', 'dist');

async function readExtensionJsonFile(extension, file) {
  const filePath = path.join(BASE_DIR, extension, file);

  return await readJsonFile(filePath);
}

async function writeExtensionManifest(extensionDir, manifest) {
  const outPutDir = path.join(BUILD_DIR, extensionDir);
  const filePath = path.join(outPutDir, 'extension.json');

  return makeDir(outPutDir).then(() => writeJsonFile(filePath, manifest));
}

async function writeExtensionHeaders(extensionDir) {
  const outPutDir = path.join(BUILD_DIR, extensionDir);
  const filePath = path.join(outPutDir, '_headers');

  const headers = `/*
  Strict-Transport-Security: max-age=300
/extension.json
  Access-Control-Allow-Origin: *
  Strict-Transport-Security: max-age=300
`;

  return makeDir(outPutDir).then(() => writeFile(filePath, headers, 'utf8'));
}

console.log('BUILDING.....');

dirs(BASE_DIR)
  .then(dirs => {
    const extensions = dirs.filter(dir => !dir.startsWith('shared-'));
    return Promise.all(
      extensions.map(async extension => {
        const entryFile = path.join(BASE_DIR, extension, 'src', 'index.html');
        const manifest = await readExtensionJsonFile(extension, 'extension.json');
        const packageJson = await readExtensionJsonFile(extension, 'package.json');

        return {
          entryFile,
          name: extension,
          manifest,
          packageJson
        };
      })
    );
  })
  .then(extensions => {
    return Promise.all(
      extensions.map(extension => {
        if (!('version' in extension.packageJson)) {
          throw new Error(`No version defined for ${extension.name}`);
        }

        const majorVersion = extension.packageJson.version.split('.')[0];
        const extensionDir = `${extension.name}-${majorVersion}`;

        const newManifest = Object.assign({}, extension.manifest);

        delete newManifest.srcdoc;

        newManifest.src = `https://${extensionDir}.contentfulexts.com/extension.html`;

        return cpy(path.join(BASE_DIR, extension.name, 'build'), path.join(BUILD_DIR, extensionDir))
          .then(() => writeExtensionManifest(extensionDir, newManifest))
          .then(() => writeExtensionHeaders(extensionDir))
          .then(() =>
            rename(
              path.join(BUILD_DIR, extensionDir, 'index.html'),
              path.join(BUILD_DIR, extensionDir, 'extension.html')
            )
          );
      })
    );
  })
  .catch(err => console.error(err));
