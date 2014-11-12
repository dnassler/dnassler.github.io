
var _shapeMgr;


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  _shapeMgr = new ShapeMgr();

  background(0,100,200);

}


function draw() {
  background(0,100,200);

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
    blueOrchid: [
      color(123,104,238),
      color(240,230,140),
      color(72,209,204),
      color(153,50,204)
    ],
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

  var _currentColorCombination = 'greenBlue2';
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

  var _shapesArr;

  var _timeToReset = undefined;

  var reset = function() {

    TWEEN.removeAll();

    _shapesArr = [];
    _shapesArr.push( new Shape() );
    //_shapesArr.push( new Shape() );
    var shape = new Shape();
    shape.setColor(color(20,0,180,240));
    _shapesArr.push( shape );

    //_timeToReset = millis() + random(2000,3000);

  };
  reset();

  this.update = function() {

    if ( _timeToReset && millis() > _timeToReset ) {
      _timeToReset = undefined;
      reset();
    }
  
    for ( var i=0; i<_shapesArr.length; i++ ) {
      var shape = _shapesArr[i];
      shape.update();
    }

  };

  this.draw = function() {

    for ( var i=0; i<_shapesArr.length; i++ ) {
      var shape = _shapesArr[i];
      shape.draw();
    }
  
  };

}

function Shape() {

  var _self = this;

  //var _pathsArr;
  var _path1;
  var _path2;

  var _color = color(0,240);
  this.setColor = function(c){
    _color = c;
  };

  this.noiseInput = random(1000);
  var _timeToTwirl;

  var reset = function() {
    _path1 = new Path( _self );
    _path2 = new Path( _self );
    _timeToTwirl = millis() + 5000;
  };
  reset();


  var _drawShape = function() {

    var path1pts = _path1.getPathXPointsWithOffset();
    var path2pts = _path2.getPathXPointsWithOffset();

    //stroke(255);
    //strokeWeight(1);
    noStroke();
    fill(255,200);
    beginShape();

    for ( var i=0; i<path1pts.length; i++) {
      var y = i/(path1pts.length-1)*height;
      vertex(path1pts[i], y);
    }
    for ( var i=path2pts.length-1; i>=0; i--) {
      var y = i/(path2pts.length-1)*height;
      vertex(path2pts[i], y);
    }

    // curveVertex(pathPointsArr[0],0);
    // for ( var i=0; i<pathPointsArr.length; i++) {
    //   var y = i/(pathPointsArr.length-1)*height;
    //   curveVertex(pathPointsArr[i], y);
    // }
    // curveVertex(pathPointsArr[pathPointsArr.length-1],height);
    
    endShape(CLOSE);

    fill(_color,240);
    for ( var i=0; i<path1pts.length; i+=2) {

      if ( !path1pts[i+1] ) {
        continue;
      }

      var y1 = i/(path1pts.length-1)*height;
      var x1 = path1pts[i];
      var y1b = (i+1)/(path1pts.length-1)*height;
      var x1b = path1pts[i+1];

      var y2 = i/(path2pts.length-1)*height;
      var x2 = path2pts[i];

      beginShape();
      vertex(x1,y1);
      vertex(x2,y2);
      vertex(x1b,y1b);
      endShape(CLOSE);
    }


  };

  this.state = undefined;
  this.states = {
    WAITING_FOR_READY_TO_TWIRL: 1,
    TWIRLING_IN_PROGRESS: 2
  };
  this.twirlCount = undefined;

  this.twirl = function( twirlDuration, numTwirls, resumeNormalMovement ) {

    console.log('twirl called');

    _self.state = _self.states.WAITING_FOR_READY_TO_TWIRL;
    var p = new Promise(function(resolve,error){
      Promise.all( [_path1.movementStoppedPromise(), _path2.movementStoppedPromise()] ).then( function() {
        _self.twirlCount = 0;
        _self.state = _self.states.TWIRLING_IN_PROGRESS;
        console.log('twirl started');
        // get path1 top and bottom and path2 top and bottom
        // if path1 top x < path2 top x then
        // tween path1 top x to become greater than path2 top x
        // if path1 top x > path2 top x then
        // tween path1 top x to become lesser than path2 top x
        // similar logic for path1/2 bottom
        var path1TopX = _path1.topX();
        var path1BottomX = _path1.bottomX();
        var path2TopX = _path2.topX();
        var path2BottomX = _path2.bottomX();
        console.log('path1TopX='+path1TopX+', path2TopX='+path2TopX);
        var p1 = _path1.setupTwirlOffsetTween( twirlDuration, numTwirls, {topX:path2TopX, bottomX:path2BottomX} );
        var p2 = _path2.setupTwirlOffsetTween( twirlDuration, numTwirls, {topX:path1TopX, bottomX:path1BottomX} );
        return Promise.all( [p1,p2] ).then(function() {
          // twirl completed, optionally continue regular movement
          _self.state = undefined;
          if ( resumeNormalMovement === undefined || resumeNormalMovement ) {
            _path1.restartRegularPathOffsetTweens();
            _path2.restartRegularPathOffsetTweens();
          }
          resolve();
        });
      });
    });
    return p;

  };

  this.update = function() {

    if ( _timeToTwirl !== undefined && millis() > _timeToTwirl ) {
      _timeToTwirl = undefined;//millis() + random(5000,10000);
      _self.twirl(1000,floor(random(1,10))/2 ).then( function(){
        console.log('twirl completed');
        _timeToTwirl = millis() + random(5000,10000);
      });
    }
    _path1.update();
    _path2.update();

  };

  this.draw = function() {
    _drawShape();
  };

}

