'use strict';

const net = require('net');
const times = parseInt(process.argv[2]) || 100;
const message = process.argv[3] || 'randomMessage\n';

const s = net.connect(8000);

s.on('connect', () => {
  for (let i = 0; i < times; i++) {
    s.write(message)
  }

  s.end();
  console.log('Sent: ' + times);
});

s.setEncoding('utf8');
s.on('error', console.log.bind(null, 'error:'));
s.on('end', () => {
  console.log('socket closed');
  process.exit(0);
});
