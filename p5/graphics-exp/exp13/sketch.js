
var _boxes;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  background(120);

  _boxes = new Boxes();

  // var g1 = createGraphics(width,height);

  // g1.blendMode( EXCLUSION );
  // g1.fill(255);
  // g1.rectMode(CENTER);
  // g1.translate(width/2,height/2);


  // g1.push();
  // g1.rotate(-PI/8);
  // g1.rect(0,0,200,200);
  // g1.pop();
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

  // image( g1, 0, 0 );

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
  background(120);
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

  this.update = function() {
    graphics.clear();
    if ( !isMovingOutAll && millis() > moveOutAllAt ) {
      moveOutAll();
    } else if ( millis() > resetAllAt ) {
      resetAll();
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

  var boxWidth = random(200,1000);
  var boxHeight = random(200,700);
  var boxMaxSize = max(boxWidth,boxHeight);

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

  this.update = function() {
    if ( isMoving ) {
      if ( isAtDestination() ) {
        isMoving = false;
        pickNextStartMovingAt();
      } else {
        updatePos();
      }
    } else if ( isTimeToStartMoving() ) {
      isMoving = true;
      pickNewTarget();
      startedMovingAt = millis();
      durationMoving = random(1000,5000);
    }
  };

  this.draw = function() {
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
