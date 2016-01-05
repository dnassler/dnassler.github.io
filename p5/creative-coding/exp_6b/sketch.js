var cm;
var pm;
var tm;
var wm;
var cam;


var ColorMgr = function() {
  var _colorIndex = 0;
  var _fromColor = color(50,100,250);
  var _toColor = color(150,150,100);
  var _lastColor;

  this.getNewColor = function( colorIndex ) {
    _colorIndex = colorIndex !== undefined ? colorIndex : random(0,1);
    _lastColor = lerpColor(_fromColor,_toColor,_colorIndex);
    return _lastColor;
  };

};


var PositionMgr = function() {

  var _gridRows;
  var maxRows = 10;
  var maxCols = 10;

  var _init = function() {
    _gridRows = [];
    var i;
    for ( i=0; i<maxRows; i++ ) {
      _gridRows.push( [] );
    }
  };
  _init();

  this.getGridWidth = function() {
    return maxCols * 30*4;
  };

  this.translateToThingPos = function( thing ) {
    var gridPoint = thing.getGridPoint();
    translate(gridPoint.col * 30*4, 0, gridPoint.row * 30 * 4);
  };

  this.translateToThingBoundaryWall = function( zLocationType, xLocationType ) {
    // zLocationType: -1 = far side,  1 = near side, 0/undefined = neither
    // xLocationType: -1 = left side, 1 = right side, 0/undefined = neither
    var leftWallCenter = {col: -3, row: maxRows/2.0};
    var rightWallCenter = {col: maxCols+2, row: maxRows/2.0};
    var farWallCenter = {col: maxCols/2.0, row: -3};
    var nearWallCenter = {col: maxCols/2.0, row: maxRows+2};

    var wallLocation;
    if ( zLocationType === -1 ) {
      wallLocation = farWallCenter;
      translate(wallLocation.col * 30*4, 0, wallLocation.row * 30*4);
    } else if ( zLocationType === 1 ) {
      wallLocation = nearWallCenter;
      translate(wallLocation.col * 30*4, 0, wallLocation.row * 30*4);
    } else if ( xLocationType === -1 ) {
      wallLocation = leftWallCenter;
      translate(wallLocation.col * 30*4, 0, wallLocation.row * 30*4);
      rotateY(-HALF_PI);
    } else if ( xLocationType === 1 ) {
      wallLocation = rightWallCenter;
      translate(wallLocation.col * 30*4, 0, wallLocation.row * 30*4);
      rotateY(HALF_PI);
    }

  };

  this.reservePos = function( pos, thing ) {
    //var pos = thing.getGridPoint();
    _gridRows[pos.row][pos.col] = thing;
  };

  this.reset = function() {
    _init();
  };

  // accepts input col and row as a starting point
  this.getFreePosition = function( i, j ) {
    var r;
    var limitToColumn = false;
    var limitToRow = false;
    if ( i && j ) {
      r = j * maxCols + i;
    } else if ( i ) {
      limitToColumn = true;
      r = floor(random(maxRows)) * maxCols + i;
    } else if ( j ) {
      limitToRow = true;
      r = j * maxCols + floor(random(maxCols));
    } else {
      r = floor(random(maxRows*maxCols));
    }
    var roffset = 0;
    var maxIndex = maxRows * maxCols;
    var maxOffset = maxIndex;
    while ( roffset < maxOffset ) {
      var rIndex = (r + roffset) % maxIndex;
      var rowIndex = floor(rIndex / maxCols);
      var colIndex = rIndex % maxCols;
      var row = _gridRows[ rowIndex ];
      var gridElement = row[colIndex];
      if ( !gridElement ) {
        var pos = {row:rowIndex, col:colIndex};
        return pos;
      }
      if ( limitToColumn ) {
        // check next row since input specified column
        roffset += maxCols;
      } else if ( limitToRow ) {
        roffset += 1;
        if ( floor((r + roffset) / maxCols) > j ) {
          // fell off the end of the row
          roffset += (maxOffset - (r % maxCols));
        }
      } else {
        roffset += 1;
      }
    }
    return null;
  };

};

