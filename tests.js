//
//  tests.js  --  The various tests to run to check for network services.
//
//  John D. Allen
//  September 2019
//

var ping = require('ping');
var http = require('http');
var https = require("https");
var dns = require('dns');
var util = require('util');
var exec = require('child_process').exec;
var moment = require('moment-timezone');
var winston = require('winston');
var myFormat = winston.format.printf(msg => `${msg.timestamp}[${msg.level}]: ${msg.message}`);
var appendTimestamp = winston.format((info, opts) => {
  if(opts.tz)
    info.timestamp = moment().tz(opts.tz).format();
  return info;
})
var logger = winston.createLogger({
  format: winston.format.combine(
    appendTimestamp({tz: 'America/Chicago'}),
    myFormat
  ),
  transports: [
    new winston.transports.File({ filename: 'tests-error.log'})
  ]
});

var NAMETOQUERY = "google.com";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;   // skips invalid SSL Certs

module.exports = {

  ping: function(ip, log) {
    return new Promise(function(resolve,reject) {
      ping.promise.probe(ip).then((res) => {
        resolve(res.alive);
      }).catch((err) => {
        if (log) { logger.error("ping: Error = " + err + " host:" + ip); }
        resolve(false);
      });
    });
  },

  http: function(ip,port,log) {
    return new Promise(function(resolve,reject) {
      if (port == "" || port == 0) { port = 80; }
      port = port.toString();
      var url = "http://" + ip + ":" + port + "/";
      http.get(url, (resp) => {
        var { statusCode } = resp;
        var d = '';
        resp.on('data', (chunk) => { d += chunk; });
        resp.on('end', () => {
          if (statusCode == 200) {
            resolve(true);
          } else {
            if (log) { logger.debug("http: IP:" + ip + " RtnCode:" + statusCode + " host:" + ip); }
            resolve(false);
          }
        });
      }).on('error', (err) => {
        if (log) { logger.error("http: Error = " + err + " host:" + ip); }
        resolve(false);
      });
    });
  },

  https: function(ip,port,log) {
    return new Promise(function(resolve,reject) {
      if (port == "" || port == 0) { port = 443; }
      port = port.toString();
      var url = "https://" + ip + ":" + port + "/";
      https.get(url, (resp) => {
        var { statusCode } = resp;
        var d = '';
        resp.on('data', (chunk) => { d += chunk; });
        resp.on('end', () => {
          if (statusCode == 200) {
            resolve(true);
          } else {
            if (log) { logger.debug("httsp: IP:" + ip + " RtnCode:" + statusCode + " host:" + ip); }
            resolve(false);
          }
        });
      }).on('error', (err) => {
        if (log) { logger.error("https: Error = " + err + " host:" + ip); }
        resolve(false);
      });
    });
  },

  dnsquery: function(ip,log) {
    return new Promise(function(resolve,reject) {
      ping.promise.probe(ip).then((res) => {  // ping first to get around assertion error!
        if (res.alive) {
          var svr = [ip];
          dns.setServers(svr);
          try {
            dns.resolve4(NAMETOQUERY, (err,addr) => {
              if (JSON.stringify(addr) !== undefined) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          } catch(e) {
            //  Assertion failed - Unable to connect to DNS Server
            if (log) { logger.debug("dnsquery: Error = " + e + " host:" + ip); }
            resolve(false);
          };
        } else {
          resolve(false);   // ping failed.
        }
      }).catch((err) => {
        if (log) { logger.error("dnsquery: Error = " + err + " host:" + ip); }
        resolve(false);
      });  // ping
    });  // Promise
  },

  extcmd: function(cmd,log) {
    return new Promise(function(resolve,reject) {
      exec(cmd, (err,stdout,stderr) => {
        if (err && log) { logger.error("extcmd: Error = " + err + "cmd:" + cmd); }
        //console.log(">" + stdout + "<");
        if (stdout.indexOf("OK") == 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  wpchk: function(fqdn,log) {
    return new Promise(function(resolve,reject) {
      var url = "https://" + fqdn + "/wp-admin";
      https.get(url, (resp) => {
        var { statusCode } = resp;
        var d = '';
        resp.on('data', (chunk) => { d += chunk; });
        resp.on('end', () => {
          if (statusCode == 302 || statusCode == 301) {
            resolve(true);
          } else {
            if (log) { logger.debug("wpchk: FQDN:" + fqdn + " RtnCode:" + statusCode); }
            resolve(false);
          }
        });
      }).on('error', (err) => {
        if (log) { logger.error("wpchk: Error = " + err + " host:" + ip); }
        resolve(false);
      });
    });
  }

}
