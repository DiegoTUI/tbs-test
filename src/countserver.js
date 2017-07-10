'use strict';

const net = require('net');
const message = process.argv[2] || 'randomMessage';

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

  s.on('end', () => console.log('socket ended'));
  s.on('close', () => console.log('Socket closed. Total count: ' + totalCount));

  s.on('error', console.log.bind(null, 'error'))
});

server.listen(8000, console.log.bind(null, 'server listening on port 8000'));