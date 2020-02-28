//
//   Status of ActionTec router (Frontier)
//

var Telnet = require('telnet-client');
var conn = new Telnet();

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
  conn.exec("conf print /dev/eth1/has_ip", (err,resp) => {
    if (err) { process.stderr.write("Err: " + err); }
    conn.end();
    if (resp.indexOf('(has_ip(1))') == 0) {
      console.log("OK");
      process.exit();
    } else {
      process.exit();
    }
  });
});

conn.on('timeout', () => {
  process.stderr.write('--socket timeout--');
  conn.end();
  process.exit();
});

conn.on('close', () => {
  //process.stderr.write('--connection closed--');
});

conn.on('failedlogin', (msg) => {
  //process.stderr.write("Login failed: " + msg);
  process.exit();
});

conn.connect(params);
