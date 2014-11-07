
var _shapeMgr;


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  _shapeMgr = new ShapeMgr();

}


function draw() {
  background(0);

  TWEEN.update();

  _shapeMgr.update();
  _shapeMgr.draw();
}


function ShapeMgr() {

  var _self = this;

  var _colorCombinations = {
    greenBlue1: [
      color(25,25,112),
      color(154,205,50),
      color(176,196,222),
      color(85,107,47),
      color(255,228,196),
      color(240,248,255),
      color(255,255,224),
      color(20)
    ],

    greenBlue2: [
      color(32,178,170),
      color(46,139,87),
      color(143,188,143),
      color(50,205,50),
      color(255,228,181),
      color(192,192,192),
      color(0,191,255),
      color(135,206,250),
      color(245,245,220),
      color(240,248,255),
      color(255,255,224),
      color(175,238,238),
      color(119,136,153),
      color(128,128,128),
      color(245,245,245),
      color(240,128,128)
    ],

    redYellow1: [
      color(219,112,147),
      color(238,130,238),
      color(244,164,96),
      color(218,165,32),
      color(50),
      color(200)
    ],
    // blueOrchid: [
    //   color(123,104,238),
    //   color(240,230,140),
    //   color(72,209,204),
    //   color(153,50,204)
    // ],
    greyCoral: [
      color(119,136,153),
      //color(128,128,128),
      color(70),
      color(245,245,245),
      color(240,128,128),
      color(255,99,71),
      color(255,105,180),
      color(188,143,143),
      color(106,90,205)
    ],
    basicWhiteBlackBlueYellow: [
      color(220),
      color(20),
      color(95),
      color(200,180,50),
      color(20,150,220)
    ],
    basicWhiteBlackBlueYellow2: [
      color(220),
      color(10),
      color(85),
      color(220,200,50),
      color(0,120,220)
    ],
    redWhiteAndGrey: [
      color(189,183,107), //darkkhaki
      color(230,230,250), //lavender
      color(255), //white
      color(112,128,144), //slategray
      color(169,169,169), //darkgray
      color(255,0,0) //red
    ],
    crimsonWheat: [
      color(248,248,255), //ghostwhite
      color(220,20,60), //crimson
      color(245,222,179), //wheat
      color(47,79,79) //darkslategray(greenish)
    ],
    mintcreamBlueGold: [
      color(245,255,250), //mintcream
      color(70,130,180), //steelblue
      color(255,215,0) //gold
      //color(139,69,19) //saddlebrown
    ],
    mediumBlueMistyRoseFuchsia: [
      color(0,0,205), //mediumBlue
      color(255,228,225), //mistyrose
      //color(255,0,255), //fuchsia
      color(0,139,139), //darkcyan
      color(255),
      color(15)
    ]
    
  };

  var _currentColorCombination = 'basicWhiteBlackBlueYellow';
  this.changeColorCombination = function() {
    var allColorComboNames = Object.keys(_colorCombinations);
    var randomColorIndex = floor(random(allColorComboNames.length));
    var currentColorIndex = _currentColorCombination ? 
      allColorComboNames.indexOf(_currentColorCombination) : -1;
    if ( randomColorIndex === currentColorIndex ) {
      randomColorIndex = (randomColorIndex + 1) % allColorComboNames.length;
    }
    _currentColorCombination = allColorComboNames[randomColorIndex];
  };

  this.pickColor = function() {
    if ( !_currentColorCombination ) {
      this.changeColorCombination();
    }
    var combinationArr = _colorCombinations[ _currentColorCombination ];
    if ( combinationArr === undefined ) {
      throw 'bad color combination name';
    }
    var colorPicked = combinationArr[floor(random(combinationArr.length))];
    var randomBrightnessOffset = randomGaussian(0,5);
    var randomRedOffset = randomGaussian(0,5);
    var randomGreenOffset = randomGaussian(0,5);
    var randomBlueOffset = randomGaussian(0,5);
    var r = constrain(red(colorPicked) + randomRedOffset + randomBrightnessOffset, 0, 255);
    var g = constrain(green(colorPicked) + randomGreenOffset + randomBrightnessOffset, 0, 255);
    var b = constrain(blue(colorPicked) + randomBlueOffset + randomBrightnessOffset, 0, 255);
    var alpha = 200;
    colorPicked = color(r,g,b, alpha);
    return colorPicked;
  };

  // --

  var numGridPointsAcrossOrDown = 40;
  var numGridPointsAcross, numGridPointsDown;
  var gridWidth = width;
  var gridHeight = height;
  this._sizeGrid = undefined;
  this._standardGridPointSize = undefined;

  // --

  var _shapeArr;
  var _addNewShape = function() {
    var shape = new Line( _self );
    _shapeArr.push( shape );
    //console.log('addNewShape: _shapeArr.length='+_shapeArr.length);
  }
  var _killOldShape = function() {
    var shape = _shapeArr.shift();
    shape.kill();
    //console.log('_killOldShape: _shapeArr.length='+_shapeArr.length);
  }

  var _timeToReset = undefined;
  var MAX_SHAPES = 200;
  var MIN_NUM_SHAPES = 200;
  var minShapes;
  var maxShapes;

  var _timeToAddShape = millis();
  var _isTimeToAddShape = function() {
    if ( _shapeArr.length < minShapes ) {
      _timeToAddShape = undefined;
      return true;
    }
    if ( _timeToAddShape && millis() > _timeToAddShape ) {
      _timeToAddShape = undefined;
      return true;
    }
    return false;
  };

  var _timeToKillShape = undefined;
  var _isTimeToKillShape = function() {
    if ( _shapeArr.length > maxShapes ) {
      _timeToKillShape = undefined;
      return true;
    }
    if ( _timeToKillShape && millis() > _timeToKillShape ) {
      _timeToKillShape = undefined;
      return true;
    }
    return false;
  };

  var reset = function() {

    TWEEN.removeAll();

    _self.changeColorCombination();

    numGridPointsAcrossOrDown = floor(random(20,60));
    if ( width > height ) {
      numGridPointsAcross = numGridPointsAcrossOrDown;
      numGridPointsDown = floor(numGridPointsAcross * height/width);
      _self._standardGridPointSize = new p5.Vector(width/numGridPointsAcross, width/numGridPointsAcross);
      //_self._standardGridPointSize = new p5.Vector(gridHeight/numGridPointsDown, gridHeight/numGridPointsDown);
    } else {
       numGridPointsDown = numGridPointsAcrossOrDown;
       numGridPointsAcross = floor(numGridPointsDown * width/height);
       _self._standardGridPointSize = new p5.Vector(height/numGridPointsDown, height/numGridPointsDown);
       //_self._standardGridPointSize = new p5.Vector(gridWidth/numGridPointsAcross, gridWidth/numGridPointsAcross);
    }
    // if ( width > height ) {
    //   numGridPointsAcross = numGridPointsAcrossOrDown;
    //   numGridPointsDown = numGridPointsAcross;//floor(numGridPointsAcross * height/width);
    //   //_standardGridPointSize = new p5.Vector(width/numGridPointsAcross, width/numGridPointsAcross);
    //   _self._standardGridPointSize = new p5.Vector(gridHeight/numGridPointsDown, gridHeight/numGridPointsDown);
    // } else {
    //    numGridPointsDown = numGridPointsAcrossOrDown;
    //    numGridPointsAcross = numGridPointsDown;//floor(numGridPointsDown * width/height);
    //    //_standardGridPointSize = new p5.Vector(height/numGridPointsDown, height/numGridPointsDown);
    //    _self._standardGridPointSize = new p5.Vector(gridWidth/numGridPointsAcross, gridWidth/numGridPointsAcross);
    // }

    _self._sizeGrid = new p5.Vector(numGridPointsAcross, numGridPointsDown);

    minShapes = MIN_NUM_SHAPES;
    maxShapes = MAX_SHAPES;
    var minAcrossOrDown = min(numGridPointsAcross,numGridPointsDown);
    if ( minAcrossOrDown <= 40 ) {
      minShapes = floor(MIN_NUM_SHAPES / 3);
      maxShapes = floor(MAX_SHAPES / 3);
    } else if ( minAcrossOrDown <= 35 ) {
      minShapes = floor(MIN_NUM_SHAPES / 4);
      maxShapes = floor(MAX_SHAPES / 4);
    } else if ( minAcrossOrDown <= 30) {
      minShapes = floor(MIN_NUM_SHAPES / 7);
      maxShapes = floor(MAX_SHAPES / 7);
    } else if ( minAcrossOrDown <= 25) {
      minShapes = floor(MIN_NUM_SHAPES / 8);
      maxShapes = floor(MAX_SHAPES / 8);
    }
    console.log('minShapes='+minShapes);
    console.log('maxShapes='+maxShapes);

    _shapeArr = [];
    while ( _shapeArr.length < minShapes ) {
      _addNewShape();
    }

    _timeToReset = millis() + random(2000,5000);

  };

  reset();


  this.update = function() {

    if ( _timeToReset && millis() > _timeToReset ) {
      console.log('time to reset');
      _timeToReset = undefined;
      reset();
    }
  
    if ( _isTimeToAddShape() ) {
      _addNewShape();
      _timeToAddShape = millis() + random(1000);
      //_timeToKillShape = millis() + random(1000,2000);
    }

    if ( _isTimeToKillShape() ) {
      _killOldShape();
      _timeToKillShape = millis() + random(1000,2000);
    }

    var numShapes = _shapeArr.length;
    for ( var i=0; i<numShapes; i++ ) {
      var shape = _shapeArr[i];
      shape.update();
    }

  };

  this.draw = function() {
    push();
    var numShapes = _shapeArr.length;
    for ( var i=0; i<numShapes; i++ ) {
      var shape = _shapeArr[i];
      shape.draw();
    }
    pop();
  };

}

