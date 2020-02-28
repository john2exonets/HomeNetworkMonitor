//
// ansi.js   -- send ANSI screen codes to stdout
//
// John D. Allen
// May, 2015
//

//----------[ Color Codes ]----------
exports.FG_BLACK = 30;
exports.FG_RED = 31;
exports.FG_GREEN = 32;
exports.FG_YELLOW = 33;
exports.FG_BLUE = 34;
exports.FG_MAGENTA = 35;
exports.FG_CYAN = 36;
exports.FG_WHITE = 37;

exports.BG_BLACK = 40;
exports.BG_RED = 41;
exports.BG_GREEN = 42;
exports.BG_YELLOW = 43;
exports.BG_BLUE = 44;
exports.BG_MAGENTA = 45;
exports.BG_CYAN = 46;
exports.BG_WHITE = 47;

// See: https://code.google.com/p/conemu-maximus5/wiki/AnsiEscapeCodes#Examples

var ESC = '\u001B';

exports.ttyRows = process.stdout.rows;
exports.ttyColumns = process.stdout.columns;

exports.curx = 0;
exports.cury = 0;

String.prototype.repeat= function(n){
	n= n || 1;
	return Array(n+1).join(this);
}

//----------[ Terminal Reset ]----------------
exports.resetTerminal = function() {
	process.stdout.write(ESC + 'c');
};

//---------[ write to screen ]------------
exports.write = function(n) {
	// Put string at current cursor and go down one line.
	process.stdout.write(n);
  exports.curx += 1;
  exports.moveTo(exports.curx, exports.cury);
};

//---------[ Clear screen commands ]-------------
exports.clear = function() {
	process.stdout.write(ESC + '[2J' + ESC + '[0;0f');
  exports.curx = 0;
  exports.cury = 0;
};

exports.clearEOL = function() {				// clear from cursor to end of line
	process.stdout.write(ESC + '[0K');
};

exports.clearSOL = function() {				// clear from cursor to start of line
	process.stdout.write(ESC+'[1K');
};

exports.clearLine = function() {			// clear entire line
	process.stdout.write(ESC+'[2K');
};

exports.clearEOS = function() {				// clear from cursor to end of screen
	process.stdout.write(ESC+'[0J');
};

exports.clearTOS = function() {				// clear from cursor to top of screen
	process.stdout.write(ESC+'[1J');
};

//--------[ Text formats ]---------
exports.bold = function() {
	process.stdout.write(ESC+'[1m');
};

exports.underline = function() {
	process.stdout.write(ESC+'[4m');
};

exports.rev = function() {
	process.stdout.write(ESC+'[7m');
};

exports.normal = function() {
	process.stdout.write(ESC+'[0m');
};

//----------[ Move Cursor ]-------------
exports.moveUp = function(n) {
	var cmd = ESC + '[' + n + 'A';
	process.stdout.write(cmd);
  exports.curx -= 1;
};

exports.moveDown = function(n) {
	var cmd = ESC + '[' + n + 'B';
	process.stdout.write(cmd);
  exports.curx += 1;
};

exports.moveRight = function(n) {
	var cmd = ESC + '[' + n + 'C';
	process.stdout.write(cmd);
  exports.cury -= 1;
};

exports.moveLeft = function(n) {
	var cmd = ESC + '[' + n + 'D';
	process.stdout.write(cmd);
  exports.cury += 1;
};

exports.moveTo = function(x,y) {
	var cmd = ESC + '[' + x +';' + y + 'f';
	process.stdout.write(cmd);
  exports.curx = x;
  exports.cury = y;
};

//-------------[ Set Text Colors ]---------------
exports.color = function(color) {
	var cmd = ESC + '[' + color + 'm';
	process.stdout.write(cmd);
};

exports.colorFgRGB = function(r,g,b) {
	var cmd = ESC + '[38;2;' + r + ';' + g + ';' + b + 'm';
	process.stdout.write(cmd);
}

exports.colorFgReset = function() {
	var cmd = ESC + '[39m';
	process.stdout.write(cmd);
}

exports.colorBgRGB = function(r,g,b) {
	var cmd = ESC + '[48;2;' + r + ';' + g + ';' + b + 'm';
	process.stdout.write(cmd);
}

