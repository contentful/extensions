'use strict';

const { readdir, readdirSync, readFile, writeFile } = require('fs-extra');

async function dirs(directory) {
  const dirs = [];
  for (const file of await readdir(directory, { withFileTypes: true })) {
    if (file.isDirectory()) {
      dirs.push(file.name);
    }
  }
  return dirs;
}

function dirsSync(directory) {
  const files = readdirSync(directory, { withFileTypes: true });

  return files.filter(file => file.isDirectory()).map(file => file.name);
}

async function readJsonFile(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJsonFile(filePath, data) {
  return await writeFile(filePath, JSON.stringify(data), 'utf8');
}

module.exports = { dirs, dirsSync, readJsonFile, writeJsonFile };
