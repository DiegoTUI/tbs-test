'use strict';

const net = require('net');
let count = 0;

const server = net.createServer();
server.listen({ host: '127.0.0.10', port: 1100 });
server.on('connection', socket => {
  console.log('****CONNECTED****', ++count);
  socket.on('data', data => console.log('data', data.toString('utf8')));
});