var Thing = function() {
  var _self = this;
  var _color;
  var _pos;
  var _size;
  var _offsetHeight;
  var _lastOffsetHeight;
  var _showLight;
  var _angleX;
  var _angleZ;
  var _spinRateX;
  var _spinRateZ;

  var _randomShowLight = function() {
    _showLight = floor(random(2)) >= 1 ? true : false;
  };

  var _init = function() {
    _color = cm.getNewColor();
    _randomShowLight();
    _pos = pm.getFreePosition();
    pm.reservePos( _pos, _self );
    _size = {w:random(0.5,2), h:floor(random(1,3))};
    _angleX = 0;
    _angleZ = 0;
    _spinRateX = 0;//random(-0.01,0.01);
    _spinRateZ = 0;//random(-0.01,0.01);
  };
  _init();

  this.randomShowLight = _randomShowLight;

  this.getGridPoint = function() {
    return _pos;
  };

  this.update = function() {
    _lastOffsetHeight = _offsetHeight;
    var waveIndex = tm.getWaveIndex();

    var tmPattern = tm.getPattern();
    if ( tmPattern === ThingsPattern.SINE_WAVE ) {

      _offsetHeight = 10 * (1+(sin((waveIndex+_pos.row*8+_pos.col*8)*tm.getWaveFreqFactor())));

    } else if ( tmPattern === ThingsPattern.NOISE_WAVE ) {

      _offsetHeight = 10 * ((noise((waveIndex+_pos.row*8+_pos.col*8)*tm.getWaveFreqFactor()))*4-1);

    }

    if ( _lastOffsetHeight === undefined ) {
      _lastOffsetHeight = _offsetHeight;
    }
    _angleX += _spinRateX;
    _angleZ += _spinRateZ;
    if ( abs(_angleX ) > TWO_PI ) {
      _spinRateX = 0;
    }
    if ( abs(_angleZ ) > TWO_PI ) {
      _spinRateZ = 0;
    }
    //console.log('thing.update tm.getWaveFreqFactor()='+tm.getWaveFreqFactor());

  };

  var _showBoxes = true;

  this.draw = function(alpha) {
    push();
    //translate(i*30*4,j*30*4,0);
    pm.translateToThingPos( _self );

    var c = color(red(_color)*alpha,green(_color)*alpha,blue(_color)*alpha);
    //ambientMaterial(c);

    //ambientMaterial(b0+random(-100,100),random(100,120),random(200,220));
    //specularMaterial(b0+random(-100,100),random(100,120),random(200,220));

    //translate( 0, -30*(_size.h + _offsetHeight - 1), 0 );
    var h = 30 * (_size.h + _offsetHeight);
    //translate( 0, h, 0 );
    // box( 60, 60, 30 );
    //box( 30 * _size.w, h, 30 * _size.w);

    translate( 0, -h*2, 0 );
    // if ( _showLight ) {
    //   basicMaterial(_color);
    // }
    rotateX(_angleX);
    rotateZ(_angleZ);

    if ( _showBoxes ) {

      if ( _lastOffsetHeight < _offsetHeight ) {
        ambientMaterial(c);
      } else {
        ambientMaterial(160*alpha,30*alpha,20*alpha);
        //basicMaterial(160,30,20);
      }
      box( 30 * _size.w, 10, 30 * _size.w );

    } else {

      basicMaterial(255); // not sure if material does much with the color when a texture is used
      texture(tm.getPGImg());
      plane( 30 * _size.w, 30 * _size.w );

    }


    pop();

  };

};

