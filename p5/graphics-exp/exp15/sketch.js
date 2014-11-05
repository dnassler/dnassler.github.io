
var _shapeMgr;
var _stars;


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  background(120);

  _shapeMgr = new ShapeMgr();
  _stars = new Stars();

  _bgObj = {colorVariance: 1};

  var bgToDarkTween = new TWEEN.Tween( _bgObj )
    .to({colorVariance: 0}, 30000)
    .easing(TWEEN.Easing.Circular.InOut);
  var bgToLightTween = new TWEEN.Tween( _bgObj )
    .to({colorVariance: 1}, 30000)
    .easing(TWEEN.Easing.Circular.InOut);

  bgToDarkTween.chain( bgToLightTween );
  bgToLightTween.chain( bgToDarkTween );

  bgToDarkTween.start();

}

var _bgObj;

function draw() {
  //background(0,100,200);
  var bgColor = color(0, floor(100*_bgObj.colorVariance), floor(200*_bgObj.colorVariance));
  background(bgColor);

  TWEEN.update();

  _stars.update();
  _stars.draw();

  _shapeMgr.update();
  _shapeMgr.draw();
}

function Stars() {

  var _self = this;

  var _starsArr;
  var _numStars;

  this.reset = function() {
    _starsArr = [];
    _numStars = floor(random(50,100));
    for ( var i=0; i<_numStars; i++ ) {
      var s = new Star();
      _starsArr.push(s);
    }

  };
  this.reset();

  this.update = function() {
    for ( var i=0; i<_numStars; i++ ) {
      var s = _starsArr[i];
      s.update();
    }
  };

  this.draw = function() {
    noStroke();
    fill(255);
    for ( var i=0; i<_numStars; i++ ) {
      var s = _starsArr[i];
      s.draw();
    }
  };

}

function Star() {
  var _size = random(2,10);
  var _pos = new p5.Vector( random(width), random(height) );
  this.update = function() {
    _pos.x -= 1;
    if ( _pos.x < -10 ) {
      _pos.x = width+10;
    }
  };
  this.draw = function() {
    push();
    noStroke();
    fill(255);
    ellipse(_pos.x, _pos.y, _size, _size);
    pop();
  };
}

function ShapeMgr() {

  var _self = this;

  var _paths;
  var _numPaths;

  this.noiseInput = 0.0;


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

  var _currentColorCombination = 'basicWhiteBlackBlueYellow2';
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

  var _isWaitingToReset;
  this.isOkResetPath = function() {
    return !_isWaitingToReset;
  };

  var _timeToReset = undefined;

  var reset = function() {

    _isWaitingToReset = false;

    TWEEN.removeAll();

    _paths = [];
    _numPaths = floor(random(5,10));
    for (var i=0; i<_numPaths; i++) {
      var p = new Path( _self );
      _paths.push( p );
    }

    //_timeToReset = millis() + random(10000,20000);

  };

  reset();

  var _fadeAllPaths = function() {
    var fadePathsArr = [];
    for (var i=0; i<_numPaths; i++) {
      var p = _paths[i];
      fadePathsArr.push( p.fadeOutPath() );
    }
    return Promise.all( fadePathsArr );
  };

  this.update = function() {

    if ( _timeToReset && millis() > _timeToReset ) {
      _timeToReset = undefined;
      _isWaitingToReset = true;
      var pathsDrawnArr = [];
      for (var i=0; i<_numPaths; i++) {
        var p = _paths[i];
        pathsDrawnArr.push( p.fullyDrawn() );
      }
      Promise.all( pathsDrawnArr ).then( function() {
        return _fadeAllPaths();
      }).then( function() {
        reset();
      });
    }
  
    for (var i=0; i<_numPaths; i++) {
      var p = _paths[i];
      p.update();
    }

  };

  this.draw = function() {
    
    for (var i=0; i<_numPaths; i++) {
      var p = _paths[i];
      p.draw();
    }

  };

}


