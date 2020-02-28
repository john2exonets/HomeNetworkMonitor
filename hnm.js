//
//  hnm.js  --  Home Network Monitor
//
//  John D. Allen
//  July 2013
//

var c = require('./config.json');
var test = require('./tests.js');
var scr = require('./screen.js');

const STARTX = 4;
const STARTY = 3;
scr.setColIncr(40);
var pos = [];

//---------------------------------------------------------------------------
//  runTests()  --  Main function that fires off all the various node tests.
//---------------------------------------------------------------------------
function runTests() {
  // parse through nodes array and fire off tests
  scr.setHome(STARTX, STARTY);
  c.nodes.forEach((node) => {
    pos = scr.nextXY();
    runATest(pos, node);
  });
}

//---------------------------------------------------------------------------
//  runATest()  --  Each node/test gens this function call to handle the
//    request in an asynch manner.
//
//  Available Tests:
//    ping  --  Do a simple ping to the node IP address.
//    http  --  Do a simple HTTP call to the node.
//    https --  Do a HTTPS call, but ignore SSL errors.
//    dnsquery --  Check the IP for a response to a DNS Query.
//    extcmd -- Run an External Command using the passed string. Must return "OK" to pass.
//    wpchk -- Check to see if Wordpress Website is responding correctly.
//---------------------------------------------------------------------------
function runATest(p,n)  {
  scr.label(p, n.name);
  switch(n.test) {
    case "ping":
      test.ping(n.ip, n.log).then((out) => {
        if (out) {
          scr.up(p);
        } else {
          scr.down(p);
        }
      });
      break;
    case "http":
      test.http(n.ip, n.port, n.log).then((out) => {
        if (out) {
          scr.up(p);
        } else {
          scr.down(p);
        }
      });
      break;
    case "https":
      test.https(n.ip, n.port, n.log).then((out) => {
        if (out) {
          scr.up(p);
        } else {
          scr.down(p);
        }
      });
      break;
    case "dnsquery":
      test.dnsquery(n.ip, n.log).then((out) => {
        if (out) {
          scr.up(p);
        } else {
          scr.down(p);
        }
      });
      break;
    case "extcmd":
      test.extcmd(n.cmd, n.log).then((out) => {
        if (out) {
          scr.up(p);
        } else {
          scr.down(p);
        }
      });
      break;
    case "wpchk":
      test.wpchk(n.fqdn, n.log).then((out) => {
        if (out) {
          scr.up(p);
        } else {
          scr.down(p);
        }
      });
      break;
    default:
      scr.unkn(p);
      break
  }
  setTimeout(runATest, n.freq, p, n);   // Reschedule test
}

function setScreen() {
  scr.showHeader("Home Network Monitor");
  scr.setHome(STARTX, STARTY);
  c.nodes.forEach((node) => {
    pos = scr.nextXY();
    scr.unkn(pos);
    scr.label(pos, node.name);
  });
  setTimeout(setScreen, 3600000);   // Refresh once an hour
}

function showTimestamp() {
  scr.hdrTimeStamp();
  setTimeout(showTimestamp, 60000);
}
//---------------------------------------------------------------------------
//  main()  --  Main function that starts the tests.
//---------------------------------------------------------------------------
function main() {
  setScreen();
  showTimestamp();
  runTests();
}


//---------------------------------------------------------------------------
main();
