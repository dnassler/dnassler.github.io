
// var img;

// function preload() {
//   img = loadImage("randomSquare100.png"); // img is size 100x100 pixels
// }

var bMgr;
var globalSpeed = 0.2;
var showOrbitPath = false;
var showOrbitTrails = true;
var showConnectedPaths = true;
var showHelpText = true;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // var pg = createGraphics(width,height);
  // pg.clear();
  // pg.fill(0,0,255,255);
  // pg.rect(0,0,width,10);
  // img.mask(pg);
  // image( img, 0, 0 );
  // noLoop();
  angleMode(RADIANS);

  bMgr = new BubbleMgr( 35 );

  textFont("sans-serif");
  textSize(30);
  textAlign(CENTER);

  window.setTimeout(function() { showHelpText = false; }, 5000);

}

function draw() {
  background(255);
  bMgr.update();
  bMgr.draw();

  if ( showHelpText ) {
    fill(0);
    text("touch to control speed", width/2, height/2);
  }

  if ( displaySpeedControl ) {
    drawSpeedControl();
  }

}

//--

function BubbleMgr( numOfBubbles ) {
  this.bArr = [];
  for ( var i=0; i<numOfBubbles; i++ ) {
    this.bArr.push( new Bubble() );
  }
  // add one orbiting bubble per main bubble
  var orbitingBubblesArr = [];
  for ( var i=0; i<numOfBubbles; i++ ) {
    var numOfOrbitingBubbles = floor(random(0,3));
    for ( var j=0; j<numOfOrbitingBubbles; j++ ) {
      var b = new Bubble( undefined, this.bArr[i] );
      orbitingBubblesArr.push( b );
      var numOfSubOrbitingBubbles = random(0,5);
      if ( numOfSubOrbitingBubbles <= 3 ) {
        for ( var k=0; k<numOfSubOrbitingBubbles; k++ ) {
          orbitingBubblesArr.push( new Bubble( undefined, b, random(50,100),random(50,100), TWO_PI/random(1,2) ) );
        }
      }
    }
  }
}

BubbleMgr.prototype.update = function() {
  var bArrLen = this.bArr.length;
  for (var i=0; i<bArrLen; i++ ) {
    this.bArr[i].update();
  }
}

BubbleMgr.prototype.draw = function() {
  var bArrLen = this.bArr.length;
  for (var i=0; i<bArrLen; i++ ) {
    this.bArr[i].draw();
  }
}


function Bubble( inBubbleRadius, inOrbitObj, inOrbitRadius, inOrbitRadius2, inOrbitVelocity ) {

  this.orbitingObjArr = [];

  this.x = undefined;
  this.y = undefined;

  this.orbitingObj = inOrbitObj;

  if ( inBubbleRadius ) {
    this.bubbleRadius = inBubbleRadius;
  } else {
    var minRandomBubbleRadius;
    if ( this.orbitingObj ) {
      minRandomBubbleRadius = this.orbitingObj.bubbleRadius / 10;
    }
    if ( minRandomBubbleRadius === undefined || minRandomBubbleRadius < 10 ) {
      minRandomBubbleRadius = 10;
    }
    var maxRandomBubbleRadius;
    if ( this.orbitingObj ) {
      maxRandomBubbleRadius = this.orbitingObj.bubbleRadius * 0.9;
    }
    if ( maxRandomBubbleRadius === undefined ) {
      maxRandomBubbleRadius = 60;
    }
    this.bubbleRadius = random(minRandomBubbleRadius, maxRandomBubbleRadius);
  }
  this.color = color(random(255),random(255),random(255),150);

  if ( inOrbitObj ) {

    this.orbitingObj.orbitingObjArr.push(this);

    if ( inOrbitRadius ) {
      this.orbitRadius = inOrbitRadius;
    } else {
      this.orbitRadius = random(0,500);
    }
    if ( inOrbitRadius2 ) {
      this.orbitRadius2 = inOrbitRadius2;
    } else {
      this.orbitRadius2 = random(100,500);
    }
    this.orbitPosAngle = random(TWO_PI);
    this.orbitVelocity = inOrbitVelocity;
    if ( !this.orbitVelocity ) {
      this.orbitVelocity = TWO_PI / 10;
    }
    this.orbitPlaneAngle = random(-TWO_PI,TWO_PI);
    this.orbitPlaneAngleChangeRate = TWO_PI/100;

  } else {

    this.x = random(width/10,width*0.9);
    this.y = random(height/10,height*0.9);
    this.vx = random(50,100);
    this.vy = random(-20,20);
  }

}

