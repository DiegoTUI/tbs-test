'use strict';

const fs = require('fs'),
  path = require('path'),
  net = require('net');

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding( 'utf8' );

const port = process.argv[2] || 11000;

const s = net.connect(port,
  () => {
    console.log('client connected in port ' + port,
      s.authorized ? 'authorized' : 'unauthorized');
    if (process.argv[3] === 'now') {
      shuffleN(3, parseInt(process.argv[4]) || 1000);
      process.exit();
    }
  });

let timer;
let i = 0;
const DELAY = 0

function play() {
  timer = setInterval(writeEvent, DELAY);
}

function stop() {
  clearInterval(timer);
}

function write(e) {
  console.log(e);
  s.write(e);
  i++;
}

function message(d, i) {
  //return `(ci[client${d}]) - EVENT${i}\n`;
  return  `<17> (ci[client${d}]) \
    web.nginx.access.prod.packagequality.s1: 91.126.217.35 - - \
    [03/Jul/2017:12:44:36 +0000] "GET /shield/i18next.svg HTTP/1.1" \
    304 0 "-" "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) \
      Gecko/20100101 Firefox/54.0"[${i}]\n`
};

function writeEvent() {write('EVENT-' + i + '\n');}

function writeDomainEvent(d) {write(message(d, i));}

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

function shuffle(n) {
  let c = 0;
  timer = setInterval(() => {
    writeDomainEvent(c%n + 1);
    c++;
  }, DELAY);
}

function shuffleN(n, total) {
  let c = 0;
  for (let i=0; i<total; i++) {
    writeDomainEvent(c%n + 1);
    c++
  }
}

process.stdin.on('data', ch => {
  switch(ch) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      writeDomainEvent(ch);
      break;
    case 'z':
      console.log('shuffling 1');
      shuffle(1);
      break;
    case 'c':
      console.log('shuffling 1, 2, 3');
      shuffle(3);
      break;
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
    case 'v':
      writeVeryShortEvent();
      break;
    case 'i':
      writeIncompleteEvent();
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
