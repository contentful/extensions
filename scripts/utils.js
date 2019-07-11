'use strict';

const { readdir, readdirSync } = require('fs-extra');

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

module.exports = { dirs, dirsSync };
