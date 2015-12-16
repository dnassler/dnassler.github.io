var cm;
var pm;
var tm;
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

  this.translateToGridPos = function( pos ) {
    // the pos input is in format of row/col but can be fractional
    // this is used for the floaters
    translate(pos.col * 30*4, 0, pos.row * 30*4 );
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
  var _hasFloater;

  var _randomShowLight = function() {
    _showLight = floor(random(2)) >= 1 ? true : false;
  };

  var _toggleShowLight = function() {
    _showLight = !_showLight;
  }

  var _setHasFloater = function(hasFloater) {
    _hasFloater = hasFloater;
  };
  this.setHasFloater = _setHasFloater;

  var _getHasFloater = function() {
    return _hasFloater;
  }
  this.getHasFloater = _getHasFloater;

  var _init = function() {
    _color = cm.getNewColor();
    _randomShowLight();
    _pos = pm.getFreePosition();
    pm.reservePos( _pos, _self );
    _size = {w:1, h:floor(random(1,3))};
    _hasFloater = random(2) < 1 ? true: false;
  };
  _init();

  this.randomShowLight = _randomShowLight;
  this.toggleShowLight = _toggleShowLight;

  this.getGridPoint = function() {
    return _pos;
  };

  this.update = function() {
    _lastOffsetHeight = _offsetHeight;
    //_offsetHeight = 10 * sin((frameCount+_pos.row*8+_pos.col*8)*tm.getWaveFreqFactor());
    _offsetHeight = 0;
    if ( _lastOffsetHeight === undefined ) {
      _lastOffsetHeight = _offsetHeight;
    }

  };

  var _floaterHeight = function() {
    var h = 30 * (_size.h + _offsetHeight);
    return 30*(_size.h + _offsetHeight - 1) + h+noise(frameCount*0.02, _pos.row)*50;
  };

  this.floaterHeight = _floaterHeight;

  this.draw = function(alpha) {
    push();
    //translate(i*30*4,j*30*4,0);
    pm.translateToThingPos( _self );

    var c = color(red(_color)*alpha,green(_color)*alpha,blue(_color)*alpha);
    ambientMaterial(c);

    translate( 0, -30*(_size.h + _offsetHeight - 1), 0 );
    var h = 30 * (_size.h + _offsetHeight);
    box( 30 * _size.w, h, 30 * _size.w);

    if ( _hasFloater ) {
      translate( 0, -h-10*5.5+noise(frameCount*0.02, _pos.row)*50, 0 );
      if ( _showLight ) {
        basicMaterial(c);
      }
      box( 30 * _size.w, 10, 30 * _size.w );
    }

    pop();

  };

};

var Floater = function( fromThing, fromPos, destThing, destPos ) {
  var _self = this;

  var SKY_HEIGHT = 400;

  var _fromThing = fromThing;
  var _destThing = destThing;

  var _fromPos = {};
  var _destPos = {};

  var _color;

  var _attr = {
    pos: {row:-1,col:-1},
    height: SKY_HEIGHT,
    angleX: 0,
    angleY: 0,
    angleZ: 0
  };

  var _init = function() {
    _color = color(255,255,255);
    if ( fromThing ) {
      var fromThingPos = fromThing.getGridPoint();
      _fromPos.row = fromThingPos.row;
      _fromPos.col = fromThingPos.col;
    } else {
      _fromPos = fromPos;
    }
    if ( destThing ) {
      var destThingPos = destThing.getGridPoint();
      _destPos.row = destThingPos.row;
      _destPos.col = destThingPos.col;
    } else {
      _destPos = destPos;
    }

    _attr.pos = _fromPos;
    _attr.height = _fromThing.floaterHeight();

  };
  _init();

  var _launchToSky = function() {
    return new Promise( function(resolve, reject) {
      var rotation = floor(random(4));
      var rz = rotation === 0 ? floor(random(-4,5))*PI : 0;
      var rx = rotation === 1 ? floor(random(-4,5))*PI : 0;
      var ry = rotation === 2 ? floor(random(-2,3))*PI/2 : 0;
      createjs.Tween.get(_attr)
        .to({height:SKY_HEIGHT*random(1,1.2), angleX:rx, angleY:ry, angleZ:rz}, 2000, createjs.Ease.sineInOut)
        .call( function() {
          resolve();
        });
    });
  };
  var _moveToRow = function() {
    return new Promise( function(resolve, reject) {
      if ( _fromPos.row !== _destPos.row ) {
        var rotation = floor(random(2));
        var ry = rotation === 0 ? floor(random(-1,2))*PI/2 : _attr.angleY;
        var duration = 2000;
        createjs.Tween.get(_attr).to({angleY:ry}, duration, createjs.Ease.sineInOut);
        createjs.Tween.get(_attr.pos)
          .to({row:_destPos.row}, duration, createjs.Ease.sineInOut)
          .call( function(){
            resolve();
          });
      } else {
        resolve();
      }
    });
  };
  var _moveToCol = function() {
    return new Promise( function(resolve, reject) {
      if ( _fromPos.col !== _destPos.col ) {
        var rotation = floor(random(2));
        var ry = rotation === 0 ? floor(random(-1,2))*PI/2 : _attr.angleY;
        var duration = 2000;
        createjs.Tween.get(_attr).to({angleY:ry}, duration, createjs.Ease.sineInOut);
        createjs.Tween.get(_attr.pos)
          .to({col:_destPos.col}, duration, createjs.Ease.sineInOut)
          .call( function(){
            resolve();
          } );
      } else {
        resolve();
      }
    });
  };
  var _landFromSky = function() {
    return new Promise( function(resolve, reject) {
      var rotation = floor(random(4));
      var rz = rotation === 0 ? floor(random(-4,5))*PI : _attr.angleZ;
      var rx = rotation === 1 ? floor(random(-4,5))*PI : _attr.angleX;
      var ry = rotation === 2 ? floor(random(-2,3))*PI/2 : _attr.angleY;
      createjs.Tween.get(_attr)
        .to({height:_destThing.floaterHeight(), angleX:rx, angleY:ry, angleZ:rz}, 2000, createjs.Ease.sineInOut)
        .call( function(){
          resolve();
        });
    });
  }

  var _moveToDest = function() {
    return _launchToSky()
      .then( function() {
        return _moveToRow();
      })
      .then( function() {
        return _moveToCol();
      })
      .then( function() {
        return _landFromSky();
      });
  };
  this.moveToDest = _moveToDest;

  this.kill = function(){
    createjs.Tween.removeTweens( _attr );
    createjs.Tween.removeTweens( _attr.pos );
    this.isKilled = true;
  };
  this.isKilled = false;

  this.update = function() {

  };

  this.draw = function() {
    push();
    ambientMaterial(_color);
    pm.translateToGridPos( _attr.pos );
    translate(0,_attr.height*-1,0);
    rotateX(_attr.angleX);
    rotateY(_attr.angleY);
    rotateZ(_attr.angleZ);
    //translate(0,-200,0);

    box( 30, 10, 30 );
    pop();
  };

};

