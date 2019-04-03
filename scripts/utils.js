'use strict';

const { readdir, stat } = require('fs').promises;
const path = require('path');

async function dirs(directory) {
  let dirs = [];
  for (const file of await readdir(directory)) {
    if ((await stat(path.join(directory, file))).isDirectory()) {
      dirs.push(file);
    }
  }
  return dirs;
}

module.exports = { dirs };