function Path( shapeMgr ) {
  
  var _self = this;

  var _shapeMgr = shapeMgr;

  var _pos = new p5.Vector();

  var _initColor;
  var _attr;
  var _isFullyDrawn;
  var _fullyDrawn; // promise
  this.fullyDrawn = function() {
    return _fullyDrawn;
  };

  var _timeToFadeOut;

  var maxPathWidth = width/10;
  var minPathWidth = maxPathWidth/10;

  var _tweens = [];

  var _setColorRandom = function() {
    _color = _shapeMgr.pickColor();
  };

  var _stopAllTweens = function() {
    for ( var i=0; i<_tweens.length; i++ ) {
      _tweens[i].stop();
    }
  };

  var _pathXPoints;
  var _pathPoints;
  var _initPathPoints = function() {
    noiseDetail(2,0.2);
    var i;
    _pathXPoints = [];
    _pathPoints = [];
    for ( i=0.0; i<=1; i+=0.1 ) {
      var noiseVal = noise(_shapeMgr.noiseInput);
      _shapeMgr.noiseInput += 0.05;
      //_pathPoints.push( new p5.Vector( noiseVal*width*1.5, i*height*1.2-height*.1 ) );
      _pathXPoints.push( noiseVal * width * 1.5 );
    }
    // for ( i=0.0; i<=1; i+=0.005 ) {
    //   var noiseVal = noise(_shapeMgr.noiseInput);
    //   _shapeMgr.noiseInput += 0.005;
    //   _pathPoints.push( new p5.Vector( noiseVal*width*1.5, i*height*1.2-height*.1 ) );
    // }
    _shapeMgr.noiseInput -= 0.0;
  };

  var _drawPathDuration;

  this.introducePath = function() {

    var p = new Promise(function(resolve,error){

      var tween = new TWEEN.Tween(_attr);
      var fadeTime = random(3000,7000);
      tween.to({alpha:_attr.color.rgba[3]}, fadeTime);
      tween.easing(TWEEN.Easing.Quadratic.InOut);
      var d = 0;//random(5000);
      tween.delay(d);
      tween.start();

      // the following makes the path
      _attr.pathHead = {x:_pathXPoints[0], y:-_attr.pathWidth, ballRotation: random(-PI,PI)};//new p5.Vector(_pathXPoints[0],-_attr.pathWidth);
      _pathPoints.push( {x: _attr.pathHead.x, y: _attr.pathHead.y} );

      _drawPathDuration = fadeTime;
      var tween2 = new TWEEN.Tween(_attr.pathHead);
      tween2.to({x:_pathXPoints.slice(1), y:height+_attr.pathWidth, ballRotation: random(-PI,PI)}, _drawPathDuration);
      tween2.interpolation( TWEEN.Interpolation.Bezier );
      //tween2.interpolation( TWEEN.Interpolation.CatmullRom );
      tween2.easing(TWEEN.Easing.Linear.None);
      tween2.delay(d);
      tween2.onUpdate( function() {
        _pathPoints.push( new p5.Vector( this.x, this.y ) );
      });
      tween2.onComplete(function() {
        _isFullyDrawn = true;
        resolve();
      });
      tween2.start();

      _attr.pathOffset = new p5.Vector(0,0);
      var pathOffsetTween = new TWEEN.Tween( _attr.pathOffset );
      pathOffsetTween.to({x:random(-100,100)}, random(5000,10000))
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .delay(random(2000))
        .start();


    });

    return p;

  };

  this.fadeOutPath = function() {
    var p = new Promise(function(resolve,error) {
      var tween = new TWEEN.Tween(_attr);
      tween.to({alpha:0},2000);
      tween.easing(TWEEN.Easing.Quadratic.InOut);
      tween.onComplete( function() {
        _isFullyDrawn = false;
        resolve();
      });
      tween.start();
    });
    return p;
  }

  var _ballInfo;

  this.dropBall = function() {

    _ballInfo = {ballPointIndex: 0, ballRotation: random(-PI,PI) };
    var tween = new TWEEN.Tween(_ballInfo);
    tween.to({ballPointIndex:_pathPoints.length, ballRotation:random(-PI,PI)}, _drawPathDuration);
    tween.easing(TWEEN.Easing.Linear.None);
    tween.delay(random(2000));
    tween.onUpdate( function() {
      if ( !_isFullyDrawn ) {
        window.setTimeout(function(){
          tween.stop();
          _ballInfo = undefined;
        },0);
      }
    });
    tween.onComplete(function() {
      if ( _isFullyDrawn ) {
        _self.dropBall();
      }
    });
    tween.start();

  };

  this.reset = function() {
    _stopAllTweens();
    _isFullyDrawn = false;
    _attr = {};
    _ballInfo = {};
    _initColor = _shapeMgr.pickColor();
    _attr.color = color(_initColor.rgba);
    _attr.alpha = 0;
    _attr.pathWidth = random(minPathWidth, maxPathWidth);
    _initPathPoints();
    _fullyDrawn = this.introducePath();
    _fullyDrawn.then(function() {
      _self.dropBall();
      _timeToFadeOut = millis() + random(10000);
    });

  };

  this.reset();
  

  this.update = function() {
    if ( _timeToFadeOut !== undefined && millis() > _timeToFadeOut ) {
      _timeToFadeOut = undefined;
      _self.fadeOutPath().then( function() {
        if ( _shapeMgr.isOkResetPath() ) {
          _self.reset();
        }
      });
    }
  };

  this.draw = function() {
    if ( floor(_attr.alpha) === 0 ) {
      return;
    }
    var pathWidth = _attr.pathWidth;
    push();
    translate( _attr.pathOffset.x, 0 );
    push();
    if ( _attr.alpha !== undefined ) {
      _attr.color.rgba[3] = floor(_attr.alpha);
    }
    stroke( _attr.color.rgba );
    strokeWeight( pathWidth );
    noFill();
    beginShape(LINES);
    var lastIndex = _pathPoints.length;
    for (var i=0; i<lastIndex; i++) {
      var p = _pathPoints[i];
      vertex( p.x, p.y );
    }
    endShape();
    pop();

    if ( _isFullyDrawn && _ballInfo && _ballInfo.ballPointIndex !== undefined ) {
      var ballIndex = floor(_ballInfo.ballPointIndex);
      var ballPoint = _pathPoints[ballIndex];
      if ( !ballPoint ) {
        console.log('ballIndex = '+ballIndex);
      } else {
        drawStarBall( ballPoint.x, ballPoint.y, pathWidth, _ballInfo.ballRotation );
      }
    } else if ( !_isFullyDrawn ) {
      var ballPoint = _attr.pathHead;
      if ( ballPoint ) {
        drawStarBall( ballPoint.x, ballPoint.y, pathWidth, ballPoint.ballRotation );
      }

    }
    pop();
  }

  var drawStarBall = function( x, y, size, ballRotation ) {
    push();

    translate( x, y );
    rotate( ballRotation );

    noStroke();
    fill(180,floor(100*_attr.alpha/200));
    ellipse(0, 0, size, size );

    var outsideRadius = _attr.pathWidth;
    var insideRadius = _attr.pathWidth/10;
    
    var numPoints = 6;
    var angle = 0;
    var angleStep = PI/numPoints;
    
    fill(255,floor(255*_attr.alpha/200));
    beginShape(TRIANGLE_STRIP); 
    for (var i = 0; i <= numPoints; i++) {
      var px = cos(angle) * outsideRadius;
      var py = sin(angle) * outsideRadius;
      angle += angleStep;
      vertex(px, py);
      px = cos(angle) * insideRadius;
      py = sin(angle) * insideRadius;
      vertex(px, py); 
      angle += angleStep;
    }
    endShape(CLOSE);
    pop();
  };

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
