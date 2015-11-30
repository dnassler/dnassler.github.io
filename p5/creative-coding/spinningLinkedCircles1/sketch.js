
// var img;

// function preload() {
//   img = loadImage("randomSquare100.png"); // img is size 100x100 pixels
// }

var debug = false;
var debugRightEdge = true;
var debugLeftEdge = false;

var bMgr;
var globalSpeed = 0.08;
var showOrbitPath = false;
var showOrbitTrails = true;
var showConnectedPaths = true;
var showHelpText = true;
var lightAngle;
var lightAngleFluctuator = 0.02*globalSpeed;
var worldWidth;
var worldHeight;
var worldWidthBuffer = 300;
var worldHeightBufferBottom = 300;
var globalMinRandomBubbleRadius = 5;
var globalMaxRandomBubbleRadius = 30;

var bubblesView;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  worldWidth = width + worldWidthBuffer*2;
  worldHeight = height + worldHeightBufferBottom;

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

  //lightAngle = HALF_PI;

  bubblesView = new BubblesView();

}


function draw() {
  background(255);

  push();

  bubblesView.update();

  bMgr.update();
  bMgr.draw();

  pop();

  if ( showHelpText ) {
    fill(0);
    text("touch to control speed", width/2, height/2);
  }

  if ( displaySpeedControl ) {
    drawSpeedControl();
  }

}

//--

function BubblesView() {

  var self = this;
  var b0;
  var timeNextBubbleZeroChange;
  this.sFactor = 1.0;

  this.update = function() {

    if ( millis() > timeNextBubbleZeroChange || b0.isKilled ) { //<<<<11111 why b0.isKilled????
      timeNextBubbleZeroChange = millis() + Math.random()*5000 + 10000;
      this.pickNewBubbleZero();
      var newScale = floor(random(1,3));
      createjs.Tween.get(self, {override:true,useTicks:true}).to({sFactor:newScale},100,createjs.Ease.sineInOut);
      //this.sFactor = floor(random(1,3.5));
    }

    //sFactor = 3;
    if ( debug ) {

      var xy;
      if ( debugRightEdge ) {
        xy = {x:width,y:height/2};
      } else if ( debugLeftEdge ) {
        xy = {x:0,y:height/2};
      }
      translate( width/2, height/2 );
      translate( -xy.x, -xy.y );

    } else {

      translate( width/2, height/2 );
      var xy = b0.getRotatedXY();
      translate( -xy.x*this.sFactor, -xy.y*this.sFactor );
      scale(this.sFactor);

    }

  };

  this.pickNewBubbleZero = function() {

    b0 = bMgr.getBubbleZero();
  };

  this.isBubbleZero = function ( bubble ) {
    return b0 === bubble;
  };

  this.hasBubbleZero = function( bubble ) {
    if ( this.isBubbleZero( bubble ) ) {
      return true;
    }
    for (var i=0; i<bubble.orbitingObjArr.length; i++) {
      var child = bubble.orbitingObjArr[i];
      if ( this.isBubbleZero( child ) ) {
        return true;
      }
    }
    return false;
  };

  function init() {
    self.pickNewBubbleZero();
    this.sFactor = 1;
    var newScale = floor(random(2,3));
    createjs.Tween.get(self,{override:true,useTicks:true}).to({sFactor:newScale},100,createjs.Ease.sineInOut);

    timeNextBubbleZeroChange = millis() + Math.random()*5000 + 10000;
  }

  init();

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
      //orbitingBubblesArr.push( b );
      var numOfSubOrbitingBubbles = random(0,5);
      if ( numOfSubOrbitingBubbles <= 3 ) {
        for ( var k=0; k<numOfSubOrbitingBubbles; k++ ) {
          //orbitingBubblesArr.push( new Bubble( undefined, b, random(50,100),random(50,100), TWO_PI/random(1,2) ) );
          new Bubble( undefined, b, random(50,100),random(50,100), TWO_PI/random(1,2) );
        }
      }
    }
  }
}

