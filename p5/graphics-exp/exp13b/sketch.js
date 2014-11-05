var debugMode = 0;

var _boxes;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  background(120);

  _boxes = new Boxes();

  // var g1 = createGraphics(width,height);

  // g1.blendMode( EXCLUSION );
  // g1.noStroke();
  // g1.fill(255);
  // g1.rectMode(CENTER);

  // g1.push();
  // g1.translate(width/2,height/2);
  // g1.rotate(-PI/8);
  // g1.rect(0,0,200,200);
  // g1.pop();

  // var light = new p5.Vector(width/2,0-height/2);
  // var maxShadowLineLength = max(width,height)*2;
  // var shapeCenterVector = new p5.Vector(width/2,height/2);
  // var shapePoint = (new p5.Vector(0-100,0-100)).rotate(-PI/8).add(shapeCenterVector);
  // var lightToShapePoint = p5.Vector.sub(light, shapePoint);
  // lightToShapePoint.setMag( maxShadowLineLength );
  // var shadowPoint = p5.Vector.sub(shapePoint, lightToShapePoint);
  // g1.push();
  // g1.stroke(0);
  // g1.blendMode( NORMAL );
  // g1.line( shapePoint.x, shapePoint.y, shadowPoint.x, shadowPoint.y );
  // g1.pop();

  // image( g1, 0, 0 );

  // g1.push();
  // g1.translate(150,0);
  // g1.rotate(PI/8);
  // g1.rect(0,0,200,100);
  // g1.pop();
  // g1.push();
  // g1.translate(-100,0);
  // g1.rotate(-PI/4);
  // g1.rect(0,0,150,100);
  // g1.pop();
  // g1.push();
  // g1.translate(-250,0);
  // g1.rotate(PI/4);
  // g1.rect(0,0,500,300);
  // g1.pop();
  // g1.push();
  // g1.translate(320,0);
  // g1.rotate(PI/16);
  // g1.rect(0,0,420,420);
  // g1.pop();

  //image( g1, 0, 0 );

  // var g1 = createGraphics(width,height);
  // g1.noStroke();
  // g1.fill(255);
  // g1.rectMode(CENTER); 

  // g1.translate(width/2,height/2);
  // x1 = 0;
  // y1 = 0;
  // g1.rect(x1,y1,500,500);

  // var g2 = createGraphics(width,height);
  // g2.noStroke();
  // g2.fill(255);
  // g2.rectMode(CENTER);

  // g2.translate(width/2,height/2);
  // g2.rotate(PI/8);
  // x2 = 0;
  // y2 = 0;
  // g2.rect(x2,y2,500,500);

  // var g2Image = createImage(width,height);
  // g2Image.copy( g2, 0,0,width,height, 100,0,width,height );
  // g2Image.blend( g1, 0, 0, g1.width, g1.height, -100, 0, g2.width, g2.height, constants.DIFFERENCE );

  // image( g2Image, 0, 0 );

  //noLoop();
}

function draw() {
  //background(120);
  background(50,80,120);
  _boxes.update();
  _boxes.draw();
  image( _boxes.getGraphics(), 0, 0 );
}

function Boxes() {
  var graphics = createGraphics(width,height);
  this.getGraphics = function() {
    return graphics;
  }

  graphics.blendMode( EXCLUSION );
  graphics.fill(255);
  graphics.rectMode(CENTER);
  //graphics.translate(width/2,height/2);

  var bArr;
  var numBoxes;

  var isMovingOutAll;
  var moveOutAllAt;
  var resetAllAt;

  var moveOutAll = function() {
    isMovingOutAll = true;
    for (i=0; i<numBoxes; i++) {
      bArr[i].moveOut();
    }
    resetAllAt = millis() + 2000;
  };

  var resetAll = function() {
    isMovingOutAll = false;
    moveOutAllAt = millis() + 20000;
    resetAllAt = moveOutAllAt*2; //far enough away to not trigger before being set in moveOutAll()
    bArr = [];
    numBoxes = floor(random(2,10));
    for ( i=0; i<numBoxes; i++ ) {
      bArr.push( new Box( graphics ) );
    }
    // for (i=0; i<numBoxes; i++) {
    //   bArr[i].reset();
    // }
  };
  resetAll();

  this.getBox = function(index) {
    if ( index ) {
      return bArr[index];
    }
    return bArr[0];
  };

  this.update = function() {
    graphics.clear();
    if ( !debugMode ) {
      if ( !isMovingOutAll && millis() > moveOutAllAt ) {
        moveOutAll();
      } else if ( millis() > resetAllAt ) {
        resetAll();
      }
    }
    for (i=0; i<numBoxes; i++ ) {
      bArr[i].update();
    }
  }
  this.draw = function() {
    for (i=0; i<numBoxes; i++ ) {
      bArr[i].draw();
    }
  }
}

