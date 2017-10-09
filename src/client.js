'use strict';

const net = require('net'),
  conf = require('./conf');

conf.setSecure(false);

const s = net.connect(11000);

s.on('connect', () => console.log('client connected',
              s.authorized ? 'authorized' : 'unauthorized', s.connecting))
process.stdin.on('data', data => {
  let str = data.toString().substring(0, data.length - 1);
  if (str.length === 1) str = '\n';
  s.write(str);
});

s.setEncoding('utf8');
s.on('data', console.log.bind(null, 'From server:'));
s.on('error', console.log.bind(null, 'error:'));
s.on('end', () => {
  console.log('socket closed');
  process.exit(0);
});
