var debugMode = 0;

var displayMode;
var _shapeMgr;

// var testTweenObj = {_alpha:200};
// var testTweenOut = false;

// var testTweenObj2 = {x:0};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  background(120);

  displayMode = mode.SLOW_JITTER;
  _shapeMgr = new ShapeMgr( displayMode );

  // var tween = new TWEEN.Tween( testTweenObj );
  // tween.to({_alpha:0}, 2000);
  // tween.easing(TWEEN.Easing.Quadratic.InOut);
  // tween.onComplete(function() {
  //   console.log('test tween completed');
  //   testTweenOut = true;
  //   tween2.stop();
  // });
  // tween.onStop(function() {
  //   console.log('test tween stopped');
  // });
  // console.log('test tween STARTED');
  // tween.start();

  // var tween2 = new TWEEN.Tween( testTweenObj2 );
  // tween2.to({x:100}, 4000);
  // tween2.easing(TWEEN.Easing.Quadratic.InOut);
  // tween2.onComplete(function() {
  //   console.log('test tween2 completed');
  // });
  // tween2.onStop(function() {
  //   console.log('test tween2 stopped');
  // });
  // console.log('test tween2 STARTED');
  // tween2.start();


}

function draw() {
  background(120);

  TWEEN.update();

  _shapeMgr.update();
  _shapeMgr.draw();
}

function ShapeMgr( displayMode ) {

  var _self = this;

  var _boxes;
  var _numBoxes;

  var _boxesOutArr;

  var _displayMode = displayMode;
  this.getDisplayMode = function() {
    return _displayMode;
  };

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
    var r = constrain(red(colorPicked) + randomBrightnessOffset, 0, 255);
    var g = constrain(green(colorPicked) + randomBrightnessOffset, 0, 255);
    var b = constrain(blue(colorPicked) + randomBrightnessOffset, 0, 255);
    var alpha = 200;
    colorPicked = color(r,g,b, alpha);
    return colorPicked;
  };

  // var _colorArr = [];
  // _colorArr.push( 
  //   {from:color(255, alpha),to:color(190, alpha)}, 
  //   {from:color(0, alpha),to:color(40, alpha)}, 
  //   {from:color(80, alpha),to:color(110, alpha)}, 
  //   {from:color(190,150,0, alpha),to:color(220,200,50, alpha)}, 
  //   {from:color(0,100,200, alpha),to:color(50,200,250, alpha)} );
  // this.pickColor = function() {
  //   var colorInfo = _colorArr[floor(random(_colorArr.length))];
  //   var rTweak = random(1);
  //   return lerpColor( colorInfo.from, colorInfo.to, rTweak );
  // };

  var _resetColorsWhenZero = 5;
  var _waitingToReset = false;

  var reset = function() {

    _waitingToReset = false;
    TWEEN.removeAll();

    _resetColorsWhenZero -= 1;
    if ( _resetColorsWhenZero <= 0 ) {
      _resetColorsWhenZero = floor(random(1,3));
      _self.changeColorCombination();
    }

    _boxes = [];
    _boxesOutArr = [];
    _numBoxes = floor(random(10,30));
    for (var i=0; i<_numBoxes; i++) {
      var b = new Box( _self );
      // if ( random(10) < 5 ) {
      //   b.keepMoving();
      // } else if ( random(10) < 5 ) {
      //   b.keepChangingContents();
      // }
      _boxes.push( b );
    }

    window.setTimeout( function() {
      // before reset, check if we need to wait for
      // any transitioning boxes
      var transitioningBoxesArr = [];
      _boxes.forEach(function(b) {
        if ( b.popOutTransition ) {
          transitioningBoxesArr.push(b.popOutTransition);
        }
        if ( b.changeBoxAttrTransition ) {
          transitioningBoxesArr.push(b.changeBoxAttrTransition);
        }
      });
      if ( transitioningBoxesArr.length === 0 ) {
        reset();
      } else {
        _waitingToReset = true;
        console.log('waiting to reset');
        Promise.all( transitioningBoxesArr ).then(function(){
          console.log('ready to reset... random wait');
          window.setTimeout( function() {
            _waitingToReset = false;
            console.log('resetting the scene!!!!!');
            reset();
          }, random(1000,3000));
        });
      }
    }, random(5000,10000) );
    //}, random(5000,10000) );

  };

  reset();

  // this.boxPopOutCompleted = function( boxOut ) {
  //   _boxesOutArr.push( boxOut );
  // };

  // var popOut = function() {

  //   TWEEN.removeAll();

  //   var popOutArr = [];
  //   for (var i=0; i<_numBoxes; i++) {
  //     var b = _boxes[i];
  //     popOutArr.push( b.popOut() );
  //   }
  //   Promise.all(popOutArr).then(function(popOutResolveArr){
  //     reset();
  //   });
  // };

  this.reintroduceBoxIsOk = function( box ) {
    if ( !_waitingToReset ) {
      return true;
    }
    return false;
  }

  this.update = function() {
  
    for (var i=0; i<_numBoxes; i++) {
      var b = _boxes[i];
      b.update();
    }

  };

  this.draw = function() {
    
    for (var i=0; i<_numBoxes; i++) {
      var b = _boxes[i];
      b.draw();
    }

  };

  this.modeChange = function( displayMode ) {
    _displayMode = displayMode;
    for (var i=0; i<_numBoxes; i++) {
      var b = _boxes[i];
      b.setBoxDisplayMode( displayMode );
    }
  };

}

