//
//  outsidesta.js  --  Check to see if the Outside Weather Station is sending MQTT packets
//
//  John D. Allen
//  September, 2019
//

var mqtt = require('mqtt');

//----------------------[  Constants  ]---------------------------
const BROKER = "http://10.1.1.28";
const DEBUG = false;
const TIMEOUT = 20000;  // 20 seconds

// MQTT connection options
var copts = {
  keepalive: 5000
};
var counter = 0;
var topics = [
  'wind/dir/Out2',
  'wind/speed/Out2'
];

var client = mqtt.connect(BROKER, copts);

client.on("connect", function() {
  client.subscribe(topics);
});

client.on('message', function(topic, message) {
  var out = topic + ": " + message.toString();
  if (DEBUG) { console.log(out); }

  // Check for bad data
  if (message.indexOf("nan") > 0) {
    if (DEBUG) { console.log(">> BAD DATA"); }
    return false;
  }
  // If we get a message from Out2, incr coutner.
  counter++;
});

function waitForMsgs() {
  setTimeout(function() {
    client.unsubscribe(topics);
    client.end(true);
    if (counter > 0) {
      console.log("OK");
      process.exit();
    } else {
      process.exit();
    }
  }, TIMEOUT);
}

waitForMsgs();
