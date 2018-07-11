'use strict';

const fs = require('fs'),
  path = require('path'),
  tls = require('tls'),
  conf = require('./conf');

conf.setSecure(true);

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding( 'utf8' );

const port = process.argv[2] || 11000;

const s = tls.connect(port, {
  key: fs.readFileSync(path.join(__dirname, '../keys/uni1/client1.key')),
  cert: fs.readFileSync(path.join(__dirname, '../keys/uni1/client1.crt')),
  checkServerIdentity: () => undefined
}, () => console.log('client connected in port ' + port,
              s.authorized ? 'authorized' : 'unauthorized'));

let timer;
let i = 0;

function play() {
  timer = setInterval(writeEvent, 1000);
}

function stop() {
  clearInterval(timer);
}

function writeEvent() {
  const e = 'EVENT-' + i + '\n';
  console.log(e);
  s.write(e);
  i++;
}

function writeIncompleteEvent() {
  const e = 'INCOMPLETE_EVENT';
  console.log(e);
  s.write(e);
}

function writeVeryShortEvent() {
  const e = '<17>\n';
  console.log(e);
  s.write(e);
}

process.stdin.on('data', ch => {
  switch(ch) {
    case 'd':
      console.log('socket end');
      s.end();
      break;
    case 'y':
      console.log('socket destroy');
      s.destroy();
      break;
    case 'e':
      writeEvent();
      break;
    case 'i':
      writeIncompleteEvent();
      break;
    case 'v':
      writeVeryShortEvent();
      break;
    case 'p':
      console.log('play');
      play();
      break;
    case 's':
      console.log('stop');
      stop();
      break;
    case 'q':
      console.log('exit');
      process.exit();
      break;
    default:
      console.log('Not a know command\n');
  }
});

s.setEncoding('utf8');
s.on('data', console.log.bind(null, 'From server:'));
s.on('error', console.log.bind(null, 'error:'));
s.on('end', () => {
  console.log('socket closed');
  process.exit(0);
});
