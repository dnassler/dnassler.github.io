var x0;
var y0;
var xy0;
var arcDefArr = [];
var discArr = [];
var particleArr = [];

function setup() {
  // uncomment this line to make the canvas the full size of the window
  createCanvas(windowWidth, windowHeight);
  x0 = windowWidth/2;
  y0 = windowHeight/2;
  xy0 = new p5.Vector(x0,y0);

  //resetDiscArr();
  resetArcArr();

  window.setTimeout( launchParticle, Math.random()*1000*5 );
  // window.setTimeout( resetArcArr, random()*1000*5 );
}

function draw() {
  // draw stuff here
  //ellipse(width/2, height/2, 50, 50);
  background(255);
  noFill();

  var strokeWeight0 = 10;
  var d = windowWidth/2;

  // var dFactor = 0.9;
  // var arcLengthFactor = 0.2;
  // var arcSpeedFactor = -1.5;
  // var arcDirection = -1;
  // var strokeWeightFactor = 3;

  // stroke(0);
  // strokeWeight(strokeWeight0*strokeWeightFactor);
  // arc(x0, y0, d, d, arcLengthFactor * HALF_PI + arcDirection * arcSpeedFactor * millis()/1000, arcLengthFactor * PI + arcDirection * arcSpeedFactor * millis()/1000);

  noStroke();

  discArr.forEach( function(item) {
    fill( item.discColor );
    ellipse(x0, y0, d*item.discSizeFactor, d*item.discSizeFactor);
  });

  noFill();
  arcDefArr.forEach( function(item) {

  	// adjust arcLengthFactor
  	//item.arcLengthFactor += item.arcLengthFactorDelta;

  	dFactor = item.dFactor;
  	arcLengthFactor = item.arcLengthFactor;
  	arcSpeedFactor = item.arcSpeedFactor;
  	arcDirection = item.arcDirection;
  	strokeWeightFactor = item.strokeWeightFactor;

  	stroke( item.strokeColor );
  	//stroke(200,50,50);

  	strokeWeight(strokeWeight0*strokeWeightFactor);

  	arc(x0, y0, d * dFactor, d * dFactor, arcLengthFactor * HALF_PI + arcDirection * arcSpeedFactor/dFactor * millis()/1000, arcLengthFactor * PI + arcDirection * arcSpeedFactor / dFactor * millis()/1000);


  });

  //arcDirection = 1;
  //strokeWeightFactor = 1;

  updateParticles();

}

var nextResetArcArrTimerID;
var nextResetDiscArrTimerID;

function mousePressed() {
  if ( nextResetArcArrTimerID ) {
    window.clearTimeout( nextResetArcArrTimerID );
  }
  resetArcArr();
  // if ( nextResetDiscArrTimerID ) {
  //   window.clearTimeout( nextResetDiscArrTimerID );
  // }
  //resetDiscArr();
}

function resetDiscArr() {
  discArr = [];
  var numDiscs = round( Math.random()*3 );
  for ( var i=0;i<numDiscs;i++ ) {
    var disc = {
      discSizeFactor : Math.random()*2 + 0.1,
      discColor : color(Math.random()*250, Math.random()*255) //color(Math.random()*255, Math.random()*255, Math.random()*255)
    };
    discArr.push( disc );
  }
  discArr.sort(function compare(a,b) {
    if (a.discSizeFactor > b.discSizeFactor) {
      return -1;
    }
    return 1;
  });
  //nextResetDiscArrTimerID = window.setTimeout( resetDiscArr, Math.random()*1000*5+1000 );
}

function resetArcArr() {

  resetDiscArr();

	arcDefArr = [];

	var numArcs = round( Math.random()*10 ) + 2;

	for (var i=0;i<numArcs;i++) {

		var newArcDef =
			{ arcDirection : 1,
				arcSpeedFactor : Math.random()*4-2,
				arcLengthFactor : Math.random()*3,
				arcLengthFactorDelta : (Math.random() * 2 - 1) / 100,
				dFactor : Math.random()*2 + 0.1,
				//strokeWeightFactor : Math.random()*6,
				strokeWeightFactor : Math.random()*10,

				strokeColor : color(Math.random()*255, Math.random()*255, Math.random()*255, 200)
			};

		if ( newArcDef.dFactor < 0.3 ) {
			newArcDef.strokeWeightFactor = Math.min( newArcDef.strokeWeightFactor, 1 );
		}

		arcDefArr.push( newArcDef );

	}

	nextResetArcArrTimerID = window.setTimeout( resetArcArr, Math.random()*1000*5 + 1000 );

}