var Ripple = function( g, r, rMax, rInc, repeat, rx, ry, delay, rippleWeight, rippleColor, fadeOut ) {

  var _self = this;

  var _r = r;
  var _rInc = rInc;
  var _repeat = repeat;
  this.kill = false;

  var _g = g; // graphics
  var _gWidth = _g.width;
  var _gHeight = _g.height;
  var _maxR = rMax ? rMax : _g.width * 1.5;
  var _rx = rx === undefined ? _gWidth/2.0 : rx;
  var _ry = ry === undefined ? _gHeight/2.0 : ry;
  var _rippleWeight = rippleWeight === undefined ? 5 : rippleWeight;
  var _rippleColor = rippleColor === undefined ? color(0,0,255) : rippleColor;
  var _fadeOut = fadeOut ? fadeOut : false;
  var _alpha = 1;

  var _started = !delay ? true : false;
  var _timeToStart = millis() + delay;
  var _isStopping = false;
  var _stoppedResolvePromise;
  var _timeToKillMe;

  var _stopRipple = function(maxDuration){
    _isStopping = true;
    return new Promise(function(resolve,reject){
      _stoppedResolvePromise = resolve;
      _timeToKillMe = millis() + (maxDuration === undefined ? 20000 : maxDuration);
    });
  };
  this.stopRipple = _stopRipple;

  var _killMe = function() {
    // make sure that this function gets called by any code that wants to
    // kill/stop this ripple otherwise any Promise waiting for stop resolve will
    // not get called
    _self.kill = true;
    if ( _stoppedResolvePromise ) {
      // the following call resolves the promise created when _stopRipple was called
      _stoppedResolvePromise();
    }
  };
  this.killMe = _killMe;

  this.update = function() {
    if ( !_started ) {
      if ( _isStopping ) {
        _killMe();
        return;
      }
      if ( millis() < _timeToStart ) {
        return;
      }
      _started = true;
    }
    if ( _timeToKillMe && millis() > _timeToKillMe ) {
      _killMe();
      return;
    }

    _r += _rInc;

    _alpha = _r <= _maxR/2 ? 1.0 : (1 - ((_r - _maxR/2)*2)/_maxR);

    if ( _r >= _maxR ) {
      if ( _repeat && !_isStopping ) {
        _r = 0;
      } else {
        _killMe();
      }
    }
  };
  this.drawToGraphics = function() {
    if ( !_started ) {
      return;
    }
    if ( _r > 0 ) {
      _g.push();

      var rc = _rippleColor;
      if ( _fadeOut ) {
        rc = color(red(_rippleColor),green(_rippleColor),blue(_rippleColor),floor(_alpha*255));
      }
      _g.stroke(rc);
      _g.noFill();
      _g.translate(_rx, _ry);
      _g.strokeWeight(_rippleWeight);
      _g.ellipse(0,0,_r,_r);

      _g.pop();
    }
  };
};

var Spot = function(g, size, rx, ry, delay, duration) {

  var _self = this;
  this.kill = false;

  var _g = g;
  var _rx = rx ? rx : random(_g.width);
  var _ry = ry ? ry : random(_g.height);
  var _attr = {size:0, alpha:0};
  var _maxSize = size;

  createjs.Tween.get(_attr)
    .wait(delay)
    .to({size:_maxSize,alpha:1}, duration, createjs.Ease.cubicIn)
    .to({size:0,alpha:0}, duration, createjs.Ease.cubicOut)
    .call(function(){
      _self.kill = true;
    });

  this.update = function() {

  };

  this.drawToGraphics = function() {
    //console.log(_attr.size);
    _g.push();
    _g.noStroke();
    _g.fill(255, floor(_attr.alpha * 255));
    _g.ellipse(_rx,_ry,_attr.size,_attr.size);
    // _g.fill(255,255);
    // _g.ellipse(_rx,_ry,10,10);
    _g.pop();
  };
};

var WallType = {
  RIPPLES: 'ripples'
};