// Bubble.prototype.isOrbiting = function() {
//   return (this.orbitingObj !== undefined);
// };
Bubble.prototype.update = function() {
  if ( this.orbitingObj ) {
    this.orbitPosAngle += this.orbitVelocity * globalSpeed/10;
    this.x = cos(this.orbitPosAngle) * this.orbitRadius;
    this.y = sin(this.orbitPosAngle) * this.orbitRadius2;
    //this.orbitPlaneAngle += this.orbitPlaneAngleChangeRate;
    for (var i=0; i<this.orbitingObjArr.length; i++) {
      var obj = this.orbitingObjArr[i];
      obj.update();
    }
  } else {
    this.x += this.vx * globalSpeed/10;
    this.y += this.vy * globalSpeed/10;
    if ( this.x > width+300 ) {
      this.x = -300;
    } else if ( this.x < -300 ) {
      this.x = width+300;
    }
    if ( this.y > height+200 ) {
      this.y = 0;
    } else if ( this.y < 0 ) {
      this.y = height;
    }
    for (var i=0; i<this.orbitingObjArr.length; i++) {
      var obj = this.orbitingObjArr[i];
      obj.update();
    }
  }
}

Bubble.prototype.draw = function() {
  push();
  if ( this.orbitingObj ) {
    translate(this.orbitingObj.x, this.orbitingObj.y);
    rotate(this.orbitPlaneAngle);
    if ( showOrbitPath ) {
      stroke(0,50);
      noFill();
      ellipse(0,0,this.orbitRadius*2,this.orbitRadius2*2);
    }
    if ( showConnectedPaths ) {
      stroke(0,50);
      noFill();
      line( this.x, this.y, 0, 0);
    }
  }
  noStroke();
  fill(this.color);
  ellipse(this.x,this.y,this.bubbleRadius,this.bubbleRadius);
  if ( this.orbitingObjArr.length > 0 ) {
    for (var i=0; i<this.orbitingObjArr.length; i++) {
      var obj = this.orbitingObjArr[i];
      obj.draw();
      //obj.drawShadow();
    }
  }
  pop();
};

Bubble.prototype.drawShadow = function() {
  var p0x = this.x + cos(lightAngle+QUARTER_PI)*this.bubbleRadius;
  var p0y = this.y + sin(lightAngle+QUARTER_PI)*this.bubbleRadius;
  var p1x = this.x + cos(lightAngle-QUARTER_PI)*this.bubbleRadius;
  var p1y = this.y + sin(lightAngle-QUARTER_PI)*this.bubbleRadius;
  //line(p0x,p0y,)
};

//-----
//-----

var pointerStartedX;
var globalSpeed0;
var displaySpeedControl = false;

var touchStarted = function() {
  pointerStarted( touchX );
};
var mouseStarted = function() {
  pointerStarted( mouseX );
}
var pointerStarted = function(px) {
  displaySpeedControl = true;
  pointerStartedX = px;
  globalSpeed0 = globalSpeed;
};
var pointerMoved = function(px) {
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
  showHelpText = false;
  var left = width/10;
  var right = width - width/10;
  var controlWidth = width - width/10*2;
  var controlStepWidth = controlWidth/100;
  fill(0,255,0);
  noStroke();
  for (var i = 0; i < floor(100*globalSpeed); i++) {
    rect(left+i*controlStepWidth,height/2,controlStepWidth*0.5,100);
  }
};
