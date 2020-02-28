//
//  IPC_Pool_Client.js  --  Connect to the IPC_Pool_Svr.js Unix Domain Socket to check Pool Sensor Status.
//
//  February, 2020
//  John D. Allen
//

var net = require('net');
var fs = require('fs');

const DEBUG = false;
const SOCKETFILE = '/tmp/poolsensor.sock'

var client;

if (DEBUG) { console.log("Connecting to server..."); }
client = net.createConnection(SOCKETFILE)
  .on('connect', () => {
    if (DEBUG) { console.log("Connected."); }
  })
  .on('data', (data) => {
    data = data.toString();
    if (DEBUG) { console.log("Server: " + data); }

    if (data >= 600000) {   // 10 minutes - Pool sensor should report every 5 min.
      // not OK
    } else {
      console.log("OK");
    }
    client.end();
    process.exit();
  })
  .on('error', (err) => {
    if (DEBUG) { console.log("ERROR - Unable to connect to Server."); }
    process.exit();
  });

client.write('status');
