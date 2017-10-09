'use strict';

const net = require('net');

var buffer = new Buffer(0x43);

buffer.write('0000000c01010001000000030000002b010104020000000300000000000000000000000766772e6c6f67000000000200000001000000010000000c0101040c00000003',
'hex');

//var client = net.connect(18185, "192.168.32.250");
var client = net.connect(18185, "localhost");
client.write(buffer);
client.on('data', console.log.bind(null, 'data'))
//client.pipe(process.out);
//console.log(buffer.toString('hex'));