BubbleMgr.prototype.getBubbleZero = function() {
  var rIndex = Math.floor(Math.random() * this.bArr.length);
  var i = 0;
  while ( i < this.bArr.length ) {
    b = this.bArr[(rIndex + i) % this.bArr.length];
    if ( b.orbitingObjArr && b.orbitingObjArr.length > 0 && !b.isFading ) {
      var rIndexChild = Math.floor(Math.random() * b.orbitingObjArr.length);
      return b.orbitingObjArr[rIndexChild];
    }
    i += 1;
  }
  return b;
}

BubbleMgr.prototype.update = function() {
  var bArrLen = this.bArr.length;
  for (var i=0; i<bArrLen; i++ ) {
    this.bArr[i].update();
  }
}

BubbleMgr.prototype.draw = function() {
  lightAngle = HALF_PI + (0.4+noise(lightAngleFluctuator)/4)*QUARTER_PI*cos(lightAngleFluctuator);

  var bArrLen = this.bArr.length;
  for (var i=0; i<bArrLen; i++ ) {
    this.bArr[i].draw();
  }
  //console.log("v="+(0.4+noise(lightAngleFluctuator)/4));
  lightAngleFluctuator += 0.02*globalSpeed;// + noise(lightAngleFluctuator)/100;
}


function Bubble( inBubbleRadius, inOrbitObj, inOrbitRadius, inOrbitRadius2, inOrbitVelocity ) {

  this.orbitingObjArr = [];

  this.x = undefined;
  this.y = undefined;

  this.alphaFraction = 0;
  this.isFadingIn = true;
  createjs.Tween.get(this).to({alphaFraction:1},5000,createjs.Ease.cubicIn).call(function(){
    this.isFadingIn = false;
  });

  this.orbitingObj = inOrbitObj;

  if ( inBubbleRadius ) {
    this.bubbleRadius = inBubbleRadius;
  } else {
    var minRandomBubbleRadius;
    if ( this.orbitingObj ) {
      minRandomBubbleRadius = this.orbitingObj.bubbleRadius / 10;
    }
    if ( minRandomBubbleRadius === undefined || minRandomBubbleRadius < globalMinRandomBubbleRadius ) {
      minRandomBubbleRadius = globalMinRandomBubbleRadius;
    }
    var maxRandomBubbleRadius;
    if ( this.orbitingObj ) {
      maxRandomBubbleRadius = this.orbitingObj.bubbleRadius * 0.9;
    }
    if ( maxRandomBubbleRadius === undefined ) {
      maxRandomBubbleRadius = globalMaxRandomBubbleRadius;
    }
    this.bubbleRadius = random(minRandomBubbleRadius, maxRandomBubbleRadius);
  }
  var r = random(255);
  var g = random(255);
  var b = random(255);
  this.color = color(r,g,b,150);

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

    // this.x = random(width/10,width*0.9);
    // this.y = random(height/10,height*0.9);
    this.x = random(-worldWidthBuffer*0.9, width+worldWidthBuffer*0.9);
    this.y = random(height/10,height+worldHeightBufferBottom*0.9);
    this.vx = random(50,100);
    this.vy = random(-20,20);
  }

}

Bubble.prototype.killChildren = function() {
  //this.orbitingObj = undefined;
  for (var i=0; i<this.orbitingObjArr.length; i++) {
    var child = this.orbitingObjArr[i];
    child.isKilled = true;
    child.orbitingObj = undefined;
    child.killChildren();
  }
  this.orbitingObjArr = [];
};

