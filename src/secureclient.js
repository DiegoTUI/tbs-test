'use strict';

const fs = require('fs'),
  path = require('path'),
  tls = require('tls');

const s = tls.connect(8000, {
  key: fs.readFileSync(path.join(__dirname, '../keys/client.key')),
  cert: fs.readFileSync(path.join(__dirname, '../keys/client.crt')),
  ca: fs.readFileSync(path.join(__dirname, '../keys/ca.crt')),
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