function Path( shape ) {

  var _self = this;

  var _pathXPoints;
  var _pathXPointsWithOffset;

  var _offset;

  this.getPathXPointsWithOffset = function() {
    return _pathXPointsWithOffset;
  };

  var _initPathPoints = function() {
    noiseDetail(2,0.2);
    var i;
    var noiseInc = 0.06;
    _pathXPoints = [];
    var minX, maxX;
    for ( i=0.0; i<=1; i+=0.1 ) {
      var noiseVal = noise(shape.noiseInput);
      shape.noiseInput += noiseInc;
      var x = noiseVal * width * 1.5;
      _pathXPoints.push( x );
      if ( minX === undefined || x < minX ) {
        minX = x;
      }
      if ( maxX === undefined || x > maxX ) {
        maxX = x;
      }
    }
    _offset.middleX = (minX + maxX)/2;
    _offset.middleXOffset = 0;
    shape.noiseInput -= noiseInc;
    _pathXPointsWithOffset = [];
  };

  var _updatePathPoints = function() {
    var numPoints = _pathXPoints.length;
    for (var i=0; i<numPoints; i++) {
      var weightingBottomOffset = i/(numPoints-1);
      var weightingTopOffset = (numPoints-1-i)/(numPoints-1);
      _pathXPointsWithOffset[i] = _pathXPoints[i] + _offset.top * weightingTopOffset + _offset.bottom * weightingBottomOffset + _offset.middleXOffset;
    }
  };

  var _resetMiddleXOffset = function() {
    var minOffset = -_offset.middleX;
    var maxOffset = width - _offset.middleX;
    new TWEEN.Tween( _offset )
      .to({middleXOffset:random(minOffset,maxOffset)},3000)
      .easing( TWEEN.Easing.Quadratic.InOut )
      .start();
    // _offset.middleXOffset = random(minOffset,maxOffset);
  };

  //var _head;
  var _path = function() {
    _initPathPoints();
    // _head = {x:_pathXPoints[0],y:0};
    // var t = new TWEEN.Tween(_head)
    //   .to({x:_pathXPoints.slice(1),y:height},2000)
    //   .interpolation(TWEEN.Interpolation.CatmullRom)
    //   .delay(0)
    //   .onComplete(function(){
    //     window.setTimeout(function(){
    //       reset();
    //     },0);
    //   })
    //   .start();
  };

  var _drawPath = function( pathPointsArr ) {
    stroke(255);
    strokeWeight(1);
    beginShape();

    // for ( var i=0; i<_pathXPoints.length; i++) {
    //   var y = i/(_pathXPoints.length-1)*height;
    //   vertex(_pathXPoints[i], y);
    // }

    curveVertex(pathPointsArr[0],0);
    for ( var i=0; i<pathPointsArr.length; i++) {
      var y = i/(pathPointsArr.length-1)*height;
      curveVertex(pathPointsArr[i], y);
    }
    curveVertex(pathPointsArr[pathPointsArr.length-1],height);
    
    endShape();

  };

  var _countResetPathOffsets = 0;
  var _pathOffsetTweenPromise;

  var _resetPathOffsets = function() {

    if ( _countResetPathOffsets >= 2 ) {
      _countResetPathOffsets = 0;
      _resetMiddleXOffset();
    }

    var offsetMax = width/5;
    var topOffset = random(offsetMax*2)-offsetMax;
    var bottomOffset = random(offsetMax*2)-offsetMax;
    _offset.topOffset = topOffset;
    _offset.bottomOffset = bottomOffset;

    var durTop = random(1000,3000);
    var easingChoice = random(3);
    var easingTop;
    if ( easingChoice < 1 ) {
      easingTop = TWEEN.Easing.Circular.In;
    } else if ( easingChoice < 2 ) {
      easingTop = TWEEN.Easing.Circular.Out;
    } else {
      easingTop = TWEEN.Easing.Circular.InOut;
    }
    easingTop = TWEEN.Easing.Linear.None;
    var pTopTween = new Promise(function(resolve,error){
      new TWEEN.Tween(_offset)
        .to({top:_offset.topOffset}, durTop)
        .easing(easingTop)
        .onComplete( function(){
          resolve();
        })
        .start();
    });
    var durBottom = random(1000,3000);
    var easingChoice = random(3);
    var easingBottom;
    if ( easingChoice < 1 ) {
      easingBottom = TWEEN.Easing.Circular.In;
    } else if ( easingChoice < 2 ) {
      easingBottom = TWEEN.Easing.Circular.Out;
    } else {
      easingBottom = TWEEN.Easing.Circular.InOut;
    }
    easingBottom = TWEEN.Easing.Linear.None;
    var pBottomTween = new Promise(function(resolve,error){
      new TWEEN.Tween(_offset)
        .to({bottom:_offset.bottomOffset}, durBottom)
        .easing(easingBottom)
        .onComplete( function() {
          resolve();
        })
        .start();
    });
    _pathOffsetTweenPromise = Promise.all([pTopTween, pBottomTween]);
    _pathOffsetTweenPromise.then( function(){
        window.setTimeout(function(){
          _countResetPathOffsets += 1;
          if ( _isOkToResetRegularPathOffsets() ) {
            console.log('resetting path offsets... should not happen if waiting to twirl');
            _resetPathOffsets();
          }
        }, 0);
      });
  }

  this.movementStoppedPromise = function() {
    return new Promise(function(resolve,error){
      _pathOffsetTweenPromise.then(function(){
        resolve();
      });
    });
  };

  var _isOkToResetRegularPathOffsets = function(){
    if ( shape.state === undefined ) {
      return true;
    }
    return false;
  };

  this.topX = function(){
    return _pathXPointsWithOffset[0];
  };
  this.bottomX = function(){
    return _pathXPointsWithOffset[_pathXPointsWithOffset.length-1];
  };
  this.setupTwirlOffsetTween = function( twirlDuration, numTwirls, offsetInfo ) {
    _updatePathPoints();
    var pOffsetTween = new Promise(function(resolve,error){
      var topSaved = _offset.top;
      var bottomSaved = _offset.bottom;
      var deltaTopX = offsetInfo.topX - _self.topX();
      var deltaBottomX = offsetInfo.bottomX - _self.bottomX();
      console.log('_offset.top='+_offset.top+', _self.topX()='+_self.topX()+', deltaTopX='+deltaTopX);
      var tweenTo = new TWEEN.Tween(_offset)
        .to({top:_offset.top+deltaTopX, bottom:_offset.bottom+deltaBottomX}, twirlDuration)
        .easing(TWEEN.Easing.Circular.InOut)
        .onComplete( function(){
          _updatePathPoints();
          console.log('_offset.top='+_offset.top+', _self.topX()='+_self.topX()+', deltaTopX='+deltaTopX);
          shape.twirlCount += 0.5;
          if ( shape.twirlCount >= numTwirls ) {
            window.setTimeout(function(){
              tweenBack.stop();
              tweenTo.stop();
              resolve();
            },0);
          }
        });
      var tweenBack = new TWEEN.Tween(_offset)
        .to({top:topSaved, bottom:bottomSaved}, twirlDuration)
        .easing(TWEEN.Easing.Circular.InOut)
        .onComplete( function() {
          shape.twirlCount += 0.5;
          if ( numTwirls === undefined ) {
            resolve();
          }
          if ( shape.twirlCount >= numTwirls ) {
            window.setTimeout(function(){
              tweenBack.stop();
              tweenTo.stop();
              resolve();
            },0);
          }
        });
      tweenTo.chain( tweenBack );
      if ( numTwirls && numTwirls > 1 ) {
        console.log('*******');
        tweenBack.chain( tweenTo );
      }
      tweenTo.start();
    });
    return pOffsetTween;
  }

  this.restartRegularPathOffsetTweens = function() {
    _resetPathOffsets();
  };

  var _reset = function() {
    _offset = {top:0,bottom:0};
    _initPathPoints();
    _resetPathOffsets();
  };
  _reset();

  this.update = function() {
    _updatePathPoints();
  };

  this.draw = function() {
    _drawPath( _pathXPointsWithOffset );
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