function Line( mgr ) {

  var _isKilled = undefined;
  var _isVisible = undefined;

  var _pos = undefined;
  var _size = undefined;
  var _color = undefined;

  var _sizeGrid = undefined;

  var _setRandomColor = function() {
    _color = mgr.pickColor();
  };

  var _getRandomPos = function() {
    var x = floor( random(0, mgr._sizeGrid.x) );
    var y = floor( random(0, mgr._sizeGrid.y) );
    return {x:x,y:y};
  };

  var _setRandomPos = function() {
    var p = _getRandomPos();
    _pos.set( p.x, p.y ); //position in the grid
  };

  //var _standardGridPointSize;
  var _gridPointSize = function( gx, gy ) {
    return mgr._standardGridPointSize;
  };
  var _widthGridAcross = function() {
    return mgr._standardGridPointSize.x * mgr._sizeGrid.x;
  };
  var _heightGridDown = function() {
    return mgr._standardGridPointSize.y * mgr._sizeGrid.y;
  };

  var _xy = function( gx, gy ) {
    var ps = _gridPointSize(gx,gy);
    //return {x:gx*ps.x + (width-_widthGridAcross())/2, y:gy*ps.y + (height-_heightGridDown())/2, ps:ps};
    var xx = gx*ps.x + (width-_widthGridAcross())/2;
    var yy = gy*ps.y + (height-_heightGridDown())/2;
    return {x:xx, y:yy, ps:ps};
  };

  this.update = function() {

  };

  var _drawAt = function( gx, gy ) {
    if ( gx > mgr._sizeGrid.x || gy > mgr._sizeGrid.y ) {
      return;
    }
    var xy = _xy(gx, gy);
    rect( xy.x, xy.y, xy.ps.x, xy.ps.y );
  };

  this.draw = function() {
    push();
    var c = _color.rgba;
    c[3] = 255;
    fill( c );
    noStroke();
    for (var i=0; i<_size.x; i++) {
      for (var j=0; j<_size.y; j++) {
        _drawAt( _pos.x+i, _pos.y+j*2 );
      }
    }
    pop();
  };

  this.kill = function() {
    _isKilled = true;
  };

  var _reset = function() {
    
    _pos = new p5.Vector();
    _setRandomPos();
    _size = new p5.Vector(floor(random(5)),floor(random(8)));
    _isKilled = false;
    _isVisible = true;
    _setRandomColor();
  };
  _reset();

}