var FloaterMgr = function() {
  var _floaterArr;

  var _init = function() {
    _floaterArr = [];
  };
  _init();

  this.reset = function() {
    //createjs.Tween.removeAllTweens();
    _floaterArr.forEach(function( floater ){
      floater.kill();
    });
    _init();
  };

  var _newFloater = function( fromThing, toThing ) {
    if ( !fromThing ) {
      fromThing = tm.getRandomThingWithFloater();
      //TODO: handle case where there is no fromThing available
      if ( !fromThing ) {
        console.log("ERROR: cannot find thing with floater to move.");
      }
    }
    if ( !toThing ) {
      toThing = tm.getRandomThingWithoutFloater();
      //TODO: handle case where there is no toThing available
      if ( !toThing ) {
        console.log("ERROR: cannot find thing without floater to move.");
      }
    }
    var floater = new Floater( fromThing, null, toThing, null );
    _floaterArr.push( floater );

    fromThing.setHasFloater( false );
    floater.moveToDest().then(function(){
      var floaterIndex = _floaterArr.indexOf(floater);
      if ( floaterIndex >= 0 ) {
        _floaterArr.splice(floaterIndex,1);
        toThing.setHasFloater( true );
      } else {
        fromThing.setHasFloater( true );
      }
    });
  };
  this.newFloater = _newFloater;

  this.update = function() {
    _floaterArr.forEach( function(floater) {
      floater.update();
    });
  };

  this.draw = function() {
    _floaterArr.forEach( function(floater) {
      floater.draw();
    });
  };

};

var fm = new FloaterMgr();

