var particleArr = [];
var spaceRotationAngle = 0;

function setup() {
  // uncomment this line to make the canvas the full size of the window
  createCanvas(windowWidth, windowHeight);

  initBackgroundStars();
  //initAttractors();

  //window.setTimeout( launchParticle, Math.random()*1000*5 );
  // window.setTimeout( resetArcArr, random()*1000*5 );
}

function draw() {
  // draw stuff here
  //ellipse(width/2, height/2, 50, 50);
  background(0);
  
  translate( windowWidth/2, windowHeight/2 );
  rotate( spaceRotationAngle );
  spaceRotationAngle += PI/4000.0;
  translate( -windowWidth/2, -windowHeight/2 );

  drawBackgroundStars();

  updateAttractors();

  //updateParticles();

  // if ( keyIsPressed === true ) {
  //   saveCanvas('CirclesColourful','png');
  // }
}

var paused = false;
var pausedAtTime;

function keyPressed() {
  if ( key === ' ' ) {
    if ( !paused ) {
      noLoop();
      createjs.Ticker.paused = true;
      paused = true;
      pausedAtTime = millis();
    } else {
      // restore timer related variables
      var pausedDuration = millis() - pausedAtTime;
      timeToLaunchNewAttractor += pausedDuration;
      attractorArr.forEach( function(item) {
        item.correctStartTimeByDuration( pausedDuration );
      });
      createjs.Ticker.paused = false;
      loop();
      paused = false;
    }
  } else if ( key === 'S' ) {
    saveCanvas('CirclesColourful','png');
  }
}

var backgroundStarsArr = [];
var starFieldWidth;
function initBackgroundStars() {
  starFieldWidth = Math.max(windowWidth,windowHeight);
  var maxNumStars = 50;
  for ( var i=0; i < maxNumStars; i++ ) {
    backgroundStarsArr.push( new DistantStar() );
  }
}
function drawBackgroundStars() {
  backgroundStarsArr.forEach( function(star) {
    star.draw();
  });
}

function DistantStar() {
  var size = random(1,10);
  var px = random(-starFieldWidth/2, starFieldWidth*1.5);
  var py = random(-starFieldWidth/2, starFieldWidth*1.5);
  this.draw = function() {
    noStroke();
    fill(255);
    ellipse( px, py, size, size );
  }
}

var attractorArr = [];
var mainAttractor = undefined;
function getMainAttractor() {
  return mainAttractor;
}

function initAttractors() {
  newAttractor();
}

function newAttractor() {
  var a = new Attractor();
  mainAttractor = a;
  attractorArr.push( a );
}

var timeToLaunchNewAttractor = 0;

function updateAttractors() {

  if ( timeToLaunchNewAttractor < millis() ) {
    timeToLaunchNewAttractor = millis() + random(0,3000);
    newAttractor();
  }

  attractorArr.forEach( function( attractor ) {
    attractor.update( function(state) {
      if ( state == AttractorState.SECONDARY ) {
        //newAttractor();
      }
    });
  });

  // // draw lines from between attractor centers
  // push();
  // noFill();
  // stroke(255,100);
  // strokeWeight(1);
  // beginShape();
  // attractorArr.forEach( function( attractor ) {
  //   var xy0 = attractor.getXY();
  //   vertex( xy0.x, xy0.y );
  // });
  // endShape();
  // pop();

  attractorArr = attractorArr.filter( function(a) {
    if ( a.getState() != AttractorState.EXPIRED ) {
      return true;
    }
    return false;
  });

}

var AttractorState = {
  PRIMARY: 1,
  SECONDARY: 2,
  EXPIRED: 3
};