Bubble.prototype.recreateMainBubble = function() {
  this.alphaFraction = 0;
  createjs.Tween.get(this,{override:true}).to({alphaFraction:1},3000,createjs.Ease.cubicIn);

  this.color = color(random(255),random(255),random(255),150);
  this.y = random(height/10,height+worldHeightBufferBottom*0.9);
  this.vx = random(50,100);
  this.vy = random(-20,20);
  this.bubbleRadius = random(globalMinRandomBubbleRadius, globalMaxRandomBubbleRadius);
  //clear existing sub-bubbles for garbage collection
  // for (var i=0; i<this.orbitingObjArr.length; i++) {
  //   this.orbitingObjArr[i].orbitingObj = undefined;
  // }
  // reset/regenerate sub-bubbles
  this.killChildren();
  var numOfOrbitingBubbles = floor(random(0,3));
  for ( var j=0; j<numOfOrbitingBubbles; j++ ) {
    var b = new Bubble( undefined, this );
    //orbitingBubblesArr.push( b );
    var numOfSubOrbitingBubbles = random(0,5);
    if ( numOfSubOrbitingBubbles <= 3 ) {
      for ( var k=0; k<numOfSubOrbitingBubbles; k++ ) {
        //orbitingBubblesArr.push( new Bubble( undefined, b, random(50,100),random(50,100), TWO_PI/random(1,2) ) );
        new Bubble( undefined, b, random(50,100),random(50,100), TWO_PI/random(1,2) );
      }
    }
  }


};

// Bubble.prototype.isOrbiting = function() {
//   return (this.orbitingObj !== undefined);
// };

Bubble.prototype.fadeBubbleAndChildren = function(isMainBubble) {
  var self = this;
  this.isFading = true;
  var fadeDuration = isMainBubble ? 5000 : 3000;
  var p = new Promise( function( resolve, reject ) {
    createjs.Tween.get(self,{override:true}).to({alphaFraction:0},fadeDuration,createjs.Ease.cubicOut).call( function(){
      resolve();
    });
  });
  var fadePromiseArr = [];
  fadePromiseArr.push( p );
  for (var i=0; i<this.orbitingObjArr.length; i++) {
    var childBubble = this.orbitingObjArr[i];
    fadePromiseArr.push( childBubble.fadeBubbleAndChildren() );
  }
  return Promise.all( fadePromiseArr ).then( function(){ self.isFading = false; });
};

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

    if ( !bubblesView.hasBubbleZero(this) ) {

      if ( !this.isFading && this.x > width+worldWidthBuffer ) {

        // fade out then reposition
        var self = this;
        this.fadeBubbleAndChildren(true).then(
          function() {
            self.x = -worldWidthBuffer;
            self.recreateMainBubble();
          });

        // createjs.Tween.get(this).to({alphaFraction:0},5000,createjs.Ease.cubicIn).call( function(){
        //   this.x = -worldWidthBuffer;
        //   this.recreateMainBubble();
        //   //createjs.Tween.get(this).to({alphaFraction:1},3000,createjs.Ease.cubicIn);
        // });

      } else if ( this.x < -worldWidthBuffer ) {
        this.x = width+worldWidthBuffer;
      }

    }

    if ( this.y > height+worldHeightBufferBottom ) {
      this.vy = -this.vy;
    } else if ( this.y < 0 ) {
      this.vy = -this.vy;
    }
    for (var i=0; i<this.orbitingObjArr.length; i++) {
      var obj = this.orbitingObjArr[i];
      obj.update();
    }
  }
}

Bubble.prototype.getChildBubble = function() {

};

