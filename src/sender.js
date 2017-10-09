'use strict'

const async = require('async');
const net = require('net');

let count = 0;
const n = 10000;
const validOpts = {
  host: '127.0.0.10',
  port: 1500
};
const invalidOpts = [{
  host: '127.0.0.1',
  port: 1500
}, {
  host: '127.0.0.2',
  port: 1500
}, {
  host: '127.0.0.3',
  port: 1500
}, {
  host: '127.0.0.4',
  port: 1500
}];

const shoot = () => new Promise(ok => {
  async.timesSeries(n, (_, next) => {
    round().then(() => next());
  }, () => ok());
});

const round = () => new Promise(ok => {
  const stream = invalidOpts.map(o => next => {
    const s = net.connect(o);
    s.once('error', err => {
      console.log('ERROR', o.host, err.code);
      try {s.destroy()} catch(ignored) {};
      return next();
    });
    s.once('timeout', () => {
      console.log('TIMEOUT', o.host);
      try {s.destroy()} catch(ignored) {};
      return next();
    });

    s.setTimeout(1000);
  });

  stream.push(next => {
    console.log('validConnect', ++count)
    let socket;
    setImmediate(() => {
      socket = net.connect(validOpts);
      socket.once('connect', () => {
        socket.setKeepAlive(false, 0);
        socket.end();
      });
      socket.once('close', () => next());
    });
  });

  async.series(stream, () => ok())
});

shoot().then(() => process.exit(0));
