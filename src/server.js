'use strict';

const fs = require('fs'),
  path = require('path'),
  net = require('net'),
  tls = require('tls');

const server = tls.createServer({
  key: fs.readFileSync(path.join(__dirname, '../keys/server.key')),
  cert: fs.readFileSync(path.join(__dirname, '../keys/server.crt')),
  ca: fs.readFileSync(path.join(__dirname, '../keys/ca.crt')),
  requestCert: true,
}, ss => {
  console.log('server connected',
    ss.authorized ? 'authorized' : 'unauthorized');
  
  ss.setEncoding('utf8');
  ss.write('welcome!\n');

  ss.on('data', data => {
    console.log('From client:', data);
    ss.write(data);
  });

  ss.on('end', console.log.bind(null, 'socket closed'));

  ss.on('error', console.log.bind(null, 'error'))
});

server.listen(8000, console.log.bind(null, 'server listening on port 8000'));