Bubble.prototype.getRotatedXY = function() {
  var x;
  var y;
  if ( this.orbitingObj ) {
    x = this.x * cos( this.orbitPlaneAngle ) - this.y * sin( this.orbitPlaneAngle );
    y = this.y * cos( this.orbitPlaneAngle ) + this.x * sin( this.orbitPlaneAngle );
    var orbitingObjXY = this.orbitingObj.getRotatedXY();
    x += orbitingObjXY.x;
    y += orbitingObjXY.y;
  } else {
    x = this.x;
    y = this.y;
  }
  
  return {x:x,y:y};
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
      stroke(0,50 * this.alphaFraction);
      noFill();
      line( this.x, this.y, 0, 0);
    }
  }
  noStroke();
  
  if ( false && bubblesView.isBubbleZero(this) ) {
    // fill(255,0,0);
    fill(this.color);
  } else {
    //fill(255,0,0);
    var c = color(this.color.rgba);
    // if ( !this.isFadingIn && !this.isFading  ) {
    //   if ( c.rgba[3] === 0 || c.rgba[3] < 100 ) {
    //     console.log("found bubble with color alpha of zero");

    //   } else if ( this.alphaFraction < 0.5 ) {
    //     console.log("found bubble with alphaFraction of zero");

    //   }
    // } 
    // if ( !this.isFading && this.orbitingObj && this.orbitingObj.x > 0 && this.orbitingObj.x < width 
    //   && (this.alphaFraction == 0 || c.rgba[3] < 0.01 ) ) {

    //   console.log("found bubble with alphaFraction of zero");
    // }

    //c.rgba[3] = floor( c.rgba[3] * this.alphaFraction );
    c.rgba[3] = floor( 150 * this.alphaFraction );

    fill( c.rgba );
  }

  ellipse(this.x,this.y,this.bubbleRadius*2,this.bubbleRadius*2);

  if ( !this.orbitingObj ) {
    this.drawShadow();
  }

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
  //lightAngle = HALF_PI - HALF_PI*0.9*(mouseX/(width/2)-1);
  // lightAngle = HALF_PI - HALF_PI*(mouseX/(width/4)-2);

  var p0x = this.x + cos(lightAngle+HALF_PI)*this.bubbleRadius;
  var p0y = this.y + sin(lightAngle+HALF_PI)*this.bubbleRadius;
  var p1x = this.x + cos(lightAngle-HALF_PI)*this.bubbleRadius;
  var p1y = this.y + sin(lightAngle-HALF_PI)*this.bubbleRadius;
  // var x0 = p0x;// - sqrt((height-p0y)/sin(lightAngle) - sq(height-p0y));


  // var x0 = p0x + (lightAngle<HALF_PI ? 1:-1)*sqrt(sq((height-p0y)/sin(lightAngle)) - sq(height-p0y));
  // var y0 = height;
  // var x1 = p1x + (lightAngle<HALF_PI ? 1:-1)*sqrt(sq((height-p1y)/sin(lightAngle)) - sq(height-p1y));;
  // var y1 = height;

  var bottom = height * 10;

  var x0,y0,x1,y1;
  x0 = p0x + (cos(lightAngle)>0?1:-1)*sqrt(sq((bottom-p0y)/sin(lightAngle)) - sq(bottom-p0y));
  y0 = sin(lightAngle)>0 ? bottom : 0;
  x1 = p1x + (cos(lightAngle)>0?1:-1)*sqrt(sq((bottom-p1y)/sin(lightAngle)) - sq(bottom-p1y));;
  y1 = sin(lightAngle)>0 ? bottom : 0;

  noStroke();
  fill(120,50 * this.alphaFraction);
  if ( sin(lightAngle)>0 ) {

    x0 = p0x + (cos(lightAngle)>0?1:-1)*sqrt(sq((bottom-p0y)/sin(lightAngle)) - sq(bottom-p0y));
    y0 = sin(lightAngle)>0 ? bottom : 0;
    x1 = p1x + (cos(lightAngle)>0?1:-1)*sqrt(sq((bottom-p1y)/sin(lightAngle)) - sq(bottom-p1y));;
    y1 = sin(lightAngle)>0 ? bottom : 0;

    quad(p0x,p0y,p1x,p1y,x1,y1,x0,y0);

  } else {
    x0 = p0x + (cos(lightAngle)>0?1:-1)*sqrt(sq((p0y)/sin(lightAngle)) - sq(p0y));
    y0 = sin(lightAngle)>0 ? bottom : 0;
    x1 = p1x + (cos(lightAngle)>0?1:-1)*sqrt(sq((p1y)/sin(lightAngle)) - sq(p1y));;
    y1 = sin(lightAngle)>0 ? bottom : 0;


    //quad(p1x,p1y,p0x,p0y,x1,y1,x0,y0);
    quad(p0x,p0y,p1x,p1y,x1,y1,x0,y0);


  }
  //rect(p0x,p0y,p1x-p0x,height-p0y);

  // stroke(120,50);
  // line(p0x,p0y,x0,y0);
  // line(p1x,p1y,x1,y1);

};

//-----
//-----

var pointerStartedX;
var globalSpeed0;
var displaySpeedControl = false;

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
