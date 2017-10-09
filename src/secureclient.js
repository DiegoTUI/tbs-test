'use strict';

const fs = require('fs'),
  path = require('path'),
  tls = require('tls'),
  conf = require('./conf');

conf.setSecure(true);

const s = tls.connect(14000, {
  ca: fs.readFileSync(path.join(__dirname, '../keys/uni1/rootCA.crt')),
  checkServerIdentity: () => undefined
}, () => console.log('client connected',
              s.authorized ? 'authorized' : 'unauthorized'));

process.stdin.on('data', data => s.write(data));

s.setEncoding('utf8');
s.on('data', console.log.bind(null, 'From server:'));
s.on('error', console.log.bind(null, 'error:'));
s.on('end', () => {
  console.log('socket closed');
  process.exit(0);
});