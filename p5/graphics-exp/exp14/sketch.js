var debugMode = 0;

var displayMode;
var _shapeMgr;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  background(120);

  displayMode = mode.SLOW_JITTER;
  _shapeMgr = new ShapeMgr( displayMode );

}

function draw() {
  background(120);
  //background(50,80,120);

  TWEEN.update();

  _shapeMgr.update();
  _shapeMgr.draw();
}

function ShapeMgr( displayMode ) {

  var _self = this;

  var _boxes;
  var _numBoxes;

  var _displayMode = displayMode;
  this.getDisplayMode = function() {
    return _displayMode;
  };

  var alpha = 200;
  var _colorArr = [];
  _colorArr.push( 
    {from:color(255, alpha),to:color(190, alpha)}, 
    {from:color(0, alpha),to:color(40, alpha)}, 
    {from:color(80, alpha),to:color(110, alpha)}, 
    {from:color(190,150,0, alpha),to:color(220,200,50, alpha)}, 
    {from:color(0,100,200, alpha),to:color(50,200,250, alpha)} );
  this.pickColor = function() {
    var colorInfo = _colorArr[floor(random(_colorArr.length))];
    var rTweak = random(1);
    return lerpColor( colorInfo.from, colorInfo.to, rTweak );
  };


  var reset = function() {

    TWEEN.removeAll();

    _boxes = [];
    _numBoxes = floor(random(10,30));
    for (var i=0; i<_numBoxes; i++) {
      var b = new Box( _self );
      if ( random(10) < 5 ) {
        b.keepMoving();
      } else if ( random(10) < 5 ) {
        b.keepChangingContents();
      }
      _boxes.push( b );
    }

    window.setTimeout( function() {
      reset();
    }, random(2000,10000) );

  };

  reset();

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

  var _aspectRatio;
  var _scale;
  var _angle;

  var _color;

  var _type;

  var _lastDisplayMode;
  this.setBoxDisplayMode = function( displayMode ) {
    if ( displayMode === mode.SLOW_JITTER ) {
      // start slow jitter
      startSlowJitter();
    } else {
      if ( _lastDisplayMode === mode.SLOW_JITTER ) {
        // stop slow jitter
        stopSlowJitter();
      }
    }
    _lastDisplayMode = displayMode;
  }

  var _slowJitterTweenArr = [];
  var startSlowJitter = function() {
    for ( var i=0; i<4; i++ ) {
      var tween = new TWEEN.Tween(_pointsOffset[i]);
      _pickNewPointOffset( tween, _pointsOffset[i] );
      _slowJitterTweenArr.push( tween );
    }
  };
  var stopSlowJitter = function() {
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
      _pickNewPointOffset( tween, point );
    });
    //tween.delay(random(500,1000));
    tween.start();
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
      _scale = attr.scale;
      return;
    }
    _scale = _scaleArr[floor(random(_scaleArr.length))];
  };

  var _pickAspectRatio = function( attr ) {
    if ( attr && attr.aspectRatio !== undefined ) {
      _aspectRatio = attr.aspectRatio;
      return;
    }
    _aspectRatio = random(1,2);
  };

  var _sizeBasis = width/20;
  var _sizeWithScale = new p5.Vector();
  var _updateSize = function() {
    _sizeWithScale.set( _sizeBasis * _aspectRatio * _scale, _sizeBasis * _scale );
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

  var _pickNewPositionOffset = function() {
    var tween = new TWEEN.Tween(_posOffset);
    if ( random(10) < 5 ) {
      tween.to({x: random( -_posOffsetVarianceLimit*_sizeWithScale.x, _posOffsetVarianceLimit*_sizeWithScale.x )}, random(1000,3000) );
    } else {
      tween.to({y: random( -_posOffsetVarianceLimit*_sizeWithScale.y, _posOffsetVarianceLimit*_sizeWithScale.y )}, random(1000,3000));
    }
    tween.easing(TWEEN.Easing.Back.InOut);
    tween.onComplete( function() {
      _pickNewPositionOffset();
    });
    tween.delay(random(1000,5000));
    tween.start();
  };

  this.keepMoving = function() {
    _pickNewPositionOffset();
  };

  var _content;
  var _contentMode;
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
      _changeContent();
    });
    tween.easing(TWEEN.Easing.Sinusoidal.Out);
    tween.delay(random(1000));
    tween.start();

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

  this.reset = function( attr ) {
    _type = BoxTypes.NORMAL;
    _pickPosition( attr );
    _pickScale( attr );
    _pickAspectRatio( attr );
    _updateSize();
    _resetPositionOffset( attr );
    _resetPointOffsetRandom( attr );
    _self.setBoxDisplayMode( shapeMgr.getDisplayMode() );
    _pickColor( attr );
    _angle = 0;
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
    _updatePos();
    _updateRotation();
    _updateScale();
    _updateSize();
    //_updatePositionOffsetRandom();
    if ( _lastDisplayMode === mode.NORMAL ) {
      _updatePointOffsetRandom();
    }
    _updatePoints();
  };

  this.draw = function() {
    push();
    fill( _color );
    noStroke();
    rotate( _angle );
    translate( _pos.x + _posOffset.x, _pos.y + _posOffset.y );
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
    rect();
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

