
// var img;

// function preload() {
//   img = loadImage("randomSquare100.png"); // img is size 100x100 pixels
// }

var bMgr;
var globalSpeed = 0.03;
var showOrbitPath = false;
var showOrbitTrails = true;
var showConnectedPaths = true;

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
}

function draw() {
  background(255);
  bMgr.update();
  bMgr.draw();
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
    var numOfOrbitingBubbles = 1;//random(0,5);
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
    this.orbitPosAngle += this.orbitVelocity * globalSpeed;
    this.x = cos(this.orbitPosAngle) * this.orbitRadius;
    this.y = sin(this.orbitPosAngle) * this.orbitRadius2;
    //this.orbitPlaneAngle += this.orbitPlaneAngleChangeRate;
    for (var i=0; i<this.orbitingObjArr.length; i++) {
      var obj = this.orbitingObjArr[i];
      obj.update();
    }
  } else {
    this.x += this.vx * globalSpeed;
    this.y += this.vy * globalSpeed;
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