var Wall = function(sideInfo, type, rippleSpeed) {

  var _self = this;
  var _wallThingArr = [];

  var _sideInfo = sideInfo;
  var _wallType = !type ? WallType.RIPPLES : type;
  var _rippleSpeed = !rippleSpeed ? 0.25 : rippleSpeed;

  var _textureGraphics;
  var _textureImage;

  var _gWidth = 100;
  var _gHeight = 100;
  var _wallWidth = 500;
  var _wallHeight = 500;

  var _timeNextRandomRipple;
  var _isStopped;
  var _isStopping;

  var _timeForNextUnsheildedBeam;

  this.getIsStopped = function(){
    return _isStopped;
  }

  var _startRipples = function() {
    return Promise.resolve().then(function(){
      _wallThingArr.push(new Ripple(_textureGraphics, 0, null, rippleSpeed, true));
      _wallThingArr.push(new Ripple(_textureGraphics, -_gWidth/1.5, null, rippleSpeed, true));
      _timeNextRandomRipple = millis() + random(5000);
      _isStopped = false;
    }).then(function(){
      return sceneMgr.wait(5000);
    });
  };
  this.startRipples = _startRipples;

  var _init = function(){
    _textureGraphics = createGraphics( _gWidth, _gHeight );
    _textureImage = createImage( _gWidth, _gHeight );
    _startRipples();
  };
  _init();

  // var _reinit = function(){
  //
  // };
  // this.reinit = _reinit();

  var _newBeam = function(sizeIn, delayIn, durationIn) {
    var size = sizeIn !== null && sizeIn !== undefined ? sizeIn : random(2,10);
    var delay = delayIn !== null && delayIn !== undefined ? delayIn : random(1000);
    var duration = durationIn !== null && durationIn !== undefined ? durationIn : 500 + ((size-5)/5)*400;
    var rx = random(_gWidth);
    var ry = random(_gHeight);
    _wallThingArr.push(new Spot(_textureGraphics, size, rx, ry, delay, duration));
    _wallThingArr.push(new Ripple(_textureGraphics, 0, _gWidth/2, rippleSpeed*4, false, rx, ry, delay+duration/2, 0.5, color(255), true));
  };
  this.newBeam = _newBeam;

  var _newRandomRipple = function() {
    _wallThingArr.push(new Ripple(_textureGraphics, 0, null, rippleSpeed*2, false, random(_gWidth), random(_gHeight), 0, 1));
  };

  var _stopRipples = function() {
    //_isStopped = true;
    _isStopping = true;
    var pArr = [];
    _wallThingArr.forEach(function(element){
      // if the element might not be a Ripple
      if ( element.stopRipple ) {
        pArr.push( element.stopRipple() );
      }
    });
    return Promise.all(pArr).then(function(){
      _isStopping = false;
      _isStopped = true;
      _timeForNextUnsheildedBeam = millis();
    });
  };

  this.stopRipples = _stopRipples;

  this.update = function() {
    if ( !_isStopped && millis() > _timeNextRandomRipple ) {
      _timeNextRandomRipple = millis() + random(5000);
      _newRandomRipple();
    }
    if ( _isStopped && millis() > _timeForNextUnsheildedBeam ) {
      _timeForNextUnsheildedBeam = millis() + random(100,200);
      _newBeam();
    }
    _textureGraphics.push();

    _textureGraphics.background(0);

    var killArr = [];
    _wallThingArr.forEach(function(element){
      element.update();
      if ( element.kill ) {
        killArr.push( element );
        return;
      }
      element.drawToGraphics();
    });
    if ( killArr.length > 0 ) {
      killArr.forEach(function(element){
        _wallThingArr.splice(_wallThingArr.indexOf(element),1);
      });
    }

    _textureImage.copy(_textureGraphics._renderer,0,0,_gWidth,_gHeight,0,0,_gWidth,_gHeight);

    _textureGraphics.pop();
  };

  this.draw = function() {

    push();

    pm.translateToThingBoundaryWall( _sideInfo.z, _sideInfo.x );

    var maxOffset = 10;
    var h = 30 * (6 + maxOffset/2.0);
    translate( 0, -h*2, 0 );

    basicMaterial(255);
    texture(_textureImage);
    plane(_wallWidth,_wallHeight);

    pop();

  };

};