function Attractor() {

  var _state = undefined;
  this.getState = function() {
    return _state;
  }

  var arcDefArr;
  var discArr;

  var xy0; // = new p5.Vector(windowWidth/2,windowHeight/2);
  this.getXY = function() {
    return xy0;
  }

  //var d; // = windowWidth/4;
  var ultimateDiameter;
  var durationToUltimateDiameter;

  var param = {
    diameter: undefined,
    alpha: undefined,
    velocity: undefined
  };

  var startTime;
  var primaryLifetime;
  var secondaryLifetime;

  var starSize = random(5,20);

  this.correctStartTimeByDuration = function( duration ) {
    startTime += duration;
  }

  function drawStar() {
    noFill();
    stroke(255,param.alpha);
    strokeWeight(5);
    line( xy0.x - starSize, xy0.y, xy0.x + starSize, xy0.y );
    line( xy0.x, xy0.y - starSize, xy0.x, xy0.y + starSize );
  }

  function init() {

    _state = AttractorState.PRIMARY;

    startTime = millis();
    primaryLifetime = random(3000,7000);
    secondaryLifetime = 10000;//random(5000,10000);

    xy0 = new p5.Vector(
      windowWidth/2+random(-windowWidth/3,windowWidth/3),
      windowHeight/2+random(-windowHeight/3,windowHeight/3));
    
    ultimateDiameter = windowWidth/floor(random(1,6));
    durationToUltimateDiameter = 1000;
    if ( ultimateDiameter >= windowWidth/2 ) {
      durationToUltimateDiameter *= 4;
    } else if ( ultimateDiameter >= windowWidth/3 ) {
      durationToUltimateDiameter *= 3;
    } else if ( ultimateDiameter >= windowWidth/4 ) {
      durationToUltimateDiameter *= 2;
    }

    var maxSpeed = 0.5 * windowWidth/ultimateDiameter;
    var ultimateVelocity = new p5.Vector(random(-maxSpeed,maxSpeed), random(-maxSpeed,maxSpeed));
    param.velocity = new p5.Vector(0, 0);

    //d = windowWidth/floor(random(1,6));
    param.diameter = 0;
    param.alpha = 0;
    param.startingUp = true;
    //createjs.Tween.get(param).to({diameter:ultimateDiameter, alpha:255},500,createjs.Ease.cubicOut);
    var flashStar = createjs.Tween.get(param, {loop:true}).to({alpha:128}).wait(50).to({alpha:0}).wait(50);
    createjs.Tween.get(param)
      .wait(500).call(function(){
        flashStar.pause();
      })
      .set({startingUp: false}, param)
      .to({diameter:ultimateDiameter, alpha:255}, durationToUltimateDiameter, createjs.Ease.cubicOut);
    createjs.Tween.get(param.velocity).to({x:ultimateVelocity.x, y:ultimateVelocity.y},1000,createjs.Ease.cubicOut);

    discArr = [];

    var numDiscs = round( Math.random()*2 ) + 1;
    for ( var i=0;i<numDiscs;i++ ) {
      var disc = {
        discSizeFactor : Math.random()*2 +1, //+ 0.1,
        //discColor : color(255), //color(Math.random()*250, Math.random()*255, Math.random()*255) //color(Math.random()*255, Math.random()*255, Math.random()*255)
        discColor : color(Math.random()*250, Math.random()*255, Math.random()*255) //color(Math.random()*255, Math.random()*255, Math.random()*255)
      };
      discArr.push( disc );
    }
    discArr.sort(function compare(a,b) {
      if (a.discSizeFactor > b.discSizeFactor) {
        return -1;
      }
      return 1;
    });

    arcDefArr = [];

    var numArcs = 0;//floor(random(0,2));

    for (var i=0;i<numArcs;i++) {

      var newArcDef =
        { arcDirection : 1,
          arcSpeedFactor : Math.random()*4-2,
          arcLengthFactor : Math.random()*3,
          //arcLengthFactorDelta : (Math.random() * 2 - 1) / 100,
          dFactor : Math.random()*2 + 0.1,
          //strokeWeightFactor : Math.random()*6,
          strokeWeightFactor : Math.random()*10,

          strokeColor : color(255) //color(Math.random()*255, Math.random()*255, Math.random()*255, 200)
        };

      if ( newArcDef.dFactor < 0.3 ) {
        newArcDef.strokeWeightFactor = Math.min( newArcDef.strokeWeightFactor, 1 );
      }

      arcDefArr.push( newArcDef );

    }

  }

  init();


  this.update = function( stateChangeCB ) {

    push();
    
    if ( ultimateDiameter >= windowWidth/2 ) {
      blendMode( BURN );
    } else {
      blendMode( SCREEN );

    }

    if ( _state == AttractorState.PRIMARY || _state == AttractorState.PRIMARY_ENDING ) {

      xy0.add( param.velocity );

      if ( !param.startingUp ) {

        noStroke();

        var d = param.diameter;

        discArr.forEach( function(item) {
          //item.discColor[3] = param.alpha;
          fill( item.discColor );
          ellipse(xy0.x, xy0.y, d*item.discSizeFactor, d*item.discSizeFactor);
        });

        noFill();
        var strokeWeight0 = 10;

        arcDefArr.forEach( function(item) {

          // adjust arcLengthFactor
          //item.arcLengthFactor += item.arcLengthFactorDelta;

          dFactor = item.dFactor;
          arcLengthFactor = item.arcLengthFactor;
          arcSpeedFactor = item.arcSpeedFactor;
          arcDirection = item.arcDirection;
          strokeWeightFactor = item.strokeWeightFactor;

          //item.strokeColor[3] = param.alpha;
          stroke( item.strokeColor );
          //stroke(200,50,50);

          strokeWeight(strokeWeight0*strokeWeightFactor);

          arc(xy0.x, xy0.y, d * dFactor, d * dFactor, arcLengthFactor * HALF_PI + arcDirection * arcSpeedFactor/dFactor * millis()/1000, arcLengthFactor * PI + arcDirection * arcSpeedFactor / dFactor * millis()/1000);

        });

      }

      drawStar();

      if ( _state == AttractorState.PRIMARY && millis() > startTime + primaryLifetime ) {

        // target.alpha = 0;
        // createjs.Tween.get(target).to({alpha:1}, 1000).call(handleComplete);
        // function handleComplete() {
        //     //Tween complete
        // }

        _state = AttractorState.PRIMARY_ENDING;

        createjs.Tween.get(param).to({diameter:0,alpha:0},500,createjs.Ease.cubicIn).call( function(){
          param.alpha = 200;
          createjs.Tween.get(param).to({alpha:0},secondaryLifetime);
          _state = AttractorState.SECONDARY;
          stateChangeCB( _state );
        });

      }

    } else if ( _state == AttractorState.SECONDARY ) {

      // noFill();
      // stroke(0,50);
      // strokeWeight(5);
      // var starSize = 20;
      // //var starWeight = 10;
      // line( xy0.x - starSize, xy0.y, xy0.x + starSize, xy0.y );
      // line( xy0.x, xy0.y - starSize, xy0.x, xy0.y + starSize );

      // fill(0,50);
      // noStroke();
      // ellipse( xy0.x - starSize, xy0.y, starWeight, starWeight );
      // ellipse( xy0.x + starSize, xy0.y, starWeight, starWeight );
      // ellipse( xy0.x, xy0.y - starSize, starWeight, starWeight );
      // ellipse( xy0.x, xy0.y + starSize, starWeight, starWeight );
      
      // noStroke();
      // fill(255-param.alpha);
      // ellipse( xy0.x, xy0.y, starSize*2, starSize*2 );

      drawStar();

      if ( millis() > startTime + primaryLifetime + secondaryLifetime ) {
        _state = AttractorState.EXPIRED;
        stateChangeCB( _state );
      }

    } else {



    }

    // noFill();
    // stroke(255,param.alpha);
    // strokeWeight(5);
    // //var starWeight = 10;
    // line( xy0.x - starSize, xy0.y, xy0.x + starSize, xy0.y );
    // line( xy0.x, xy0.y - starSize, xy0.x, xy0.y + starSize );

    pop();


    
  };

}
  // var dFactor = 0.9;
  // var arcLengthFactor = 0.2;
  // var arcSpeedFactor = -1.5;
  // var arcDirection = -1;
  // var strokeWeightFactor = 3;

  // stroke(0);
  // strokeWeight(strokeWeight0*strokeWeightFactor);
  // arc(x0, y0, d, d, arcLengthFactor * HALF_PI + arcDirection * arcSpeedFactor * millis()/1000, arcLengthFactor * PI + arcDirection * arcSpeedFactor * millis()/1000);

var Particle = function() {
  var that = this;
  that.kill = false;
  that.killTimeoutID = undefined;
  var posXY = undefined;
  var velXY = undefined;
  var history = [];

  var dottedLineLength = random(1,100);
  var solidLine = false; //floor(random(0,10)) < 5 ? true : false;
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

    var mainAttractor = getMainAttractor();
    var xy0 = mainAttractor.getXY();

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
  //window.setTimeout( launchParticle, Math.random()*1000*5 );
}

var timeToLaunchNextParticle = 0;

function updateParticles() {
  if ( millis() > timeToLaunchNextParticle ) {
    launchParticle();
    timeToLaunchNextParticle = millis() + random(0,5000);
  }
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


