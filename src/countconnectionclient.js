'use strict';

const child_process = require('child_process');

const child = child_process.fork('./src/sender.js');

child.on('exit', () => {
  console.log('exiting');
  process.exit(0);
});

//require('./sender');