var WallMgr = function() {

  var _self = this;
  var _wallArr = [];

  var _timeNextBeam;
  var _timeNextBeamPerWall = [];

  var _init = function(){
    _wallArr.push(new Wall({z:1,x:0}, WallType.RIPPLES, 0.25));
    _wallArr.push(new Wall({z:-1,x:0}, WallType.RIPPLES, 0.23));
    _wallArr.push(new Wall({z:0,x:1}, WallType.RIPPLES, 0.19));
    _wallArr.push(new Wall({z:0,x:-1}, WallType.RIPPLES, 0.19));
    _timeNextBeam = millis() + random(5000);
  };
  _init();

  var _stoppedWalls = function(){
    return _wallArr.filter(function(element){
      if ( element.getIsStopped() ) {
        return true;
      }
    });
  };
  this.stoppedWalls = _stoppedWalls;

  var _fireInvisibleBeam = function(wall0In) {
    var rIndex0 = -1;// = floor(random(_wallArr.length));
    if ( wall0In ) {
      rIndex0 = _wallArr.indexOf(wall0In);
      if ( rIndex0 === -1 ) {
        return;
      }
    }
    rIndex0 = rIndex0 == -1 ? floor(random(_wallArr.length)) : rIndex0;
    var rIndex1;
    // assuming that there are 4 walls, find another wall.
    var loopCount = 0;
    while ( (rIndex1 === undefined) && loopCount < 2 ) {
      rIndex1 = floor(random(_wallArr.length));
      if ( rIndex1 != rIndex0 ) break;
      rIndex1 = undefined;
      loopCount += 1;
    }
    var wall0 = _wallArr[rIndex0];
    var wall1 = rIndex1 !== undefined ? _wallArr[rIndex1] : undefined;
    // var size = random(2,10);
    // var dur = 500 + ((size-5)/5)*400;
    var delay = random(1000);
    wall0.newBeam(null,0,null);
    if ( wall1 ) {
      wall1.newBeam(null,delay,null); //TODO: change undefined to null?
    }
  };
  this.fireInvisibleBeam = _fireInvisibleBeam;

  var _stopRipples = function() {
    return Promise.all(_wallArr.map(function(wall){
      return wall.stopRipples();
    }));
  };
  this.stopRipples = _stopRipples;

  var _startRipples = function() {
    return Promise.all(_wallArr.map(function(wall){
      return wall.startRipples();
    }));
    // return Promise.resolve().then(function(){
    //   _wallArr.forEach(function(wall){
    //     return wall.startRipples();
    //   });
    // });
  };
  this.startRipples = _startRipples;

  this.update = function() {
    if ( _timeNextBeam < millis() ) {
      _timeNextBeam = millis() + random(5000);
      _fireInvisibleBeam();
    }
    // TODO: fire more beams from walls that have been stopped
    _wallArr.forEach(function(element){
      element.update();
    });
  };

  this.draw = function() {
    _wallArr.forEach(function(element){
      element.draw();
    });
  };

};

var ThingsPattern = {
  SINE_WAVE: 'sine',
  FAST: 'fast',
  SLOW: 'slow',
  FLAT: 'flat',
  STATIC_SPREAD: 'static_spread',
  NOISE_WAVE: 'noise_wave'
};

