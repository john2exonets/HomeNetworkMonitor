//
//  IPC_Pool_Svr.js  --  Check to see if the Pool Temp Sensor is sending MQTT packets. Unix Domain Socket
//     is used to provide API point for IPC_Pool_Client.js (This is assuming programs run on same computer.)
//
//  John D. Allen
//  February, 2020
//

var mqtt = require('mqtt');
var net = require('net');
var fs = require('fs');

//----------------------[  Constants  ]---------------------------
const BROKER = "http://10.1.1.28";
const DEBUG = false;
const TIMEOUT = 20000;  // 20 seconds
const SOCKETFILE = '/tmp/poolsensor.sock'

// MQTT connection options
var copts = {
  keepalive: 5000
};
var lasttime = Date.now();
var server;
var connections = {};
var topics = [
  'temp/read/Pool'
];

//---------------------------------------------------------------------------
// MQTT Stuff
//---------------------------------------------------------------------------
var client = mqtt.connect(BROKER, copts);

client.on("connect", function() {
  client.subscribe(topics);
});

client.on('message', function(topic, message) {
  var out = topic + ": " + message.toString();
  if (DEBUG) { console.log(Date() + ":" + out); }

  // Check for bad data
  if (message.indexOf("nan") > 0) {
    if (DEBUG) { console.log(">> BAD DATA"); }
    return false;
  }
  // If we get a message from Out2, incr coutner.
  lasttime = Date.now();
});

//---------------------------------------------------------------------------
// UNIX Domain Socket Stuff
//---------------------------------------------------------------------------
fs.stat(SOCKETFILE, (err,stats) => {
  if (err) {
    // start server
    if (DEBUG) { console.log("No leftover socket found. Starting Server..."); }
    server = createServer(SOCKETFILE);
    return;
  }
  // remove old socket file, then start server
  fs.unlink(SOCKETFILE, (err) => {
    if (err) {
      // error on delete?!?
      console.log("ERROR - Unable to remove old Socket File: " + SOCKETFILE);
      process.exit(1);
    }
    if (DEBUG) { console.log("Removed old socket. Starting Server..."); }
    server = createServer(SOCKETFILE);
    return;
  });
});

function createServer(socket) {
  var server = net.createServer((stream) => {
    if (DEBUG) { console.log("Connection acknowledged."); }
    var self = Date.now();
    connections[self] = (stream);

    stream.on('end', () => {
      if (DEBUG) { console.log("Client disconnected."); }
      delete connections[self];
    });

    // Messages are buffers -- use toString()
    stream.on('data', (msg) => {
      msg = msg.toString();
      // Status:  Return number of ms since last MQTT packet
      if (msg === 'status') {
        stream.write((Date.now() - lasttime).toString());
      }
    });
  })
  .listen(socket)
  .on('connection', (socket) => {
    // do nothing -- here in case we want to act on the connection
    if (DEBUG) { console.log("Client connected."); }
  });
  return server;
}
