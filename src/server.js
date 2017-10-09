'use strict';

const fs = require('fs'),
  path = require('path'),
  net = require('net'),
  tls = require('tls'),
  conf = require('./conf');

const server = net.createServer({
}, s => {
  console.log('client connected',
    conf.isSecure() ? 'secured' : 'unsecured');
  
  if (conf.isSecure()) {
    s = new tls.TLSSocket(s, {
      isServer: true,
      server: server,
      key: fs.readFileSync(path.join(__dirname, '../keys/server.key')),
      cert: fs.readFileSync(path.join(__dirname, '../keys/server.crt')),
      ca: fs.readFileSync(path.join(__dirname, '../keys/ca.crt')),
      requestCert: true
    });

    s.on('secure', () => console.log('Socket secure connect!!'));
  }
  
  s.setEncoding('utf8');
  s.write('welcome!\n');

  s.on('data', data => {
    console.log('From ' +
      (conf.isSecure() ? 'secured' : 'unsecured') + ' client:', data);
    s.write(data);
  });

  s.on('end', () => console.log('socket ended'));
  s.on('close', () => console.log('socket closed'));

  s.on('error', console.log.bind(null, 'error'))
});

server.listen(1400, console.log.bind(null, 'server listening on port 8000'));