var Particle = function() {
  var that = this;
  that.kill = false;
  that.killTimeoutID = undefined;
  var posXY = undefined;
  var velXY = undefined;
  var history = [];

  var dottedLineLength = random(1,100);
  var solidLine = floor(random(0,10)) < 5 ? true : false;
  var particleColor = color(random(255),random(255),random(255));
  var particleSize = random(2,20);

  var velMax = 50;
  var velMin = 10;
  var velFactor = random(1,20);
  var G = random(100000,1000000);
  
  var init = function() {
    posXY = new p5.Vector();
    velXY = new p5.Vector();

    var particleOrigin = floor(random(0,4));
    if ( particleOrigin == 0 ) {

      posXY.x = random(windowWidth);
      posXY.y = 0;//random(windowHeight);
      // velXY.x = random(-velMin,velMin);
      velXY.x = random(-velMax,velMax);
      velXY.y = random(velMin,velMax);

    } else if ( particleOrigin == 1 ) {

      posXY.x = windowWidth;
      posXY.y = random(windowHeight);
      velXY.x = -1 * random(velMin,velMax);
      // velXY.y = random(-velMin,velMin);
      velXY.y = random(-velMax,velMax);

    } else if ( particleOrigin == 2 ) {

      posXY.x = random(windowWidth);
      posXY.y = windowHeight;
      //velXY.x = random(-velMin,velMin);
      velXY.x = random(-velMax,velMax);
      velXY.y = -1 * random(velMin,velMax);

    } else {

      posXY.x = 0;
      posXY.y = random(windowHeight);
      velXY.x = random(velMin,velMax);
      // velXY.y = random(-velMin,velMin);
      velXY.y = random(-velMax,velMax);

    }
    //velXY.div(5);

    history.push( posXY.copy() );
  };
  init();

  this.particleIsOffScreen = function() {
    if ( posXY.x > windowWidth 
      || posXY.x < 0
      || posXY.y > windowHeight
      || posXY.y < 0 ) {
      return true;
    }
    return false;
  };

  this.updatePos = function() {

    var velFracXY = p5.Vector.div(velXY, velFactor);
    posXY.add( velFracXY );
    history.push( posXY.copy() );
    var diffToCenterNorm = p5.Vector.sub(xy0,posXY).normalize();
    var distToCenter = posXY.dist( xy0 );
    var gFactor = G/velFactor;
    var pullToCenter = p5.Vector.div( p5.Vector.mult(diffToCenterNorm, gFactor), sq(distToCenter) );
    var deltaVel = pullToCenter;//p5.Vector.div(diffToCenter, distToCenter);
    //deltaVel = p5.Vector.div(deltaVel,2);
    velXY.add( deltaVel );
    if ( that.killTimeoutID === undefined && this.particleIsOffScreen() ) {
      that.killTimeoutID = window.setTimeout( function () {
        that.killTimeoutID = undefined;
        //if ( that.particleIsOffScreen() ) {
          that.kill = true;
        //}
      }, 2000);
    }
  };

  this.drawPath = function() {
    var lastXY = undefined; // holds the start point of a dotted line segment
    var pointsPerLine = 1;
    var pointsInLine = 0;
    var toggleLineDraw = false;
    push();
    noFill();
    stroke(particleColor);
    strokeWeight( particleSize );
    if ( solidLine ) {
      strokeCap( ROUND );
    } else {
      strokeCap( SQUARE );
    }
    history.forEach( function (xy) {
      if ( lastXY === undefined ) {
        lastXY = xy;
        pointsInLine += 1;
        return;
      }
      //if ( pointsInLine < pointsPerLine ) {
      //  pointsInLine += 1;
      if ( !solidLine && xy.dist(lastXY) < dottedLineLength ) {
        pointsInLine += 1;
      } else {
        if ( solidLine || toggleLineDraw ) {
          // draw line from lastXY to current xy
          line( lastXY.x, lastXY.y, xy.x, xy.y );
        }
        pointsInLine = 0;
        lastXY = xy;
        toggleLineDraw = !toggleLineDraw;
      }
      return;
    });
    //stroke(0);
    //strokeWeight(2);
    // noStroke();
    // fill(0);
    // ellipse(posXY.x,posXY.y, particleSize, particleSize);
    pop();
  };
  
};

function launchParticle() {
  var p = new Particle();
  particleArr.push( p );

  window.setTimeout( launchParticle, Math.random()*1000*5 );

}

function updateParticles() {
  particleArr = particleArr.filter( function(p) {
    if (!p.kill) {
      return true;
    }
    return false;
  })
  particleArr.forEach( function(p, index) {
    p.updatePos();
    p.drawPath();
  });
}