exports.colorBgReset = function() {
	var cmd = ESC + '[49m';
	process.stdout.write(cmd);
}

exports.colorBgEOL = function(color) {
  var cmd = ESC + '[' + color +'m';
  process.stdout.write(cmd);
  process.stdout.write(" ".repeat(exports.ttyColumns-3));
  exports.moveTo(exports.curx, exports.cury);
}

//-------------[ Extended ASCII  ]---------------
//  https://en.wikipedia.org/wiki/List_of_Unicode_characters#Box_Drawing
exports.dblVertical = function() {
  process.stdout.write('\u2551');       // ║
}

exports.dblHorzontal = function() {
  process.stdout.write('\u2550');       // ═
}

exports.dblUpperLeft = function() {
  process.stdout.write('\u2554');
}

exports.dblUpperRight = function() {
  process.stdout.write('\u2557');       // ╗
}

exports.dblLowerLeft = function() {
  process.stdout.write('\u255A');
}

exports.dblLowerRight = function() {
  process.stdout.write('\u255D');
}

exports.dblLeftT = function() {
  process.stdout.write('\u2560');
}

exports.dblRightT = function() {
  process.stdout.write('\u2563');
}

exports.dblTopT = function() {
  process.stdout.write('\u2566');
}

exports.dblBottomT = function() {
  process.stdout.write('\u2569');
}

exports.dblCross = function () {
  process.stdout.write('\u256C');
}

exports.dblBox = function(x,y,a,b) {
  // (x,y) => Starting position
  // (a,b) => size of box

  var t = y + b;
  var g = x + a;
  if (x > exports.ttyRows || g > exports.ttyRows) {
    throw new Error("Cannot draw Box beyond screen boundries:X");
  }
  if (y > exports.ttyColumns || t > exports.ttyColumns) {
    throw new Error("Cannot draw Box beyond screen boundries:Y")
  }
  if (x < 0 || y < 0 || a < 0 || b < 0) {
    throw new Error("Cannot use negative values for cursor positions");
  }

  _drawLine(x,y,b,g,"top");
}

// Recursive function to draw each line of the box.
function _drawLine(r,c,w,g,mode) {
  switch(mode) {
    case "top":
      exports.moveTo(r,c);
      exports.dblUpperLeft();
      for(var i = c+1; i < c+w; i++) {
        exports.moveTo(r,i);
        if(i+1 == c+w) {
          exports.dblUpperRight();
        } else {
          exports.dblHorzontal();
        }
      }
      break;
    case "bot":
      exports.moveTo(r,c);
      exports.dblLowerLeft();
      for(var i = c+1; i < c+w; i++) {
        exports.moveTo(r,i);
        if(i+1 == c+w) {
          exports.dblLowerRight();
        } else {
          exports.dblHorzontal();
        }
      }
      break;
    default:
      exports.moveTo(r,c);
      exports.dblVertical();
      for(var i = c+1; i < c+w; i++) {
        exports.moveTo(r,i);
        if (i+1 == c+w) {
          exports.dblVertical();
        } else {
          process.stdout.write(" ");
        }
      }
  }
  if(r == g - 1) {
    _drawLine(g,c,w,g,"bot");   // last line
  } else if (r == g) {        // no more rows; done
    return;
  } else {
    _drawLine(r+1,c,w,g,"mid")
  }
}

exports.dblBoxScreen = function() {
  exports.dblBox(1,1,exports.ttyRows -1, exports.ttyColumns-1);
}

//---------------[ Test Code ]-------------------
if (require.main === module) {
	_main();
}

function _main() {
	exports.clear();
  exports.dblBoxScreen();
	exports.moveTo(2,2);
	for (var i = 16; i < 231; i++) {
		color = "48;5;" + i;
		exports.color(color);
		process.stdout.write(" ");
	}
	exports.colorBgReset();

  exports.dblBox(5,10,2,25);
  exports.moveTo(6,12);
  exports.write("This screen is " + exports.ttyColumns + "x" + exports.ttyRows);

  exports.dblBox(10,10,5,30);
  exports.moveTo(11, 12);
  exports.write("This is ansi.js");
  exports.write("Written by John D. Allen");
  exports.write("May 2015");
  exports.moveTo(exports.ttyRows -1, 10);
}