var ThingMgr = function() {

  var _self = this;

  var _thingArr;

  var _pattern;

  var _attr = {
    waveFreqFactor: 0.05,
    scale: 1,
    alpha: 1
  };
  var _resetThingsAt;
  var _fadingThings = false;
  var _resetShowLightsAt;
  var _resetWaveFreqAt;
  var _waveIndex;
  var _waveIndexInc = 0.2;
  var _waveIndexIncFactor = 1;

  var _init = function() {
    _thingArr = [];
    _resetShowLightsAt = millis() + 1000;//random(1000,5000);
    //var resetThingsDur = random(30000,60000);
    // _resetThingsAt = millis() + resetThingsDur;
    // _resetWaveFreqAt = millis() + 10000;
    _attr.scale = 1;
    _attr.alpha = 1;
    _waveIndex = 0;
    _waveIndexIncFactor = 1;

    _setPattern( ThingsPattern.NOISE_WAVE );
  };

  var _resetShowLights = function() {
    _thingArr.forEach( function(thing) {
      thing.randomShowLight();
    });
    _resetShowLightsAt = millis() + 1000;//random(1000,5000);
  };

  this.getWaveFreqFactor = function() {
    return _attr.waveFreqFactor;
  };

  var _setWaveFreqFactor = function( factor ) {
    _attr.waveFreqFactor = factor;
  };

  var _resetWaveFreq = function() {
    //this.waveFreqFactor = random(0.01, 0.1);
    var newFreq = random(0.001, 0.05);
    //console.log('reset wave freq newFreq='+newFreq);
    _attr.waveFreqFactor = newFreq;
    //createjs.Tween.get(_attr,{override:true}).to({waveFreqFactor:newFreq}, 1000, createjs.Ease.sineInOut );
    _resetWaveFreqAt = millis() + 10000;//random( 10000, 10100 );

  };

  this.getWaveIndex = function() {
    return _waveIndex;
  };

  this.getWaveIndexInc = function() {
    return _waveIndexInc;
  };
  this.setWaveIndexInc = function( inc ) {
    _waveIndexInc = inc;
  };

  this.createNewThing = function() {
    _thingArr.push( new Thing() );
  };

  var _getPattern = function(){
    return _pattern;
  };
  this.getPattern = _getPattern;

  var _setPattern = function( pattern ){
    _pattern = pattern;
  };

  var _changePattern = function(patternType, resetThingsFlag){
    return _fadeThings(false).then(function(){
      _waveIndexIncFactor = 1;
      if ( patternType === ThingsPattern.FLAT ) {
        _setWaveFreqFactor(0.001);
      } else if ( patternType === ThingsPattern.NOISE_WAVE ) {
        _setPattern( ThingsPattern.NOISE_WAVE );
        _resetWaveFreq();
      } else if ( patternType === ThingsPattern.STATIC_SPREAD ) {
        _setPattern( ThingsPattern.NOISE_WAVE );
        _setWaveFreqFactor(1);
        _waveIndexIncFactor = 0;
      } else if ( patternType === ThingsPattern.SINE_WAVE ) {
        _setPattern( ThingsPattern.SINE_WAVE );
        _setWaveFreqFactor(0.05);
        _waveIndexIncFactor = 2;
      } else if ( patternType === ThingsPattern.FAST ) {
        _setWaveFreqFactor(0.05);
        _waveIndexIncFactor = 2;
      } else if ( patternType === ThingsPattern.SLOW ) {
        _setWaveFreqFactor(0.01);
        _waveIndexIncFactor = 1;
      }
      if ( resetThingsFlag ) {
        _resetThings();
      }
    }).then(function(){
      return _fadeThings(true);
    });
  };
  this.changePattern = _changePattern;

  _init();

  this.update = function() {
    // _updateThingImage();

    // if ( _resetShowLightsAt < millis() ) {
    //   _resetShowLights();
    // }
    // if ( _resetThingsAt && !_fadingThings && _resetThingsAt < millis() ) {
    //   this.fadeThings().then(function() {
    //     _self.resetThings();
    //   });
    // }
    // if ( _resetWaveFreqAt < millis() ) {
    //   _resetWaveFreq();
    // }
    _thingArr.forEach( function(thing) {
      thing.update();
    });

    _waveIndex += _waveIndexInc * _waveIndexIncFactor;

  };

  this.draw = function() {
    //scale(1,1,_attr.scale);
    translate(-pm.getGridWidth()/2,0,-pm.getGridWidth()/2);
    translate(0,700,0);

    _thingArr.forEach( function(thing) {
      thing.draw(_attr.alpha);
    });
  };

  var _fadeThings = function(isFadeIn, duration) {
    _fadingThings = true;
    var finalAlpha = isFadeIn ? 1 : 0;
    return new Promise(function(resolve, reject) {
      createjs.Tween.get(_attr).to({alpha:finalAlpha}, duration ? duration : 1000, createjs.Ease.cubicInOut).call(function() {
        _fadingThings = false;
        resolve();
      });
    });
  };

  this.fadeThings = _fadeThings;

  var _resetThings = function() {
    var resetThingsDur = random(30000,60000);
    pm.reset();
    _init();
    var numThings = random(15,70);
    var i;
    for ( i=0; i<numThings; i++ ) {
      _self.createNewThing();
    }
    _resetWaveFreq();
    _resetThingsAt = millis() + resetThingsDur;
  };

  this.resetThings = _resetThings;

};

var Camera = function() {

  var _self = this;
  var _pos;
  var _angle;

  function _init() {
    camera(0,0,0);
    _pos = {x:0,y:0,z:0};
    _angle = {x:0,y:0,z:0};
    _angle.x = HALF_PI/3.0;//random(-HALF_PI,HALF_PI);
    _beginAnimationRotationY( random(-TWO_PI,TWO_PI) );
    _beginAnimationRotationX( random(-HALF_PI,HALF_PI) );
    _beginAnimationMoveZ( random(-1000) );
  }
  _init();

  function _beginAnimationRotationY( newAngleDelta ) {
    // _animateRotationY( -TWO_PI, 5000 ).then( _animateRotationY( -PI, 2500 ).then( _beginAnimationRotationY() ) );
    _animateRotationY( newAngleDelta, random(100,500) ).then( function() {
        _beginAnimationRotationY( random(-TWO_PI,TWO_PI) );
    });
  }

  function _beginAnimationRotationX( newAngleOrAngleDelta ) {
    _animateRotationX( newAngleOrAngleDelta, random(100,500), false ).then( function() {
        _beginAnimationRotationX( random(-HALF_PI,HALF_PI) );
    });

  }

  function _beginAnimationMoveZ( newPosZ ) {
    createjs.Tween.get( _pos, {override:true,useTicks:true}).to({z:newPosZ}, random(100,500), createjs.Ease.sineInOut ).call(function() {
      _beginAnimationMoveZ( random(-1000) );
    });
  }

  function _animateRotationY( newAngleDelta, duration ) {
    return new Promise( function( resolve, reject ) {
      var newAngle = _angle.y + newAngleDelta;
      createjs.Tween.get(_angle, {useTicks:true}).to({y:newAngle}, duration, createjs.Ease.sineInOut).call(function() {
        resolve();
      });
    });
  }

  function _animateRotationX( newAngleOrAngleDelta, duration, isDelta ) {
    return new Promise( function( resolve, reject ) {
      var newAngle = isDelta ? _angle.x + newAngleOrAngleDelta : newAngleOrAngleDelta;
      createjs.Tween.get(_angle, {useTicks:true}).to({x:newAngle}, duration, createjs.Ease.sineInOut).call(function() {
        resolve();
      });
    });
  }


  this.update = function() {
    //camera(0,0,sin(frameCount * 0.01) * 500 + 500);
    //camera( _pos.x, _pos.y, _pos.z );
    //rotateX(PI/6);
    //rotateY(-TWO_PI * mouseX/width);
    translate( 0, 0, _pos.z );

    rotateX( _angle.x );
    rotateY( _angle.y );
  };
};

