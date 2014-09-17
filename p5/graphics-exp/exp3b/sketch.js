
//var img;
var bubbles = [];
var numBubblesPerRow = 10;
var numRows = 2;
var maxDirChanges = 1;
var maxRadius = 100;
var distThreshold1 = 200;
var distThreshold2 = 50;
var pg;
var globalSpeed = 0.1;
var globalMinR = 100;
var globalMaxR = 200;

var sounds = [];
var maxSounds;

var showHelpText = true;

function preload() {
  for (var i=1; i<=7; i++) {
    console.log('Sep_17_2014-011_'+i+'.mp3')
    sounds.push(loadSound('Sep_17_2014-011_'+i+'.mp3'));
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  var reverb = new p5.Reverb();
  for ( var soundIndex=0; soundIndex < sounds.length; soundIndex++ ) {
    var sound = sounds[soundIndex];
    sound.playMode('sustain');
    reverb.process( sound, 3, 2 );
  }
  maxSounds = sounds.length;
  //sounds[0].play();

  for ( var rowNum = 0; rowNum<numRows; rowNum++ ) {
    for ( var i=0; i<numBubblesPerRow*2; i++ ) {
      bubbles.push( new Bubble((i%numBubblesPerRow)*width/numBubblesPerRow, numRows===1 ? height/2 : height/(numRows-1)*rowNum, random(100), i) );

    }

  }

  textFont("sans-serif");
  textSize(30);
  textAlign(CENTER);

  rectMode(CENTER);
  ellipseMode(CENTER);

  pg = createGraphics(width,height);
  pg.rectMode(CENTER);
  pg.ellipseMode(CENTER);
  pg.background(255);
  //pg.clear();
  pg.noStroke();
  //pg.fill(0,0,255,255);
  //pg.rect(0,0,width,500);
  // img.mask(pg);
  // image( img, 0, 0 );
  // noLoop();

  window.setTimeout(function() { showHelpText = false; }, 5000);
}

function draw() {

  background(255);
  pg.background(255,50);
  image(pg,0,0);

  var bubble;
  for ( var i=0; i<bubbles.length; i++ ) {
    bubble = bubbles[i];
    bubble.evolve();
    //bubble.display();
  }
  for ( var i=0; i<bubbles.length; i++ ) {
    bubble = bubbles[i];
    var currentConnections = 0;
    // var connectionsThreshold1Arr = [];
    if ( bubble.isMoving ) {
      for ( var j=0; j<bubbles.length; j++ ) {
        if ( i === j ) continue;
        bubble2 = bubbles[j];
        if ( bubble2.isMoving ) {
          var d = dist( bubble.x, bubble.y, bubble2.x, bubble2.y );

          if ( d < distThreshold1 ) {
            stroke(100,0,50,20);
            line( bubble.x, bubble.y, bubble2.x, bubble2.y );
            currentConnections += 1;
            //connectionsThreshold1Arr.push( j );
          }
        }
      }
      // if ( currentConnections < bubble.numConnections && currentConnections === 0 ) {
      //   var soundIndex = floor(random(maxSounds));
      //   sounds[soundIndex].play();
      //
      // }
    }
    bubble.numConnections = currentConnections;

    // if ( connectionsThreshold1Arr.length >= 3 ) {
    //   var minx, miny, maxx, maxy;
    //   minx = bubble.x;
    //   miny = bubble.y;
    //   maxx = bubble.x;
    //   maxy = bubble.y;
    //   for ( var ci=0; ci<connectionsThreshold1Arr.length; ci++ ) {
    //     var bubbleConnectedIndex = connectionsThreshold1Arr[ci];
    //     var bubbleConnected = bubbles[bubbleConnectedIndex];
    //     if ( bubbleConnected.x < minx ) {
    //       minx = bubbleConnected.x;
    //     }
    //     if ( bubbleConnected.y < miny ) {
    //       miny = bubbleConnected.y;
    //     }
    //     if ( bubbleConnected.x > maxx ) {
    //       maxx = bubbleConnected.x;
    //     }
    //     if ( bubbleConnected.y > maxy ) {
    //       maxy = bubbleConnected.y;
    //     }
    //   }
    //   fill(0,0,0,5);
    //   noStroke();
    //   rect((maxx-minx)/2+minx,(maxy-miny)/2+miny,abs(maxx-minx)+100,abs(maxy-miny)+100);
    // }
  }
  for ( var i=0; i<bubbles.length; i++ ) {
    bubble = bubbles[i];
    bubble.display();
  }

  if ( showHelpText ) {
    fill(0);
    text("touch to control speed", width/2, height/2);
  }

  if ( displaySpeedControl ) {
    drawSpeedControl();
  }
}

function Bubble(inX,inY,inR, inIndex) {
  this.i = inIndex;
  this.x = this.x0 = inX;
  this.y = this.y0 = inY;
  this.r = inR;

  this.expSpeed = random(1,10);
  this.color = color(random(255),random(255), random(255), 150);
  this.maxR = random(globalMinR,globalMaxR);
  this.turnY = random(200,(height-200));
  //this.targetBubble = null;
  this.isMoving = false;
  this.vx = this.vx2 = 0;
  this.vy = this.vy2 = 0;
  this.numDirChanges = 0;
}
Bubble.prototype.evolve = function() {
  if ( this.isMoving ) {
    if ( this.vx2 !== this.vx ) {
      this.vx += (this.vx2-this.vx)/10.0;
    }
    if ( this.vy2 !== this.vy ) {
      this.vy += (this.vy2-this.vy)/10.0;
    }
    this.x += this.vx * globalSpeed;
    this.y += this.vy * globalSpeed;
    if ( this.x < 0 || this.x > width || this.y < 0 || this.y > height ) {
      var soundIndex = floor(random(maxSounds));
      sounds[soundIndex].play();

      this.reset();
      return;
    }
    if ( abs(this.y-this.y0) > this.turnY && this.numDirChanges < maxDirChanges ) {
      this.numDirChanges += 1;
      // if ( this.numDirChanges > 1 ) {
      //   //this.reset();
      //   return;
      // }
      // exchange vertical velocity with horizontal velocity and vice/versa
      if ( this.vx == 0 ) {
        this.vx2 = this.vy * (random(2)<1 ? -1 : 1);
        this.vy2 = 0;
      } else {
        this.vy2 = this.vx * (random(2)<1 ? -1 : 1);
        this.vx2 = 0;
      }
    }
  } else {
    this.r += this.expSpeed * globalSpeed;
    if ( this.r > this.maxR ) {

      // var soundIndex = floor( maxSounds*(this.r - globalMinR)/globalMaxR ); //floor(random(maxSounds));
      // sounds[soundIndex].play();

      this.r = random(5,20);
      this.startMoving();
    }
  }
};
Bubble.prototype.startMoving = function() {
  this.isMoving = true;
  this.vx = this.vy = 0;
  this.vy2 = random(10,20)*(random(2)<1 ? -1 : 1);
  if ( this.y === 0 ) {
    this.vy2 = abs(this.vy2);
  } else if ( this.y === height ) {
    this.vy2 = -abs(this.vy2);
  }
}
Bubble.prototype.reset = function() {
  this.r = 0;
  this.x = this.x0;
  this.y = this.y0;
  this.vx = this.vx2 = this.vy = this.vy2 = 0;
  this.expSpeed = random(1,10);
  this.isMoving = false;
  this.numDirChanges = 0;

  this.color = color(random(255),random(255), random(255), 150);
  this.maxR = random(globalMinR,globalMaxR);
  this.turnY = random(200,(height-200));
  this.numConnections = 0;

}
Bubble.prototype.display = function() {
  //fill( 0,100,255, 100 );
  //stroke( 0,120,200, 255 );
  noStroke();
  fill( this.color );
  if ( this.isMoving ) {
    pg.fill( 220 );
    //pg.rect( this.x, this.y, this.r*2, this.r*2 );
    pg.ellipse( this.x, this.y, this.r*2, this.r*2 );

  }
  //rect( this.x, this.y, this.r*2, this.r*2 );
  ellipse( this.x, this.y, this.r*2, this.r*2 );

};

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
  for (var i = 0; i < floor(100*globalSpeed); i++) {
    rect(left+i*controlStepWidth,height/2,controlStepWidth*0.5,100);
  }
};
