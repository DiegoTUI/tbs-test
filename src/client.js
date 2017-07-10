'use strict';

const net = require('net'),
  conf = require('./conf');

conf.setSecure(false);

const s = net.connect(8000, () => console.log('client connected',
              s.authorized ? 'authorized' : 'unauthorized'));

process.stdin.on('data', data => s.write(data));

s.setEncoding('utf8');
s.on('data', console.log.bind(null, 'From server:'));
s.on('error', console.log.bind(null, 'error:'));
s.on('end', () => {
  console.log('socket closed');
  process.exit(0);
});