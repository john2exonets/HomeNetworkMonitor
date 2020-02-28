//
//   Status of dynamic DNS x.io 
//

var Telnet = require('telnet-client');
var conn = new Telnet();
var dns = require('dns');

//  parameters to connect to Actiontec Router
var params = {
  host: '192.168.1.1',
  port: 8023,
  shellPrompt: "Wireless Broadband Router> ",
  timeout: 1500,
  username: 'admin',
  password: 'password',
  loginPrompt: 'Username: '
}

conn.on('ready', (prompt) => {
  // Connect to ActionTec Router and grab assigned IP Address
  conn.exec("conf print /dev/eth1/dyn/ip", (err,resp) => {
    if (err) { console.log("Err: " + err); }
    var rr = resp.slice(4, resp.indexOf('))'));
    //console.log(resp);
    conn.end();
    //  Lookup IP of Dynamic DNS and see if it matches.
    dns.lookup('x.io', (err,resp) => {
      if (resp == rr) {
        console.log("OK");
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
  });
});

conn.on('timeout', () => {
  //console.log('--socket timeout--');
  conn.end();
  process.exit(1);
});

conn.on('close', () => {
  //console.log('--connection closed--');
});

conn.on('failedlogin', (msg) => {
  //console.log("Login failed: " + msg);
  process.exit(1);
});

conn.connect(params);