// ---
// ---

// lightseagreen #20B2AA rgb(32,178,170)
// seagreen #2E8B57 rgb(46,139,87)
// darkseagreen #8FBC8F rgb(143,188,143)
// limegreen #32CD32 rgb(50,205,50)
// moccasin #FFE4B5 rgb(255,228,181)
// silver #C0C0C0 rgb(192,192,192)
// deepskyblue #00BFFF rgb(0,191,255)
// lightskyblue #87CEFA rgb(135,206,250)
// beige #F5F5DC rgb(245,245,220)
// aliceblue #F0F8FF rgb(240,248,255)
// lightyellow #FFFFE0 rgb(255,255,224)
// paleturquoise #AFEEEE rgb(175,238,238)
// lightslategray #778899 rgb(119,136,153)
// gray #808080 rgb(128,128,128)
// whitesmoke #F5F5F5 rgb(245,245,245)
// lightcoral #F08080 rgb(240,128,128)

// tomato #FF6347 rgb(255,99,71)
// hotpink #FF69B4 rgb(255,105,180)
// rosybrown #BC8F8F rgb(188,143,143)
// slateblue #6A5ACD rgb(106,90,205)

// lightyellow #FFFFE0 rgb(255,255,224)
// paleturquoise #AFEEEE rgb(175,238,238)
// peru #CD853F rgb(205,133,63)

// mediumslateblue #7B68EE rgb(123,104,238)
// khaki #F0E68C rgb(240,230,140)
// mediumturquoise #48D1CC rgb(72,209,204)
// darkorchid #9932CC rgb(153,50,204)

// palevioletred #DB7093 rgb(219,112,147)
// violet #EE82EE rgb(238,130,238)
// sandybrown #F4A460 rgb(244,164,96)
// goldenrod #DAA520 rgb(218,165,32)

// midnightblue #191970 rgb(25,25,112)
// yellowgreen #9ACD32 rgb(154,205,50)
// lightsteelblue #B0C4DE rgb(176,196,222)
// darkolivegreen #556B2F rgb(85,107,47)
// bisque #FFE4C4 rgb(255,228,196)