var constants = {
  MOVE_UP: 0,
  MOVE_DOWN: 1,
  MOVE_LEFT: 2,
  MOVE_RIGHT: 3
};

function Box( g ) {

  var graphics = g;

  var x, y;
  var rAngle;

  var boxWidth;
  var boxHeight;
  var boxMaxSize;
  var halfBoxWidth;
  var halfBoxHeight;

  var minBoxWidth = width/10;
  var maxBoxWidth = width/2;
  var minBoxHeight = width/10;
  var maxBoxHeight = minBoxHeight*4;

  this.setBoxSize = function(width,height) {
    boxWidth = width;
    boxHeight = height;
    boxMaxSize = max(boxWidth,boxHeight);
    halfBoxWidth = boxWidth/2;
    halfBoxHeight = boxHeight/2;
  };
  //this.setBoxSize( random(200,1000), random(200,700) );
  this.setBoxSize( random(minBoxWidth,maxBoxWidth), random(minBoxHeight,maxBoxHeight) );

  var xMin = g.width*0.1,
    xMax = g.width*0.9,
    yMin = g.height*0.1,
    yMax = g.height*0.9;

  var topLimitY = -boxMaxSize,
    bottomLimitY = graphics.height+boxMaxSize,
    leftLimitX = -boxMaxSize,
    rightLimitX = graphics.width+boxMaxSize;

  var xFrom, yFrom;
  var xTo, yTo;
  var rAngleFrom, rAngleTo;

  var isMoving = false;
  var isMovedOut = false;

  var pickDirection = function() {
    return floor(random(4));
  }
  this.moveOut = function( direction ) {
    if ( !direction ) {
      direction = pickDirection();
    }
    if ( direction === constants.MOVE_UP ) {
      pickNewTarget(x, topLimitY, rAngle);
    } else if ( direction === constants.MOVE_DOWN ) {
      pickNewTarget(x, bottomLimitY, rAngle);
    } else if ( direction === constants.MOVE_LEFT ) {
      pickNewTarget(leftLimitX, y, rAngle);
    } else if ( direction === constants.MOVE_RIGHT ) {
      pickNewTarget(rightLimitX, y, rAngle);
    }
    isMoving = true;
    isMovedOut = true;
    startedMovingAt = millis();
    durationMoving = 2000;
  };

  var startMovingAt;
  var startedMovingAt;
  var durationMoving;

  this.moveToNewTarget = function(xToIn,yToIn,rAngleToIn) {
    isMoving = true;
    startedMovingAt = millis();
    durationMoving = 4000;
    xFrom = x;
    yFrom = y;
    rAngleFrom = rAngle;
    xTo = xToIn;
    yTo = yToIn;
    rAngleTo = rAngleToIn;
  };

  var pickNewTarget = function(xToIn, yToIn, rAngleToIn) {
    xFrom = x;
    yFrom = y;
    rAngleFrom = rAngle;
    xTo = xToIn || random(xMin, xMax);
    yTo = yToIn || random(yMin, yMax);
    rAngleTo = rAngleToIn || random( -TWO_PI, TWO_PI );
  };

  this.reset = function() {
    x = random(xMin,xMax);
    y = random(yMin,yMax);
    rAngle = random(-TWO_PI,TWO_PI);
    var d = pickDirection();
    if ( d === constants.MOVE_UP ) {
      y = bottomLimitY;
      pickNewTarget(x,null,rAngle);
    } else if ( d === constants.MOVE_DOWN ) {
      y = topLimitY;
      pickNewTarget(x,null,rAngle);
    } else if ( d === constants.MOVE_LEFT ) {
      x = rightLimitX;
      pickNewTarget(null,y,rAngle);
    } else {
      x = leftLimitX;
      pickNewTarget(null,y,rAngle);
    }
    isMoving = true;
    isMovedOut = false;
    startMovingAt = 0;
    startedMovingAt = millis();
    durationMoving = 4000;
  };
  this.reset();

  var pickNextStartMovingAt = function() {
    startMovingAt = millis() + random(10000);
  };

  var isTimeToStartMoving = function() {
    if ( debugMode === 1 ) {
      return false;
    }
    if ( isMovedOut ) {
      return false;
    }
    if ( millis() > startMovingAt ) {
      return true;
    }
    return false;
  };

  var updatePos = function() {
    if ( !isMoving ) {
      return;
    }
    var t = millis() - startedMovingAt;
    x = Math.easeInOutCubic( t, xFrom, xTo-xFrom, durationMoving );
    y = Math.easeInOutCubic( t, yFrom, yTo-yFrom, durationMoving );
    rAngle = Math.easeInOutCubic( t, rAngleFrom, rAngleTo-rAngleFrom, durationMoving );
  };

  var isAtDestination = function() {
    if ( millis() > startedMovingAt + durationMoving ) {
      return true;
    }
    return false;
  };

  var shapePointsArr = [];
  for ( var i=0; i<4; i++ ) {
    shapePointsArr.push(new p5.Vector());
  }
  // var rotate = function(angle,x,y) {
  //   return {x:x*cos(angle)-y*sin(angle),y:x*sin(angle)+y*cos(angle)};
  // };
  var updateShapePoints = function() {
    // top-left
    // var xy = rotate(rAngle, x-halfBoxWidth, y-halfBoxHeight);
    // shapePointsArr[0].x = xy.x;
    // shapePointsArr[0].y = xy.y;
    shapePointsArr[0].set( -halfBoxWidth, -halfBoxHeight );
    shapePointsArr[0].rotate( rAngle ).add(x,y);
    // top-right
    // xy = rotate(rAngle, x+halfBoxWidth, y-halfBoxHeight);
    // shapePointsArr[1].x = xy.x;
    // shapePointsArr[1].y = xy.y;
    shapePointsArr[1].set( halfBoxWidth, -halfBoxHeight );
    shapePointsArr[1].rotate( rAngle ).add(x,y);
    // bottom-right
    // xy = rotate(rAngle, x+halfBoxWidth, y+halfBoxHeight);
    // shapePointsArr[2].x = xy.x;
    // shapePointsArr[2].y = xy.y;
    shapePointsArr[2].set( halfBoxWidth, halfBoxHeight );
    shapePointsArr[2].rotate( rAngle ).add(x,y);
    // bottom-left
    // xy = rotate(rAngle, x-halfBoxWidth, y+halfBoxHeight);
    // shapePointsArr[3].x = xy.x;
    // shapePointsArr[3].y = xy.y;
    shapePointsArr[3].set( -halfBoxWidth, halfBoxHeight );
    shapePointsArr[3].rotate( rAngle ).add(x,y);
  };

  var _lightSourceVector = new p5.Vector();//width,0-height/2);
  var lightSourceVector = function() {
    if ( debugMode === 1 ) {
      _lightSourceVector.set(mouseX,mouseY);
      return _lightSourceVector;
    }
    _lightSourceVector.set(mouseX,-height);
    return _lightSourceVector;
  }

  var shadowPointsArr = [];
  for ( var i=0; i<4; i++ ) {
    shadowPointsArr.push(new p5.Vector());
  }

  var updateShadowPoints = function() {
  
    var light = lightSourceVector();
    var boxCenter = new p5.Vector(x,y);
    var lightToBoxCenter = p5.Vector.sub(boxCenter,light);
    var magLightToBoxCenter = lightToBoxCenter.mag();

    var sorted = shapePointsArr.sort(function(a,b) {
      //return p5.Vector.sub(a,light).normalize().dot(p5.Vector.sub(boxCenter,light).normalize()) < p5.Vector.sub(b,light).normalize().dot(p5.Vector.sub(boxCenter,light).normalize())
      //? -1 : 1;
      var lightToA = p5.Vector.sub(a,light);
      var lightToB = p5.Vector.sub(b,light);
      // determine theta angle between lightToBoxCenter and lightToA
      var angleToA = acos(lightToA.dot(lightToBoxCenter)/(lightToA.mag()*magLightToBoxCenter));
      // determine angle between lightToBoxCenter and lightToB
      var angleToB = acos(lightToB.dot(lightToBoxCenter)/(lightToB.mag()*magLightToBoxCenter));
      if ( angleToA > angleToB ) {
        return -1;
      } else if ( angleToA === angleToB ) {
        return 0;
      } else {
        return 1;
      }
    });

    // The box point sorted to the top (i.e. index 0) should 
    // have the largest angle between the lightToBoxCenter vector 
    // and the vector from the light to the box point.
    shadowPointsArr[0] = sorted[0].get();

    var point0 = shadowPointsArr[0];
    var lightTo0 = p5.Vector.sub(point0,light);
    var magLightTo0 = lightTo0.mag();

    var sorted = shapePointsArr.sort(function(a,b) {
      var lightToA = p5.Vector.sub(a,light);
      var lightToB = p5.Vector.sub(b,light);
      // determine theta angle between lightTo0 and lightToA
      var angleToA = acos(lightToA.dot(lightTo0)/(lightToA.mag()*magLightTo0));
      // determine angle between lightToBoxCenter and lightToB
      var angleToB = acos(lightToB.dot(lightTo0)/(lightToB.mag()*magLightTo0));
      if ( angleToA > angleToB ) {
        return -1;
      } else if ( angleToA === angleToB ) {
        return 0;
      } else {
        return 1;
      }
    });

    // The box point sorted to the top (i.e. index 0) should
    // have the largest angle between the lightTo0 vector and 
    // the vector from the light to the box point.
    shadowPointsArr[1] = sorted[0].get();

    var maxShadowLineLength = max(width,height)*10000;
    var lightToShapePoint;
    lightToShapePoint = p5.Vector.sub(light, shadowPointsArr[0]);
    lightToShapePoint.setMag( maxShadowLineLength );
    shadowPointsArr[3] = p5.Vector.sub(shadowPointsArr[0], lightToShapePoint);
    lightToShapePoint = p5.Vector.sub(light, shadowPointsArr[1]);
    lightToShapePoint.setMag( maxShadowLineLength );
    shadowPointsArr[2] = p5.Vector.sub(shadowPointsArr[1], lightToShapePoint);

  };
  
  var isBoxCenterVisible = function() {
    if ( x < 0 || x > width || y < 0 || y > height ) {
      return false;
    }
    return true;
  };

  var calcShadowAlpha = function() {
    // shadow alpha is proportionial to box center distance from
    // the closest screen edge (or corner)
    //var boxCenter = new p5.Vector(x,y);
    var shadowAlphaMax = 80;
    if ( isBoxCenterVisible() ) {
      return shadowAlphaMax;
    }
    var shadowAlpha = shadowAlphaMax;
    if ( y < 0 ) {
      var maxDy = abs(topLimitY);
      var dy = abs(topLimitY - max(y,topLimitY));
      shadowAlpha = dy/maxDy * shadowAlphaMax;
    } else if ( x < 0 ) {
      var maxDx = abs(leftLimitX);
      var dx = abs(leftLimitX - max(x,leftLimitX));
      shadowAlpha = dx/maxDx * shadowAlphaMax;
    } else if ( x > width ) {
      var maxDx = rightLimitX;
      var dx = maxDx-min(x,maxDx);
      shadowAlpha = dx/maxDx * shadowAlphaMax;
    }
    return floor(constrain(shadowAlpha,0,shadowAlphaMax));
  };


  var drawShadow = function() {
    push();
    noStroke();
    // determine the darkness of the shadow based on the box distance
    // from the visible space. This is used to fade the shadow when 
    // the box is far from the visual field so that when a new box is
    // added or removed there is no abrupt shadow changes.
    var shadowAlpha = calcShadowAlpha();
    fill(0,shadowAlpha);
    blendMode( NORMAL );
    // for ( var i=0; i<4; i++ ) {
    //   graphics.line(shapePointsArr[i].x,shapePointsArr[i].y, shadowPointsArr[i].x, shadowPointsArr[i].y );
    // }
    quad(
      shadowPointsArr[0].x,shadowPointsArr[0].y, shadowPointsArr[1].x, shadowPointsArr[1].y,
      shadowPointsArr[2].x,shadowPointsArr[2].y, shadowPointsArr[3].x, shadowPointsArr[3].y );
    pop();
  };

  this.update = function() {
    if ( isMoving ) {
      if ( isAtDestination() ) {
        isMoving = false;
        pickNextStartMovingAt();
      } else {
        updatePos();
        // updateShapePoints();
        // updateShadowPoints();
      }
    } else if ( isTimeToStartMoving() ) {
      isMoving = true;
      pickNewTarget();
      startedMovingAt = millis();
      durationMoving = random(1000,5000);
    }
    updateShapePoints();
    updateShadowPoints();
  };

  this.draw = function() {
    drawShadow();
    graphics.push();
    graphics.translate(x,y);
    graphics.rotate(rAngle);
    graphics.rect(0,0,boxWidth,boxHeight);
    graphics.pop();
  };
}

Math.easeOutCubic = function (t, b, c, d) {
  t /= d;
  t--;
  return c*(t*t*t + 1) + b;
};

Math.easeInOutCubic = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t + 2) + b;
};
Math.easeInCubic = function (t, b, c, d) {
  t /= d;
  return c*t*t*t + b;
};
