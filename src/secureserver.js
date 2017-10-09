'use strict';

const fs = require('fs'),
  path = require('path'),
  tls = require('tls');

const server = tls.createServer({
  key: fs.readFileSync(path.join(__dirname, '../keys/server.key')),
  cert: fs.readFileSync(path.join(__dirname, '../keys/server.crt')),
  ca: fs.readFileSync(path.join(__dirname, '../keys/ca.crt')),
}, s => {
  console.log('client connected');
  
  s.setEncoding('utf8');
  s.write('welcome!\n');

  s.on('data', data => {
    console.log('From client:', data);
    s.write(data);
  });

  s.on('end', () => console.log('socket ended'));
  s.on('close', () => console.log('socket closed'));

  s.on('error', console.log.bind(null, 'error'))
});

server.listen(8000, console.log.bind(null, 'server listening on port 8000'));