var b0;

var sceneMgr;

var SceneMgr = function(colorMgr, posMgr, thingMgr, wallMgr, camMgr) {

  var _cm = colorMgr;
  var _pm = posMgr;
  var _tm = thingMgr;
  var _wm = wallMgr;
  var _cam = camMgr;

  var _timeToChangeBlocks;
  var _isChangingBlocks;

  //var _timeForNextUnsheildedBeam = millis() + 1000;

  var _init = function() {
    _timeToChangeBlocks = millis() + 10000;
    _isChangingBlocks = false;
  };
  _init();

  var _wait = function(duration) {
    return new Promise(function(resolve,reject){
      window.setTimeout(function(){
        resolve();
      }, duration);
    });
  };
  this.wait = _wait;

  var _startChangeBlocksSequence = function() {
    //TODO: check if changing already and if so then ignore this request
    if ( _isChangingBlocks ) {
      console.log('change in progress, ignore new change request');
      return;
    }
    _isChangingBlocks = true;
    _tm.changePattern( ThingsPattern.STATIC_SPREAD );
    console.log('about to stop ripples');
    return _wm.stopRipples().then(function(){
      console.log('stopped ripples. waiting...');
      //_tm.changePattern( ThingsPattern.STATIC_SPREAD );
      return _wait(random(10000,30000));
    })
    .then(function(){
      _tm.changePattern( ThingsPattern.SINE_WAVE );
      return _wait(random(10000,30000));
    })
    .then(function(){
      // restart wall activity (i.e. re-initialize walls)
      console.log('waiting done. restart ripples');
      //_tm.changePattern( ThingsPattern.FAST );
      return _wm.startRipples();
    })
    .then(function(){
      _isChangingBlocks = false;
      _tm.changePattern( ThingsPattern.NOISE_WAVE );
    })
    .catch(function(err){
      console.log('SceneMgr change block sequence error: '+err);
    });
  };

  this.update = function() {
    if ( !_isChangingBlocks && millis() > _timeToChangeBlocks ) {
      _startChangeBlocksSequence().then(function(){
        _timeToChangeBlocks = millis() + 30000;
      });
    }
    // if ( _timeForNextUnsheildedBeam && millis() > _timeForNextUnsheildedBeam ) {
    //   var wallStoppedArr = _wm.stoppedWalls();
    //   if ( wallStoppedArr.length > 0 ) {
    //     var rIndex = floor(random(wallStoppedArr.length));
    //     _wm.fireInvisibleBeam(wallStoppedArr[rIndex]);
    //     _timeForNextUnsheildedBeam = millis() + random(50,(5-wallStoppedArr.length)*100);
    //   } else {
    //     _timeForNextUnsheildedBeam = millis() + 1000;
    //   }
    //
    // }
  };

  this.draw = function() {

  };

};

function preload() {
  // universe01.jpg
  // load the background image of the universe
  //b0 = loadImage("universe01.jpg");
}

