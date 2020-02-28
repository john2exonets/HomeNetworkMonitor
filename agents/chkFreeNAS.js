//
//  chkFreeNAS.js  --  Check status of FreeNAS box for HNM.
//
//  John D. Allen
//  Oct. 2019
//

var HOST = "10.1.1.10";
var USER = "root";
var PASSWD = "password";
var VOLUME = "nas-zps";

var http = require('http');
var util = require('util');

var opts = {
  method: 'GET',
  host: HOST,
  port: 80,
  path: "/api/v1.0/storage/volume/" + VOLUME + '/',
  headers: {
    'Authorization': 'Basic ' + new Buffer(USER + ":" + PASSWD).toString('base64'),
    'cache-control': 'no-cache',
    'Content-Type': 'application/json'
  }
};
//console.log(opts);

var body = "";

var req = http.request(opts, (res) => {
  //console.log("res: " + util.inspect(res, false, null, true) );
  if (res.statusCode == 301) {
    //console.log("Redirect: " + res.headers.location);
    process.exit();
  }

  res.on('data', (data) => {
    //console.log('.');
    body += data;
  });

  res.on('error', (err) => {
    //console.log("ERR:" + err);
    process.exit();
  });

  res.on('end', () => {
    //console.log(">>" + body);
    var rr = JSON.parse(body);
    //console.log("]]]" + rr);
    if (rr.status == "HEALTHY") {
      console.log("OK");
      process.exit();
    } else {
      process.exit();
    }
  });

});

req.end();
