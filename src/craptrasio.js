'use strict';
const net = require('net');
const itops = require('lutier/lang/iterator');

let _;
let connId = 0;
let count = 0;
let max = 0;

console.log = () => {};

// Sources side
const server = net.createServer();
server.listen({ host: '127.0.0.1', port: 11000 });
server.on('connection', socket => createConnector(socket));
server.on('error', err => console.log('server', err));

function createConnector(lsocket) {
  console.log(new Date().toISOString(), 'SOURCECONNECTED', lsocket.remotePort);
  lsocket.on('error', err => console.log('lsocket', err));
  tryTargets(new TargetIterator(targets), (err, rsocket) => {
    if (err) return console.log(err);
    lsocket.connId = rsocket.connId = connId++;
    console.log(new Date().toISOString(), 'CONNECTOR',
                        lsocket.remotePort, rsocket.localPort, rsocket.connId);
    rsocket.on('error', err => console.warn(new Date().toISOString(),
                              'TARGETSOCKETERROR', err.code,
                              rsocket.connId));
    rsocket.on('close', () => console.log(new Date().toISOString(),
                                  'TARGETSOCKETCLOSE', count, rsocket.connId));
    rsocket.on('end', () => {
      console.log(new Date().toISOString(),
                                  'TARGETSOCKETEND', rsocket.connId);
      rsocket.destroy();
    });
    lsocket.pipe(rsocket);
  });
};


// Targets side
const targets = [
{
  host: '127.0.0.1',
  port: 1100
}, {
  host: '127.0.0.2',
  port: 1100
}, {
  host: '127.0.0.3',
  port: 1100
}, {
  host: '127.0.0.4',
  port: 1100
}, {
  host: '127.0.0.10',
  port: 1100
}
].map(t => new Target(t));

function tryTargets(iterator, cb) {
  let next = iterator.next();
  if (next.done) {
    cb("No target available", null);
  } else {
    next.value.connect((err, socket) => {
      if (err) tryTargets(iterator, cb);
      else cb(null, socket);
    });
  }
}

//----------------------------------------------------------------------
_ = Target.prototype;
function Target(options) {
  this._options = options;
}

_.connect = function(callback) {
  const socket = net.connect(this._options);
  count++;
  if (count > max) {
    max = count;
    console.warn('MAX', max);
  }
  socket.setTimeout(1000);
  socket.once('connect', continuation)
      .once('error', continuation)
      .once('timeout', timeout);

  function continuation(err) {
    count--;
    if (err) {
      try {socket.destroy();} catch(ignored) {}
      callback(err);
    } else {
      console.log(new Date().toISOString(), 'TARGETCONNECTED', count, socket.localPort)
      socket.setTimeout(0);
      removeAllListeners(socket);
      return callback(null, socket);
    }
  }

  function timeout() {continuation("Timeout");}

  function removeAllListeners(socket) {
    socket.removeAllListeners('connect')
      .removeAllListeners('error')
      .removeAllListeners('timeout');
  }
}

//----------------------------------------------------------------------
_ = TargetIterator.prototype;
function TargetIterator(worker) {
  this._worker = worker;
  this.reset();
}

_.reset = function() {
  var w = this._worker;
  this._targets = targets;
  this._first = 0;
  this._off = 0;
};

_.check = function() {
  if (this._stamp !== this._worker._targetStamp) this.reset();
};

_.next = function() {
  var trgs = this._targets;
  var result;
  if (this._off < trgs.length) {
    result = itops.value(trgs[(this._first + this._off) % trgs.length]);
    this._off++;
  } else {
    result = itops.done;
  }
  return result;
};

