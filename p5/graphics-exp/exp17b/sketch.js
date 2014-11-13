
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
  var _wantsControlAll;

  var _timeToDoSomething;
  var _timeToMoveShapes;



  // this function is called by shape objects asking before they do twirls which is currently
  // the only high level things shapes may do on their own
  // also this is called internally before doing something (i.e. doSomething ) to check
  // if something (high level) is in progress
  this.wantsControl = function( shape ) {
    if ( _wantsControlAll ) {
      return true;
    }
    return false;
  };
  var _somethingInProgress = function() {
    return _self.wantsControl();
  };

  var _grabControlAll = function() {
    console.log('grab control attempt...');
    _wantsControlAll = true;
    var p = new Promise(function(resolve,error) {
      var shapeReadyPromiseArr = [];
      _shapesArr.forEach( function(shape) {
        shapeReadyPromiseArr.push( shape.readyToAcceptCommandPromise() );
      });
      console.log('waiting for control of all shapes');
      Promise.all( shapeReadyPromiseArr ).then(function() {
        console.log('all shapes ready to control');
        resolve();
      });
    });
    return p;
  };

  var _resumeAutoShapeBehaviour = function() {
    console.log('resuming auto shape behaviour');
    _wantsControlAll = false;
    _shapesArr.forEach( function(shape) {
      shape.restartRegularShapeMovement();
    });
  };

  this.pickNumRandomTwirls = function( minNum, maxNum ) {
    // picks a random number between (inclusive) minNum and maxNum
    // the number returned will either be an integer or integer with
    // a half fraction (where half fractions indicate a half twirl
    // eg. minNum=1, maxNum=2.5 would result in a random value
    // between 1 and 2.5 inclusively)
    var rNumHalfTwirls = floor(random( minNum*2, (maxNum+0.5)*2 ));
    return rNumHalfTwirls/2;
  };


  var _doSomething = function() {
    console.log('do something***********');
    var p = new Promise(function(resolve,reject){
      _grabControlAll().then(function(){

        console.log('_doSomething: wait 0ms then spin all shapes');

        window.setTimeout(function(){

          console.log('spin all shapes');
          var twirlCompletedPromises = [];
          var twirlDuration = random(500,1000);
          var numTwirls = _self.pickNumRandomTwirls(0.5,2);
          _shapesArr.forEach( function(shape) {
            console.log('spin all shapes: call twirl on a shape');
            var twirlCompletedPromise = shape.twirl(twirlDuration, numTwirls);
            twirlCompletedPromises.push( twirlCompletedPromise );
          });
          Promise.all( twirlCompletedPromises ).then(function(){
            console.log('spin all shapes completed');
            resolve();
          });

        },0);

      });
    });
    return p;
  };

  var _moveShapes = function() {
    console.log('move shapes**********');
    var p = _grabControlAll().then(function() {
      var shape1 = _shapesArr[0];
      shape1.moveShapeTo( random(width*0.2,width*0.8), 1000 );
      var shape2 = _shapesArr[1];
      var promise = shape2.moveShapeTo( random(width*0.2,width*0.8), 1000 );
      return promise;
    });
    return p;
  };


  var reset = function() {

    TWEEN.removeAll();

    _shapesArr = [];
    _shapesArr.push( new Shape() );
    //_shapesArr.push( new Shape() );
    var shape = new Shape();
    shape.setColor(color(20,0,180,240));
    _shapesArr.push( shape );

    //_timeToReset = millis() + random(2000,3000);
    _wantsControlAll = false;
    _timeToDoSomething = millis() + 1000;// + 5000;
    _timeToMoveShapes = millis() + 1000;

  };
  reset();


  this.update = function() {

    if ( _timeToReset && millis() > _timeToReset ) {
      _timeToReset = undefined;
      reset();
    }

    if ( !_somethingInProgress() && _timeToDoSomething && millis() > _timeToDoSomething ) {
      _timeToDoSomething = undefined;
      _doSomething().then(function() {
        _resumeAutoShapeBehaviour();
        _timeToDoSomething = millis() + random(7000,10000);
      });
    }

    if ( !_somethingInProgress() && _timeToMoveShapes && millis() > _timeToMoveShapes ) {
      _timeToMoveShapes = undefined;
      _moveShapes().then( function() {
        _resumeAutoShapeBehaviour();
        _timeToMoveShapes = millis() + random(10000,15000);
      });
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

  this.readyToAcceptCommandPromise = function() {
    var p = Promise.all([_path1.movementStoppedPromise(), _path2.movementStoppedPromise(), _twirlingCompletedPromise]);
    return p;
  };

  var _twirlingCompletedPromise;
  // this.isTwirlingOrAboutTo = function(){
  //   if ( _self.state === _self.states.WAITING_FOR_READY_TO_TWIRL 
  //     || _self.state === _self.states.TWIRLING_IN_PROGRESS ) {
  //     return true;
  //   }
  //   return false;
  // };

  this.twirl = function( twirlDuration, numTwirls, selfInitiated ) {

    console.log('twirl called');

    _self.state = _self.states.WAITING_FOR_READY_TO_TWIRL;
    _twirlingCompletedPromise = new Promise(function(resolve,error){
      Promise.all( [_path1.movementStoppedPromise(), _path2.movementStoppedPromise()] ).then( function() {
        _self.twirlCount = 0;
        if ( selfInitiated && _self.mgrWantsControl() ) {
          // abort
          _self.state = undefined;
          resolve();
          return;
        }
        _self.state = _self.states.TWIRLING_IN_PROGRESS;
        console.log('twirl started');
        // get path1 top and bottom and path2 top and bottom
        // tween path1 top/bottom x to exchange values with path2 top/bottom x (0.5 twirl)
        // and return to original value (1.0 twirl)
        var p1,p2;
        if ( true ) {

          var path1TopX = _path1.topX();
          var path1BottomX = _path1.bottomX();
          var path2TopX = _path2.topX();
          var path2BottomX = _path2.bottomX();
          p1 = _path1.setupTwirlOffsetTween( twirlDuration, numTwirls, {topX:path2TopX, bottomX:path2BottomX} );
          p2 = _path2.setupTwirlOffsetTween( twirlDuration, numTwirls, {topX:path1TopX, bottomX:path1BottomX} );

        } else {

          p1 = _path1.setupOffsetToZeroTween( twirlDuration );
          p2 = _path2.setupOffsetToZeroTween( twirlDuration );
          // p1 = _path1.setupTwirl2OffsetTween( twirlDuration, numTwirls, {xPoints:_path2.pathXPointsWithOffset()} );
          // p2 = _path2.setupTwirl2OffsetTween( twirlDuration, numTwirls, {xPoints:_path1.pathXPointsWithOffset()} );

        }
        return Promise.all( [p1,p2] ).then(function() {
          // twirl completed
          _self.state = undefined;
          resolve();
        });
      });
    });
    return _twirlingCompletedPromise;

  };

  this.moveShapeTo = function( x, moveDuration ) {
    _path1.moveMiddleTo( x, moveDuration );
    var promise = _path2.moveMiddleTo( x, moveDuration );
    return promise;
  }

  this.mgrWantsControl = function() {
    if ( _shapeMgr.wantsControl( _self ) ) {
      return true;
    }
    return false;
  };

  this.resetNextRandomTwirl = function() {
    _timeToTwirl = millis() + random(5000,10000);
  };
  this.restartRegularShapeMovement = function() {
    _self.resetNextRandomTwirl();
    _path1.restartRegularPathOffsetTweens();
    _path2.restartRegularPathOffsetTweens();
  };

  var _timeToTwirl;

  var reset = function() {
    _path1 = new Path( _self );
    _path2 = new Path( _self );
    _twirlingCompletedPromise = Promise.resolve();
    _timeToTwirl = millis() + 5000;
  };
  reset();


  this.update = function() {

    if ( _timeToTwirl !== undefined && millis() > _timeToTwirl ) {
      _timeToTwirl = undefined;
      if ( !_self.mgrWantsControl() ) {
        // twirl between 0.5 and 4.5 times
        console.log('self triggering twirl shape');
        _self.twirl(random(1000,2000),floor(random(1,10))/2, true ).then( function(){
          console.log('twirl completed');
          if ( !_self.mgrWantsControl() ) {
            _self.restartRegularShapeMovement();
          }
        });
      }
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
    _offset.offsetXPoints = [];
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
    //_clearOffsetXPoints();
  };

  // var _clearOffsetXPoints = function() {
  //   for (var i=0; i<_pathXPoints.length; i++) {
  //     _offset.offsetXPoints[i] = 0;
  //   }
  // };

  var _updatePathPoints = function() {
    var numPoints = _pathXPoints.length;
    for (var i=0; i<numPoints; i++) {
      var weightingBottomOffset = i/(numPoints-1);
      var weightingTopOffset = (numPoints-1-i)/(numPoints-1);
      _pathXPointsWithOffset[i] = _pathXPoints[i] + _offset.top * weightingTopOffset + _offset.bottom * weightingBottomOffset + _offset.middleXOffset;
      //_pathXPointsWithOffset[i] = _pathXPoints[i] + _offset.offsetXPoints[i]*_offset.pathLerpFactor + _offset.top * weightingTopOffset + _offset.bottom * weightingBottomOffset + _offset.middleXOffset;
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

  this.moveMiddleTo = function( xTo, moveDuration ) {
    _updatePathPoints();
    var minX;
    var maxX;
    for (var i=0; i<_pathXPointsWithOffset.length; i++) {
      var x = _pathXPointsWithOffset[i];
      if ( minX === undefined || x < minX ) {
        minX = x;
      }
      if ( maxX === undefined || x > maxX ) {
        maxX = x;
      }
    }
    var middleX = (minX + maxX)/2;
    var deltaX = xTo - middleX;
    return new Promise( function(resolve,error) {
      console.log('moving middle to = '+xTo);
      new TWEEN.Tween( _offset )
        .to({middleXOffset:_offset.middleXOffset+deltaX}, moveDuration)
        .easing( TWEEN.Easing.Quadratic.InOut )
        .onComplete( function() {
          console.log('moving middle to = '+xTo+' completed');
          resolve();
        })
        .start();
    });

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
        if ( _isOkToResetRegularPathOffsets() ) {
          window.setTimeout(function(){
            _countResetPathOffsets += 1;
            _resetPathOffsets();
          }, 0);
        }
      });
  }

  this.movementStoppedPromise = function() {
    return new Promise(function(resolve,error){
      _pathOffsetTweenPromise.then(function(){
        resolve();
      });
    });
  };

  // this is used when path offset tweens are completed to see if they should
  // auto-restart
  var _isOkToResetRegularPathOffsets = function(){
    if ( !shape.mgrWantsControl() && shape.state === undefined ) {
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
  this.pathXPointsWithOffset = function() {
    return _pathXPointsWithOffset;
  };
  this.setupTwirlOffsetTween = function( twirlDuration, numTwirls, offsetInfo ) {
    _updatePathPoints();
    var pOffsetTween = new Promise(function(resolve,error){
      var topSaved = _offset.top;
      var bottomSaved = _offset.bottom;
      var deltaTopX = offsetInfo.topX - _self.topX();
      var deltaBottomX = offsetInfo.bottomX - _self.bottomX();
      var tweenTo = new TWEEN.Tween(_offset)
        .to({top:_offset.top+deltaTopX, bottom:_offset.bottom+deltaBottomX}, twirlDuration)
        .easing(TWEEN.Easing.Circular.InOut)
        .onComplete( function(){
          //_updatePathPoints();
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
        tweenBack.chain( tweenTo );
      }
      tweenTo.start();
    });
    return pOffsetTween;
  };

  this.setupOffsetToZeroTween = function( twirlDuration ) {
    //_updatePathPoints();
    var pOffsetTween = new Promise(function(resolve,error){
      var tweenTo = new TWEEN.Tween(_offset)
        .to({top:0, bottom:0}, twirlDuration)
        .easing(TWEEN.Easing.Circular.InOut)
        .onComplete( function(){
            resolve();
        });
      tweenTo.start();
    });
    return pOffsetTween;
  };


  // this.setupTwirl2OffsetTween = function( twirlDuration, numTwirls, offsetInfo ) {
  //   _updatePathPoints();
  //   var pOffsetTween = new Promise(function(resolve,error){
  //     var deltaXPoints = [];
  //     var numXPoints = offsetInfo.xPoints.length;
  //     for ( var i=0; i<numXPoints; i++ ) {
  //       var deltaXPoint = offsetInfo.xPoints[i] - _pathXPointsWithOffset[i];
  //       _offset.offsetXPoints[i] = deltaXPoint;
  //     }
  //     var pathLerpFactorOriginal = _offset.pathLerpFactor;
  //     var pathLerpFactorTweenTo = (pathLerpFactorOriginal === 0) ? 1 : 0;
  //     //_offset.offsetXPoints = deltaXPoints;
  //     var tweenTo = new TWEEN.Tween(_offset)
  //       .to({pathLerpFactor:pathLerpFactorTweenTo}, twirlDuration)
  //       .easing(TWEEN.Easing.Circular.InOut)
  //       .onComplete( function(){
  //         shape.twirlCount += 0.5;
  //         if ( shape.twirlCount >= numTwirls ) {
  //           window.setTimeout(function(){
  //             tweenBack.stop();
  //             tweenTo.stop();
  //             resolve();
  //           },0);
  //         }
  //       });
  //     var tweenBack = new TWEEN.Tween(_offset)
  //       .to({pathLerpFactor:pathLerpFactorOriginal}, twirlDuration)
  //       .easing(TWEEN.Easing.Circular.InOut)
  //       .onComplete( function() {
  //         shape.twirlCount += 0.5;
  //         if ( numTwirls === undefined ) {
  //           resolve();
  //         }
  //         if ( shape.twirlCount >= numTwirls ) {
  //           window.setTimeout(function(){
  //             tweenBack.stop();
  //             tweenTo.stop();
  //             resolve();
  //           },0);
  //         }
  //       });
  //     tweenTo.chain( tweenBack );
  //     if ( numTwirls && numTwirls > 1 ) {
  //       tweenBack.chain( tweenTo );
  //     }
  //     tweenTo.start();
  //   });
  //   return pOffsetTween;
  // }



  this.restartRegularPathOffsetTweens = function() {
    _resetPathOffsets();
  };

  var _reset = function() {
    _offset = {top:0,bottom:0,pathLerpFactor:0};
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
