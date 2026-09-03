// Adds the piece to the "paths" block of the Activepieces tsconfig.base.json.
// Without this entry turbo cannot resolve @asyntai/piece-asyntai and the build
// fails before it starts.
const fs = require('fs');
const path = require('path');

const FILE = path.join(process.argv[2] || '.', 'tsconfig.base.json');
const NAME = '@asyntai/piece-asyntai';
const TARGET = 'packages/pieces/community/asyntai/src/index.ts';

const text = fs.readFileSync(FILE, 'utf8');
if (text.includes(NAME)) {
  console.log('already registered');
  process.exit(0);
}

const anchor = '"paths": {';
const at = text.indexOf(anchor);
if (at === -1) {
  throw new Error('no "paths" block in ' + FILE);
}

const entry = '\n      "' + NAME + '": [\n        "' + TARGET + '"\n      ],';
const out = text.slice(0, at + anchor.length) + entry + text.slice(at + anchor.length);
fs.writeFileSync(FILE, out);
console.log('registered ' + NAME);