var BoxTypes = {
  NORMAL: 'normal'
};
var UPPER_LEFT = 0;
var UPPER_RIGHT = 1;
var LOWER_RIGHT = 2;
var LOWER_LEFT = 3;

function Box( shapeMgr ) {
  
  var _self = this;

  var _boxShapeMgr = shapeMgr;

  var _timeToPopOut = undefined;// random(1)<0.5 ? millis() + random(2000,20000) : undefined;
  var _timeToChangeBox = undefined;//random(1)<0.2 ? millis() + random(2000,5000) : undefined;
  var _isOut = false;

  var _pos = new p5.Vector();
  var _posOffset = new p5.Vector();

  var _points = [];
  for ( var i=0; i<4; i++ ) {
    _points.push( new p5.Vector() );
  }

  var _pointsOffset = [];
  for ( var i=0; i<4; i++ ) {
    _pointsOffset.push( new p5.Vector() );
  }

  var _attr = {}
  //_attr._aspectRatio;
  //_attr._scale;
  //_attr._angle;
  //_attr._alpha;

  // _scaleTransform is used to scale using the transform matrix
  this._scaleTransform = undefined;

  var _color;

  var _type;

  var _lastDisplayMode;
  this.setBoxDisplayMode = function( displayMode ) {
    if ( displayMode === mode.SLOW_JITTER ) {
      // start slow jitter
      _startSlowJitter();
    } else {
      if ( _lastDisplayMode === mode.SLOW_JITTER ) {
        // stop slow jitter
        _stopSlowJitter();
      }
    }
    _lastDisplayMode = displayMode;
  }

  var _slowJitterTweenArr = [];
  var _startSlowJitter = function() {
    for ( var i=0; i<4; i++ ) {
      var tween = new TWEEN.Tween(_pointsOffset[i]);
      _pickNewPointOffset( tween, _pointsOffset[i] );
      _slowJitterTweenArr.push( tween );
    }
  };
  var _stopSlowJitter = function() {
    _slowJitterTweenArr.forEach( function( tween ) {
      tween.stop();
    });
    _slowJitterTweenArr = [];
  };

  var _pickNewPointOffset = function( tween, point ) {
    var varianceLimit = _pointVarianceLimit * 2;
    var variancePercentOfBoxWidth = varianceLimit / _sizeWithScale.y;
    if ( variancePercentOfBoxWidth > 0.02 ) {
      varianceLimit = 0.02 * _sizeWithScale.y;
    }
    tween.to({x: randomGaussian(0,varianceLimit), y: randomGaussian(0,varianceLimit)}, random(500,1000) );
    tween.easing(TWEEN.Easing.Quadratic.InOut);
    tween.onComplete( function() {
      if ( !_isOut ) {
        _pickNewPointOffset( tween, point );
      }
    });
    //tween.delay(random(500,1000));
    tween.start();
  };

  this.popOutTransition = undefined;
  var _popOutTween = undefined;
  var _requestResetAt = undefined;
  this.popOut = function() {
    var p = new Promise(function(resolve,reject) {
      if ( _isOut ) {
        resolve();
        return;
      }
      //_self._scaleTransform = {x:1,y:1};
      _attr._alpha = _color.rgba[3];
      var tween = new TWEEN.Tween( _attr );
      tween.to({_alpha:0}, 2000);
      tween.easing(TWEEN.Easing.Quadratic.InOut);
      tween.onComplete(function() {
        console.log('box popout completed');
        _popOutTween = undefined;
        _isOut = true;
        //_stopAllBoxTweens();
        _requestResetAt = millis() + random(5000);
        resolve();
      });
      tween.onStop(function() {
        _popOutTween = undefined;
        resolve();
      });
      console.log('box popout STARTED');
      tween.start();
      _popOutTween = tween;
    });
    this.popOutTransition = p;
    return p;
  };

  this.changeBoxAttrTransition = undefined;
  var _changeBoxAttrTween = undefined;
  this.changeBoxAttr = function() {
    var p = new Promise(function(resolve,reject) {
      //_self._scaleTransform = {x:1,y:1};
      //var tween = new TWEEN.Tween( _self._scaleTransform );
      //tween.to({x:.5,y:.5}, 2000);
      var tween = new TWEEN.Tween( _attr );
      var startScale = _attr._scale;
      var endScale = _pickScaleTweenTo();
      tween.to({_scale:endScale}, 10000);
      // if ( _attr._scale <= 2 ) {
      //   tween.to({_scale:_attr._scale*2}, 10000);
      // } else {
      //   tween.to({_scale:_attr._scale/2}, 10000);
      // }
      tween.easing(TWEEN.Easing.Quadratic.InOut);
      tween.onComplete(function() {
        _changeBoxAttrTween = undefined;
        resolve();
      });
      tween.onStop(function() {
        _changeBoxAttrTween = undefined;
        resolve();
      });
      tween.start();
      _changeBoxAttrTween = tween;
    });
    this.changeBoxAttrTransition = p;
    return p;
  };

  // var alpha = 200;
  // var _colorArr = [];
  // _colorArr.push( 
  //   {from:color(255, alpha),to:color(190, alpha)}, 
  //   {from:color(0, alpha),to:color(40, alpha)}, 
  //   {from:color(80, alpha),to:color(110, alpha)}, 
  //   {from:color(190,150,0, alpha),to:color(220,200,50, alpha)}, 
  //   {from:color(0,100,200, alpha),to:color(50,200,250, alpha)} );

  var _pickColor = function( attr ) {
    if ( attr && attr.color !== undefined ) {
      _color = attr.color;
      return;
    }
    _color = _boxShapeMgr.pickColor();
    // var colorInfo = _colorArr[floor(random(_colorArr.length))];
    // var rTweak = random(1);
    // _color = lerpColor( colorInfo.from, colorInfo.to, rTweak );
  };

  var _scaleArr = [1,2,4,8];
  var _pickScale = function( attr ) {
    if ( attr && attr.scale !== undefined ) {
      _attr._scale = attr.scale;
      return;
    }
    _attr._scale = _scaleArr[floor(random(_scaleArr.length))];
  };
  var _pickScaleTweenTo = function() {
    var currentScale = _attr._scale;
    var newScale = undefined;
    while ( newScale === undefined || newScale === currentScale ) {
      newScale = _scaleArr[floor(random(_scaleArr.length))]
    }
    return newScale;
  };

  var _pickAspectRatio = function( attr ) {
    if ( attr && attr.aspectRatio !== undefined ) {
      _attr._aspectRatio = attr.aspectRatio;
      return;
    }
    _attr._aspectRatio = random(1,2);
  };

  var _sizeBasis = width/20;
  var _sizeWithScale = new p5.Vector();
  var _updateSize = function() {
    _sizeWithScale.set( _sizeBasis * _attr._aspectRatio * _attr._scale, _sizeBasis * _attr._scale );
  }

  var _pointVarianceLimit = 2;
  
  var _resetPointOffsetZero = function() {
    _pointsOffset[UPPER_LEFT].set( 0,0 );
    _pointsOffset[UPPER_RIGHT].set( 0,0 );
    _pointsOffset[LOWER_RIGHT].set( 0,0 );
    _pointsOffset[LOWER_LEFT].set( 0,0 );
  };

  var _resetPointOffsetRandom = function( attr ) {
    var varianceLimit = _pointVarianceLimit;
    if ( attr && attr.pointOffsetLimit !== undefined ) {
      varianceLimit = attr.pointOffsetLimit;
    }
    // _pointsOffset[UPPER_LEFT].set( random(-varianceLimit,varianceLimit) , random(-varianceLimit,varianceLimit) );
    // _pointsOffset[UPPER_RIGHT].set( random(-varianceLimit,varianceLimit) , random(-varianceLimit,varianceLimit) );
    // _pointsOffset[LOWER_RIGHT].set( random(-varianceLimit,varianceLimit) , random(-varianceLimit,varianceLimit) );
    // _pointsOffset[LOWER_LEFT].set( random(-varianceLimit,varianceLimit) , random(-varianceLimit,varianceLimit) );
    _pointsOffset[UPPER_LEFT].set( randomGaussian(0,varianceLimit) , randomGaussian(0,varianceLimit) );
    _pointsOffset[UPPER_RIGHT].set( randomGaussian(0,varianceLimit) , randomGaussian(0,varianceLimit) );
    _pointsOffset[LOWER_RIGHT].set( randomGaussian(0,varianceLimit) , randomGaussian(0,varianceLimit) );
    _pointsOffset[LOWER_LEFT].set( randomGaussian(0,varianceLimit) , randomGaussian(0,varianceLimit) );
  };

  var _pickPosition = function( attr ) {
    if ( attr && attr.pos.x !== undefined ) {
      _pos.x = attr.pos.x;
    } else {
      _pos.x = random(0.1*width,0.9*width);
    }
    if ( attr && attr.pos.y !== undefined ) {
      _pos.y = attr.pos.y;
    } else {
      _pos.y = random(0.1*height,0.9*height);
    }
  };

  var _resetPositionOffset = function( attr ) {
    if ( attr && attr.posOffset.x !== undefined ) {
      _posOffset.x = attr.posOffset.x;
    } else {
      _posOffset.x = 0;
    }
    if ( attr && attr.posOffset.y !== undefined ) {
      _posOffset.y = attr.posOffset.y;
    } else {
      _posOffset.y = 0;
    }
  };

  var _posOffsetVarianceLimit = 0.5; //fraction of the size
  var _resetPositionOffsetRandom = function( attr ) {
    if ( attr && attr.posOffset.x !== undefined ) {
      _posOffset.x = random( -attr.posOffset.x, attr.posOffset.x );
    } else {
      //_posOffset.x = random( -_posOffsetVarianceLimit*_sizeWithScale.x, _posOffsetVarianceLimit*_sizeWithScale.x );
      _posOffset.x = randomGaussian( 0, _posOffsetVarianceLimit*_sizeWithScale.x );
    }
    if ( attr && attr.posOffset.y !== undefined ) {
      _posOffset.y = random( -attr.posOffset.y, attr.posOffset.y );
    } else {
      //_posOffset.y = random( -_posOffsetVarianceLimit*_sizeWithScale.y, _posOffsetVarianceLimit*_sizeWithScale.y );
      _posOffset.y = randomGaussian( 0, _posOffsetVarianceLimit*_sizeWithScale.y )
    }
  };

  var _posOffsetTween = undefined;
  var _pickNewPositionOffset = function() {
    var tween = new TWEEN.Tween(_posOffset);
    // var tweenDurationMin = _attr._scale * 1000;
    // var tweenDurationMax = ( _attr._scale * 2 ) * 1000;
    var tweenDuration = random(3000,5000);
    if ( random(10) < 5 ) {
      tween.to({x: random( -_posOffsetVarianceLimit*_sizeWithScale.x, _posOffsetVarianceLimit*_sizeWithScale.x )}, tweenDuration );
    } else {
      tween.to({y: random( -_posOffsetVarianceLimit*_sizeWithScale.y, _posOffsetVarianceLimit*_sizeWithScale.y )}, tweenDuration );
    }
    tween.easing(TWEEN.Easing.Back.InOut);
    tween.onComplete( function() {
      _posOffsetTween = undefined;
      if ( !_isOut ) {
        _pickNewPositionOffset();
      }
    });
    tween.onStop( function() {
      _posOffsetTween = undefined;
    });
    tween.delay(random(1000,5000));
    tween.start();
    _posOffsetTween = tween;
  };

  this.keepMoving = function() {
    _pickNewPositionOffset();
  };

  var _content;
  var _contentMode;
  var _changeContentTween;
  var _changeContent = function() {
    _content.lineX = undefined;
    _content.lineY = undefined;
    if ( _contentMode === 0 ) {
      _content.lineX = 0;
    } else {
      _content.lineY = 0;
    }
    var tween = new TWEEN.Tween(_content);
    if ( _contentMode == 0 ) {
      tween.to({lineX: _sizeWithScale.x - _sizeWithScale.x/10}, random(1000,2000));
    } else {
      tween.to({lineY: _sizeWithScale.y - _sizeWithScale.y/10}, random(1000,2000));
    }
    tween.onComplete( function() {
      if ( !_isOut ) {
        _changeContent();
      }
    });
    tween.easing(TWEEN.Easing.Sinusoidal.Out);
    tween.delay(random(1000));
    tween.start();
    _changeContentTween = tween;
  };

  this.keepChangingContents = function() {
    _content = {};
    _contentMode = random(10) < 5 ? 0: 1;
    _changeContent();
  };
  var _isChangingContent = function() {
    if ( _content ) return true;
    return false;
  }

  var _stopAllBoxTweens = function() {
    _stopSlowJitter();
    if ( _posOffsetTween ) {
      _posOffsetTween.stop();
    }
    if ( _changeBoxAttrTween ) {
      _changeBoxAttrTween.stop();
    }
    if ( _changeContentTween ) {
      _changeContentTween.stop();
    }
  };

  this.reintroduceBox = function() {
    this.reset();
    _attr._alpha = 0;
    var tween = new TWEEN.Tween(_attr);
    tween.to({_alpha:_color.rgba[3]},2000);
    tween.easing(TWEEN.Easing.Quadratic.InOut);
    tween.start();
  };

  this.reset = function( attr ) {
    // make sure there are no active tweens
    _stopAllBoxTweens();

    _isOut = false;

    _requestResetAt = undefined;
    _timeToPopOut = random(1)<0.5 ? millis() + random(2000,20000) : undefined;
    //_timeToPopOut = random(1)<1 ? millis() + random(2000,2000) : undefined;
    _timeToChangeBox = random(1)<0.2 ? millis() + random(2000,20000) : undefined;

    _type = BoxTypes.NORMAL;
    _pickPosition( attr );
    _attr._alpha = undefined; // use default color alpha
    if ( attr && attr._alpha !== undefined ) {

    }
    _pickScale( attr );
    _pickAspectRatio( attr );
    _updateSize();
    _resetPositionOffset( attr );
    _resetPointOffsetRandom( attr );
    _self.setBoxDisplayMode( shapeMgr.getDisplayMode() );
    _pickColor( attr );
    _angle = 0;

    _content = undefined;

    //this.keepChangingContents();

    if ( random(10) < 5 ) {
      this.keepMoving();
    } else if ( random(10) < 5 ) {
      this.keepChangingContents();
    }

  };
  this.reset();

  var _updatePositionOffsetRandom = function() {
    _resetPositionOffsetRandom();
  };
  
  var _updatePointOffsetRandom = function() {
    _resetPointOffsetRandom();
  };

  var _updatePos = function() {
    //_pos.x = randomGaussian(0,10);
  };

  var _updateRotation = function() {

  };

  var _updateScale = function() {

  };

  var _updatePoints = function() {
    var sizeWidthHalf = _sizeWithScale.x / 2;
    var sizeHeightHalf = _sizeWithScale.y / 2;
    _points[UPPER_LEFT].set( -sizeWidthHalf, -sizeHeightHalf).add( _pointsOffset[UPPER_LEFT] );
    _points[UPPER_RIGHT].set( sizeWidthHalf, -sizeHeightHalf).add( _pointsOffset[UPPER_RIGHT] );
    _points[LOWER_RIGHT].set( sizeWidthHalf, sizeHeightHalf).add( _pointsOffset[LOWER_RIGHT] );
    _points[LOWER_LEFT].set( -sizeWidthHalf, sizeHeightHalf).add( _pointsOffset[LOWER_LEFT] );

  };

  this.update = function() {
    if ( _isOut ) {
      var didReintroduceBox = false;
      if ( millis() > _requestResetAt ) {
        _requestResetAt = undefined;
        if ( _boxShapeMgr.reintroduceBoxIsOk() ) {
          this.reintroduceBox();
          didReintroduceBox = true;
        } else {
          _requestResetAt = millis() + random(5000);
        }
      }
      if ( !didReintroduceBox ) {
        return;
      }
    }
    _updatePos();
    _updateRotation();
    _updateScale();
    _updateSize();
    //_updatePositionOffsetRandom();
    if ( _lastDisplayMode === mode.NORMAL ) {
      _updatePointOffsetRandom();
    }
    _updatePoints();
    if ( _timeToChangeBox !== undefined ) {
      if ( millis() > _timeToChangeBox ) {
        _timeToChangeBox = undefined;
        this.changeBoxAttr();
      }
    }
    if ( _timeToPopOut !== undefined ) {
      if ( millis() > _timeToPopOut ) {
        _timeToPopOut = undefined;
        console.log('calling popOut');
        this.popOut();
      }
    }
  };

  this.draw = function() {
    if ( _isOut ) {
      return;
    }
    push();
    if ( _attr._alpha !== undefined ) {
      _color.rgba[3] = floor(_attr._alpha);
    }
    fill( _color.rgba );
    noStroke();
    rotate( _angle );
    translate( _pos.x + _posOffset.x, _pos.y + _posOffset.y );
    if ( _self._scaleTransform !== undefined ) {
      scale(_self._scaleTransform.x, _self._scaleTransform.y);
    }
    quad( _points[UPPER_LEFT].x, _points[UPPER_LEFT].y,
      _points[UPPER_RIGHT].x, _points[UPPER_RIGHT].y,
      _points[LOWER_RIGHT].x, _points[LOWER_RIGHT].y,
      _points[LOWER_LEFT].x, _points[LOWER_LEFT].y );
    if ( _isChangingContent() ) {
      fill(255,random(5));
      if ( _content.lineX !== undefined ) {
        rect( _points[UPPER_LEFT].x + _content.lineX, _points[UPPER_LEFT].y, _sizeWithScale.x/10, _sizeWithScale.y );
      } else {
        rect( _points[UPPER_LEFT].x, _points[UPPER_LEFT].y + _content.lineY, _sizeWithScale.x, _sizeWithScale.y/10 );
      }
    }
    pop();
  }

}

// --
var mode = {
  NORMAL: 0,
  STILL: 1,
  SLOW_JITTER: 2
};
var modeArr = [ mode.NORMAL, mode.STILL, mode.SLOW_JITTER ];
function mouseClicked() {
  displayMode += 1;
  if ( displayMode >= modeArr.length ) {
    displayMode = 0;
  }
  _shapeMgr.modeChange( displayMode );
  // var event = new Event('displayModeChange', {displayMode: displayMode});

}