function setup() {
  // uncomment this line to make the canvas the full size of the window
  createCanvas(windowWidth, windowHeight, WEBGL);
  //ortho(-width/2, width/2, height/2, -height/2, 0.1, 100);
  //b0Change();

  cm = new ColorMgr();
  pm = new PositionMgr();
  tm = new ThingMgr();
  wm = new WallMgr();
  cam = new Camera();

  var i;
  for ( i=0; i<20; i++ ) {
    tm.createNewThing();
  }


  sceneMgr = new SceneMgr(cm, pm, tm, wm, cam);

  //background(b0);

}

function draw() {
  background(0);

  sceneMgr.update();

  tm.update();
  wm.update();

  if ( displaySpeedControl ) {
    drawSpeedControl();
  }

  cam.update();

  //orbitControl();

  //ortho(-width, width, height, -height/2, 0.1, 100);
  push();

  //pointLight(255, 255, 255, mouseX, mouseY, 0);
  //specularMaterial(250,0,0);
  // var dirY = (mouseY / height - 0.5) *2;
  // var dirX = (mouseX / width - 0.5) *2;

  ambientLight(100);

  //pointLight(255, 255, 255, width/2, height, 100);
  //directionalLight(250, 250, 250, dirX, dirY, -0.5);

  //this is good usually (below)
  //ambientLight(20,20,20);
  directionalLight(250, 250, 250, 1, 0, 0.2);

  //basicMaterial(250,0,0);

  //rotateX(PI/6);
  // rotateY(-PI/3);

  tm.draw();
  wm.draw();

  sceneMgr.draw();

  // translate(100,100,-100);
  // rotate(PI/4, [1,1,0]);
  // box(30);
  // translate(200,200,0);
  // sphere(50, 64);
  //
  // //ambientMaterial(250);
  // translate(200,200,0);
  // sphere(50, 64);

  pop();

}

function mouseClicked() {

}

function keyTyped() {
  if (key === 'a') {
    tm.resetThings();
  } else if (key === '+') {
    var wi = tm.getWaveIndexInc();
    tm.setWaveIndexInc( wi * 1.2 );
  } else if (key === '-') {
    var wi = tm.getWaveIndexInc();
    tm.setWaveIndexInc( wi * 0.8 );
  }
  return false; // prevent any default behavior
}

//---
//---


var pointerStartedX;
var globalSpeed = 0.25/2.0;
var globalSpeed0;
var displaySpeedControl = false;

var globalSpeedDurationTweakFactor = function () {
  var g = globalSpeed < 0.001 ? 0.001 : globalSpeed;
  return 1/(g/0.25);
}
var globalSpeedTweakFactor = function() {
  return globalSpeed / 0.25;
}
var touchStarted = function() {
  pointerStarted( touchX );
};
var mousePressed = function() {
  pointerStarted( mouseX );
}
var pointerStarted = function(px) {
  displaySpeedControl = true;
  pointerStartedX = px;
  //console.log("pointerStartedX="+pointerStartedX);
  globalSpeed0 = globalSpeed;
};
var pointerMoved = function(px) {
  //console.log("px="+px);
  if ( !displaySpeedControl ) {
    return;
  }
  globalSpeed = globalSpeed0 + (px - pointerStartedX) / width;
  if (globalSpeed < 0) {
    globalSpeed = 0;
  } else if (globalSpeed > 1) {
    globalSpeed = 1;
  }
  console.log("globalSpeed="+globalSpeed);
  tm.setWaveIndexInc( globalSpeed*2 );
}
var mouseMoved = function() {
  pointerMoved(mouseX);
};
var touchMoved = function() {
  pointerMoved(touchX);
}
var touchEnded = mouseReleased = function() {
  displaySpeedControl = false;
};
var drawSpeedControl = function() {
  push();
  showHelpText = false;
  var left = width/10;
  var right = width - width/10;
  var controlWidth = width - width/10*2;
  var controlStepWidth = controlWidth/100;
  fill(0,255,0);
  noStroke();
  //translate(-width/2.0,0,0);
  translate(left - width/2.0,0,0);

  for (var i = 0; i < floor(100*globalSpeed); i++) {
    //rect(left+i*controlStepWidth,height/2,controlStepWidth*0.5,100);
    translate(controlStepWidth,0,0);
    basicMaterial(0,255,0);
    plane(controlStepWidth/5,100);
  }
  pop();
  // translate(0,-200,0);
  // //textSize(32);
  // fill(255);
  // text('word',0,0);
};