var ThingMgr = function() {

  var _self = this;
  var _thingArr;
  var _attr = {
    waveFreqFactor: 0.05,
    scale: 1,
    alpha: 1
  };
  var _resetThingsAt;
  var _fadingThings = false;
  var _resetShowLightsAt;
  var _resetWaveFreqAt;
  var _launchNewFloaterAt;

  var _init = function() {
    _thingArr = [];
    _resetShowLightsAt = millis() + 1000;//random(1000,5000);
    var resetThingsDur = random(30000,60000);
    _resetThingsAt = millis() + resetThingsDur;
    //_resetWaveFreqAt = millis() + random( 10000, 30000 );
    _resetWaveFreqAt = millis() + 10000;//random( 10000, 10100 );
    _attr.scale = 1;
    _attr.alpha = 0;

    createjs.Tween.get(_attr).to({alpha:1}, random(2000,4000), createjs.Ease.cubicInOut);

    _launchNewFloaterAt = millis() + 4000;

  };
  _init();

  var _getRandomThing = function() {
    return _thingArr[floor(random(_thingArr.length))];
  };
  var _getRandomThingWithFloater = function() {
    var thingsWithFloater = _thingArr.filter(function(element) {
      return element.getHasFloater();
    });
    return thingsWithFloater[floor(random(thingsWithFloater.length))];
  }
  this.getRandomThingWithFloater = _getRandomThingWithFloater;

  var _getRandomThingWithoutFloater = function() {
    var thingsWithoutFloater = _thingArr.filter(function(element){
      return !element.getHasFloater();
    });
    return thingsWithoutFloater[floor(random(thingsWithoutFloater.length))];
  };
  this.getRandomThingWithoutFloater = _getRandomThingWithoutFloater;

  var _resetShowLights = function() {
    //var thing = _getRandomThing();
    //thing.toggleShowLight();
    _resetShowLightsAt = millis() + 1000;//random(1000,5000);
  };

  this.getWaveFreqFactor = function() {
    return _attr.waveFreqFactor;
  }
  var _resetWaveFreq = function() {
    //this.waveFreqFactor = random(0.01, 0.1);
    var newFreq = random(0.001, 0.04);
    //console.log('reset wave freq newFreq='+newFreq);
    _attr.waveFreqFactor = newFreq;
    //createjs.Tween.get(_attr,{override:true}).to({waveFreqFactor:newFreq}, 1000, createjs.Ease.sineInOut );
    _resetWaveFreqAt = millis() + 10000;//random( 10000, 10100 );

  };

  this.createNewThing = function() {
    _thingArr.push( new Thing() );
  };

  this.update = function() {
    if ( _resetShowLightsAt < millis() ) {
      _resetShowLights();
    }
    if ( !_fadingThings && _resetThingsAt < millis() ) {
      this.fadeThings().then(function() {
        _self.resetThings();
      });
    }
    // if ( _resetWaveFreqAt < millis() ) {
    //   _resetWaveFreq();
    // }
    if ( _launchNewFloaterAt < millis() ) {
      _launchNewFloaterAt = millis() + 4000;
      fm.newFloater();
    }
    _thingArr.forEach( function(thing) {
      thing.update();
    });
    fm.update();
  };

  this.draw = function() {
    //scale(1,1,_attr.scale);
    translate(-pm.getGridWidth()/2,0,-pm.getGridWidth()/2);
    _thingArr.forEach( function(thing) {
      thing.draw(_attr.alpha);
    });
    fm.draw();
  };

  this.fadeThings = function(duration) {
    _fadingThings = true;
    return new Promise(function(resolve, reject) {
      createjs.Tween.get(_attr).to({alpha:0}, duration ? duration : random(2000,4000), createjs.Ease.cubicInOut).call(function() {
        _fadingThings = false;
        resolve();
      });
    });
  };

  this.resetThings = function() {
    pm.reset();
    fm.reset();
    _init();
    var numThings = random(15,70);
    var i;
    for ( i=0; i<numThings; i++ ) {
      _self.createNewThing();
    }
    _resetWaveFreq();
    _resetThingsAt = millis() + random(30000,60000);
  };

};

var Camera = function() {

  var _self = this;
  var _pos;
  var _angle;

  function _init() {
    camera(0,0,0);
    _pos = {x:0,y:0,z:0};
    _angle = {x:0,y:0,z:0};
    _angle.x = PI/12;
    _beginAnimationRotationY( random(-TWO_PI,TWO_PI) );
    // _beginAnimationRotationX( random(-TWO_PI,TWO_PI) );
    _beginAnimationRotationX( PI/6 );
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
        _beginAnimationRotationX( random(0,HALF_PI) );
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


function setup() {
  // uncomment this line to make the canvas the full size of the window
  createCanvas(windowWidth, windowHeight, WEBGL);
  //ortho(-width/2, width/2, height/2, -height/2, 0.1, 100);
  //b0Change();

  cm = new ColorMgr();
  pm = new PositionMgr();
  tm = new ThingMgr();

  var i;
  for ( i=0; i<20; i++ ) {
    tm.createNewThing();
  }

  cam = new Camera();

}

function draw() {

  tm.update();
  cam.update();

  background(0);
  orbitControl();

  //ortho(-width, width, height, -height/2, 0.1, 100);
  push();

  //pointLight(255, 255, 255, mouseX, mouseY, 0);
  //specularMaterial(250,0,0);
  // var dirY = (mouseY / height - 0.5) *2;
  // var dirX = (mouseX / width - 0.5) *2;
  ambientLight(20,20,20);
  //pointLight(255, 255, 255, width/2, height, 100);
  //directionalLight(250, 250, 250, dirX, dirY, -0.5);
  directionalLight(250, 250, 250, 1, 0, 0.2);

  //basicMaterial(250,0,0);

  //rotateX(PI/6);
  // rotateY(-PI/3);

  tm.draw();

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
    tm.fadeThings().then( function() {
      tm.resetThings();
    });
  }
  return false; // prevent any default behavior
}
