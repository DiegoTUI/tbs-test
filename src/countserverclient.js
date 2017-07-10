'use strict';

const net = require('net');
const times = parseInt(process.argv[2]) || 100;
const message = process.argv[3] || 'randomMessage';

let totalCount;

const strOcurrences = (needle, haystack) => {
  return haystack.split(needle).length - 1;
};

const server = net.createServer({
}, s => {
  totalCount = 0;
  console.log('Client connected. Total count: ' + totalCount);
  
  s.setEncoding('utf8');

  s.on('data', data => {
    const localCount = strOcurrences(message, data);
    totalCount += localCount;
    console.log('Local count: ' + localCount);
    console.log('Total count: ' + totalCount);
  });

  s.on('end', () => console.log('socket ended server'));
  s.on('close', () => console.log('Socket closed server. Total count: ' + totalCount));

  s.on('error', console.log.bind(null, 'error'))
});

server.listen(8000, console.log.bind(null, 'server listening on port 8000'));

const client = new net.Socket();

client.on('connect', () => {
  for (let i = 0; i < times; i++) {
    client.write(message)
  }

  client.end();
  console.log('Sent: ' + times);
});

client.setEncoding('utf8');
client.on('error', console.log.bind(null, 'error:'));
client.on('end', () => {
  console.log('socket ended client');
  process.exit(0);
});

setTimeout(client.connect.bind(client,8000), 1000);