const fs = require('fs');
const path = require('path');

const ENC = { encoding: 'utf8' };
const TAG_TO_REPLACE = '<script type="text/javascript" src="./index.jsx"></script>';

const resolve = file => path.resolve(__dirname, file);
const read = file => fs.readFileSync(resolve(file), ENC);

const html = read('./src/index.html');
const script = ['<script>', read('./build/index.js'), '</script>'].join('\n');
const result = html.replace(TAG_TO_REPLACE, script);

fs.writeFileSync(resolve('./build/index.html'), result, ENC);
