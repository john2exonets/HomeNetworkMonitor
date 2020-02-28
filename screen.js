//
//  screen.js  --  Screen Functions for Monitor-like ANSI programms
//
//  John D. Allen
//  September, 2016
//

var ansi = require('./ansi.js');

//  Current cursor position
var cx = 0;
var cy = 0;
var startx = 0;
var colincr = 20;

module.exports = {

  setHome: function(x,y) {
    startx = x;
    cx = x;
    cy = y;
  },

  setColIncr: function(c) {
    colincr = c;
  },

  setCX: function(x) {
    cx = x;
  },

  setCY: function(y) {
    cy = y;
  },

  moveTo: function(x,y) {
    cx = x;
    cy = y;
  },

  up: function(p) {
    ansi.moveTo(p[0],p[1]);
    ansi.color(ansi.FG_WHITE);
    ansi.color(ansi.BG_GREEN);
    ansi.write("  UP  ");
    ansi.colorBgReset();
    ansi.colorFgReset();
  },

  down: function(p) {
    ansi.moveTo(p[0],p[1]);
    ansi.color(ansi.FG_WHITE);
    ansi.color(ansi.BG_RED);
    ansi.write(" DOWN ");
    ansi.colorBgReset();
    ansi.colorFgReset();
  },

  unkn: function(p) {
    ansi.moveTo(p[0],p[1]);
    ansi.color(ansi.FG_WHITE);
    ansi.color(ansi.BG_BLUE);
    ansi.write(" ---- ");
    ansi.colorBgReset();
    ansi.colorFgReset();
  },

  showHeader: function(msg) {
    ansi.clear();
    ansi.dblBox(1,1,2,ansi.ttyColumns -1);
    ansi.moveTo(2,2);
    ansi.colorBgEOL(ansi.BG_BLUE);
    ansi.color(ansi.FG_WHITE);
    ansi.moveTo(2,5);
    ansi.write(msg);
    ansi.colorBgReset();
  },

  write: function(p,msg) {
    ansi.moveTo(p[0],p[1]);
    ansi.write(msg);
  },

  label: function(p,msg) {
    ansi.moveTo(p[0],p[1]+9);
    ansi.write(msg);
  },

  clear: function() {
    ansi.moveTo(0,0);
    ansi.clearEOS();
  },

  hdrTimeStamp: function() {
    ansi.moveTo(2, ansi.ttyColumns - 25);
    ansi.color(ansi.BG_BLUE);
    ansi.write(new Date().toLocaleString());
    ansi.colorBgReset();
  },

  nextXY: function() {
    cx++;
    if (cx > ansi.ttyRows - 3) {
      cx = startx +1;
      cy = cy + colincr;
      return [cx, cy];
    } else {
      return [cx, cy];
    }
  }

}
