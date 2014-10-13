
window.onresize = function() {
  checkOrientation();
};
var checkOrientation = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  var dw0 = displayWidth;
  var dh0 = displayHeight;
  var dw;
  var dh;
  if ( w > h ) {
    console.log('landscape');
    // due to bug displayWidth always shows the portrait width so double check the dw0/dh0
    if ( dw0 > dh0 ) {
      dw = dw0;
      dh = dh0;
    } else {
      dw = dh0;
      dh = dw0;
    }
  } else {
    console.log('portrait');
    if ( dw0 < dh0 ) {
      dw = dw0;
      dh = dh0;
    } else {
      dw = dh0;
      dh = dw0;
    }
  }
  console.log('correctedWidth='+dw+', correctedHeight='+dh+', w='+w+', h='+h+', displayWidth='+dw0+", displayHeight="+dh0+", window.innerWidth="+window.innerWidth+", window.innerHeight="+window.innerHeight);
  return {width:dw,height:dh};
};
var isFullscreen = false;

function setup() {
  isFullscreen = (window.orientation !== undefined) ? true: fullscreen(); // if iphone/ipad/iOS fullscreen(true) doesn't work
  var displaySize = checkOrientation();
  createCanvas(displaySize.width, displaySize.height);

  ImgMgr.instance = new ImgMgr();
}

// var mousePressed = touchStarted = function() {
//   console.log("touch/mouse");
//   if ( !isFullscreen ) {
//     isFullscreen = true;
//     try {
//       fullscreen(isFullscreen);
//     } catch ( ex1 ) {
//     	console.log('error occurred:'+ex1);
//     }
//   }
// };

function draw() {

  // put drawing code here
  background(0);

  if ( !isFullscreen ) {
    stroke(255);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("click to view fullscreen properly",width/2,height/2);
  }

  ImgMgr.instance.update();
  ImgMgr.instance.draw();

  if ( displaySpeedControl ) {
    drawSpeedControl();
  }
  
  if ( newGlobalSpeed > 0 ) {
    globalSpeed += (newGlobalSpeed - globalSpeed)/100;
  } else if ( newGlobalSpeed == 0 && millis() < timeBrakesStarted + timeToStopMS ) {
    console.log('Brakes: speedWhenBrakesStarted = '+speedWhenBrakesStarted+', newGlobalSpeed = 0, globalSpeed = '+globalSpeed+', timeToStopMS = '+timeToStopMS);
    globalSpeed = Math.easeOutCubic( 
      millis() - timeBrakesStarted, speedWhenBrakesStarted, -speedWhenBrakesStarted, 
      timeToStopMS );
  }

}

function ImgMgr() {

  var size = width;

  var velocity = 200;

  var lightLength = random(size/10,size/5);
  var lightHeight = random(height/10,size/5);
  var lightColor1 = color(255,100,0);
  var lightColor2 = color(100,255,100);
  var lightColorX = random(1);
  var lightColor = lerpColor(lightColor1,lightColor2,lightColorX);
  var lightColor2 = lerpColor(lightColor1,lightColor2,random(1));
  var lightX = -1000;
  var lightDistX = random(size);
  var lightY = random(size);

  var pillarX = -1000;
  var pillarLength = random(size/5,size*2);
  var pillarDist = random(size);

  var changeLightAt = 0;
  var changePillarAt = 0;



  var tunnelLight = {
    type: 'tunnelLight',
    order: 1,
    color: color(200,200,50),
    color2: color(200,200,50,50), // normal illumination full
    color2b: color(200,200,50,45), // normal illumination sublte flicker
    width: width*0.25,
    height: height*0.05,
    y: height/10
  };

  var tunnelWires = {
    type: 'tunnelWires',
    order: -1,
    width: width,
    height: height*0.025,
    y: height*0.36, 
    color: color(15)
  };

  var tunnelWalkway = {
    type: 'tunnelWalkway',
    order: -2,
    width: width,
    height: height*0.2,
    color: color(10),
    tunnelWalkwayLightWireColor: color(5),
    tunnelWalkwayLightWireY: height*0.87,
    tunnelWalkwayLightWireWidth: height*0.017/4
  };

  var tunnelDoor = {
    type: 'tunnelDoor',
    order: -1,
    width: width*0.1,
    height: height*0.3,
    y: height*0.5,
    doorColor: color(5),
    doorBorderWidth: height*0.025,
    doorBorderColor: color(15),
    doorLightColor: color(50,50,255),
    doorLightWidth: height*0.0125
  };


  var tunnelWalkwayLight = {
    type: 'tunnelWalkwayLight',
    order: -0.5,
    width: height*0.017,
    height: height*0.015,
    y: height*0.9,
    color: color(255),
    tunnelWalkwayLightWireColor: color(5)
  };

  var pillar = {
    type: 'pillar',
    order: 0,
    color: color(50),
    height: height,
    width: height*0.1,
    pillarCount: 0,
    pillarLightColor: color(50,50,255,50),
    pillarLightIllumColor: color(100,100,200,50),
    pillarLightY: height*0.75,
    pillarLightWidth: height*0.025,
    pillarLightHeight: height*0.035,
    pillarLightWireColor: color(45)
  };

  var topSupport = {
    type: 'topSupport',
    order: 0,
    width: width,
    height: height*0.2+20,
    color: color(50)
  }

  var trafficLight = {
    type: 'traffic',
    order: 2,
    color: color(200,0,0),
    redLight: color(200,0,0),
    redLightFlashingOff: color(50,0,0),
    yellowLight: color(200,200,0),
    greenLight: color(0,200,0),
    width: height*0.1,
    height: height*0.1,
    y: height/2,
    lightPostColor: color(20),
    lightPostWidth: height*0.025,
    lightPostLightBorder: height*0.025
  }

  var pillarInStation = {
    type: 'pillarInStation',
    order: 0,
    color: color(100),
    height: height,
    width: height*0.1
  };

  var stationLight = {
    type: 'stationLight',
    order: 1,
    color: color(255,255,200),
    color2: color(255,255,200,50),
    color2b: color(255,255,200,40),
    width: height*0.1,
    height: height*0.1,
    y: height/20
  };

  var stationPlatform = {
    type: 'stationPlatform',
    order: -1,
    wallColor: color(100,150,100),
    wallDecorColor: color(50,100,50),
    wallDecorBorderColor: color(25,50,25),
    width: width
  };

  var stationDecor = {
    type: 'stationDecor',
    order: -0.5,
    width: width*0.6,
    wallDecorColor: color(50,100,50),
    wallDecorBorderColor: color(25,50,25)

  };

  var stationAds = {
    type: 'stationAds',
    order: 1,
    adColor: color(120),
    adBorderColor: color(20),
    adBorderThickness: height*0.025,
    width: width*0.3,
    height: height*0.3,
    y: height*0.3
  };


  var periodicTunnelArr = [
    {thing:pillar, period:0.3, nextTunnelPos:0.1}, 
    {thing:tunnelLight, period:1.2, nextTunnelPos:0.1},
    {thing:trafficLight, period:5, nextTunnelPos:0.1},
    {thing:tunnelWires, period:1, offset:0, nextTunnelPos:0},
    {thing:tunnelWalkway, period:1, offset:0, nextTunnelPos:0},
    {thing:tunnelWalkwayLight, period: 0.22, nextTunnelPos:0.05},
    {thing:tunnelDoor, period:2.13, nextTunnelPos:1.3}
    ];
  var periodicStationArr = [
    {thing:pillarInStation, period:0.2, nextTunnelPos:2.0}, 
    {thing:stationLight, period:0.25, nextTunnelPos:2.1},
    {thing:stationPlatform, period:1, nextTunnelPos:2},
    {thing:stationAds, period:0.75, nextTunnelPos:2.1},
    {thing:stationDecor, period:1.35, offset:0.2, nextTunnelPos:2.5}
  ];
  var isInTunnel = true;

  //var tunnelAheadArr = [];
  var tunnelCurrentArr = [];

  var TRAFFIC_LIGHT_RED_FLASHING_THRESHOLD = 5;
  var TRAFFIC_LIGHT_RED_THRESHOLD = 10;
  var TRAFFIC_LIGHT_YELLOW_THRESHOLD = 20;

  var TRAFFIC_LIGHT_COLOR_CODE_RED = 'red';
  var TRAFFIC_LIGHT_COLOR_CODE_RED_FLASHING = 'red_flashing';
  var TRAFFIC_LIGHT_COLOR_CODE_YELLOW = 'yellow';
  var TRAFFIC_LIGHT_COLOR_CODE_GREEN = 'green';

  var getTrafficLightStatus = function() {
    var status = {};
    var distToNextTrain = nextTrainPos - tunnelPos;
    if ( distToNextTrain < TRAFFIC_LIGHT_RED_FLASHING_THRESHOLD ) {
      status.colorCode = TRAFFIC_LIGHT_COLOR_CODE_RED_FLASHING;
    } else if ( distToNextTrain < TRAFFIC_LIGHT_RED_THRESHOLD ) {
      status.colorCode = TRAFFIC_LIGHT_COLOR_CODE_RED;
    } else if ( distToNextTrain < TRAFFIC_LIGHT_YELLOW_THRESHOLD ) {
      status.colorCode = TRAFFIC_LIGHT_COLOR_CODE_YELLOW;
    } else {
      status.colorCode = TRAFFIC_LIGHT_COLOR_CODE_GREEN;
    }
    return status;
  };

  var nextId = 0;
  var getNextId = function() {
    nextId += 1;
    return nextId;
  }
  var RealizedThing = function( thingInfoIn ) {
    this.id = getNextId();
    var thing = thingInfoIn.thing;
    var xPos = width + (thingInfoIn.nextTunnelPos - tunnelPos)*tunnelPosFactor;
    this.order = thing.order;

    var info = {};
    var normalFlickerAt=0;
    var flickerLightAt;
    var flickerLightState = false;
    if ( thing.type == 'tunnelLight' ) {
      if ( random(10)<1 ) {
        // flicker some tunnel lights but not all and flicker them at a random interval
        flickerLightAt = millis() + random(50,200);        
      }
    } else if ( thing.type == 'pillar' ) {
      thing.pillarCount += 1;
      if ( thing.pillarCount >= 4) {
        info.pillarHasLight = true;
        thing.pillarCount = 0;
      }
    }

    var updateTrafficLightStatus = function() {
      var status = getTrafficLightStatus();
      if ( !trafficLightStatusInfo || trafficLightStatusInfo.colorCode != status.colorCode ) {
        trafficLightStatusInfo = status;
        if ( status.colorCode == TRAFFIC_LIGHT_COLOR_CODE_RED_FLASHING ) {
          trafficLightStatusInfo.toggleFlashStateAt = millis()+500;
          trafficLightStatusInfo.flashState = true;
        }
      }
      if ( status.colorCode == TRAFFIC_LIGHT_COLOR_CODE_RED_FLASHING ) {
        if ( millis() > trafficLightStatusInfo.toggleFlashStateAt ) {
          trafficLightStatusInfo.toggleFlashStateAt = millis()+500;
          trafficLightStatusInfo.flashState = !trafficLightStatusInfo.flashState;
        }
      }
    };

    var trafficLightStatusInfo = null;
    if ( thing.type == 'traffic' ) {
      updateTrafficLightStatus();
    }

    var updateTunnelLight = function() {
      if ( flickerLightAt && millis() > flickerLightAt ) {
        flickerLightAt = millis() + random(50,200);
        flickerLightState = !flickerLightState;
      }
    }

    var updatePos = function() {
      xPos -= velocity * globalSpeed;
    }
    this.isPassed = function() {
      if ( xPos + thing.width < -width ) {
        return true;
      }
      return false;
    }
    this.isVisible = function() {
      if ( xPos + thing.width < -width || xPos > width*2) {
        return false;
      }
      return true;
    };
    this.update = function() {
      updatePos();
      if ( thing.type == 'traffic' ) {
        //trafficLightStatusInfo = getTrafficLightStatus();
        updateTrafficLightStatus();
      } else if ( thing.type == 'tunnelLight' ) {
        updateTunnelLight();
      }
    };
    this.draw = function() {
      if ( !this.isVisible() ) {
        return;
      }
      if ( thing.type == 'tunnelLight' ) {
        // fill(lightColor2);
        // rect(pillarX+pillarLength/2-200,topSupportY-150,400,70);
        if ( flickerLightState ) {

          //noStroke();
          fill( thing.color2 );
          //rect( xPos-(thing.width*1.5-thing.width)/2, thing.y-(thing.height*2-thing.height)/2, thing.width*1.5, thing.height*2 );
          strokeWeight(1);
          stroke( thing.color );
          rect( xPos, thing.y, thing.width, thing.height );

        } else {

          noStroke();
          if ( normalFlickerAt < millis() ) {
            normalFlickerAt = millis() + 50;
            info.normalFlicker = !info.normalFlicker;
          }
          fill( info.normalFlicker ? thing.color2b : thing.color2 );
          rect( xPos-(thing.width*3-thing.width)/2, thing.y-(thing.height*5-thing.height)/2, thing.width*3, thing.height*6 );
          fill( thing.color );
          rect( xPos, thing.y, thing.width, thing.height );
        }

      } else if ( thing.type == 'tunnelWalkwayLight' ) {

        push();
        //strokeWeight(thing.height);
        //stroke(thing.color);
        //line(xPos,thing.y,xPos+thing.width,thing.y);
        rectMode(CENTER);
        fill(thing.tunnelWalkwayLightWireColor);
        strokeWeight(thing.width/4);
        stroke(thing.tunnelWalkwayLightWireColor);
        line( xPos,thing.y, xPos, thing.y-thing.height*2);
        rect( xPos,thing.y-thing.height*2, thing.width/2, thing.height/2);
        fill(thing.color);
        rect( xPos,thing.y, thing.width, thing.height);
        pop();

      } else if ( thing.type == 'tunnelWalkway' ) {

        noStroke();
        fill( thing.color );
        rect( xPos, height-thing.height, thing.width, thing.height);
        stroke( thing.tunnelWalkwayLightWireColor );
        strokeWeight( thing.tunnelWalkwayLightWireWidth );
        line( xPos, thing.tunnelWalkwayLightWireY, thing.width, thing.tunnelWalkwayLightWireY );

      } else if ( thing.type == 'tunnelWires' ) {

        push();
        stroke( thing.color );
        strokeWeight( thing.height );
        line( xPos, thing.y, xPos+thing.width, thing.y );
        line( xPos, thing.y+thing.height*1.5, xPos+thing.width, thing.y+thing.height*1.5 );
        pop();

      } else if ( thing.type == 'tunnelDoor') {

        noStroke();
        fill(thing.doorBorderColor);
        rect(xPos, thing.y-thing.doorBorderWidth, thing.width+thing.doorBorderWidth*2, thing.height+thing.doorBorderWidth);
        fill(thing.doorColor);
        rect(xPos+thing.doorBorderWidth, thing.y, thing.width, thing.height);
        fill(thing.doorLightColor);
        stroke(thing.doorColor);
        rect(xPos+(thing.width+thing.doorBorderWidth*2)/2-thing.doorLightWidth/2, thing.y-thing.doorBorderWidth*2, thing.doorLightWidth, thing.doorLightWidth);

      } else if ( thing.type == 'stationDecor' ) {

        fill( thing.wallDecorColor );
        stroke( thing.wallDecorBorderColor );
        strokeWeight( height*0.05);
        rect( xPos, height*0.4, thing.width, height*0.25 );

      } else if ( thing.type == 'pillar' ) {

        noStroke();

        fill(50);
        var topSupportY = height/5;
        rect(0,0,width,topSupportY);

        fill( thing.color );
        rect( xPos, 0, thing.width, thing.height);

        if ( info.pillarHasLight ) {
          push();
          var pillarLightX = xPos+thing.width/2;
          rectMode(CORNER);
          fill(thing.pillarLightWireColor);
          rect( pillarLightX-thing.pillarLightWidth/8, thing.pillarLightY+thing.pillarLightHeight/2, 
            thing.pillarLightWidth/4, height-thing.pillarLightY );
          rectMode(CENTER);
          // fill(thing.pillarLightIllumColor);
          // triangle( pillarLightX, thing.pillarLightY, 
          //   pillarLightX-thing.pillarLightWidth*3, thing.pillarLightY-thing.pillarLightHeight*3,
          //   pillarLightX+thing.pillarLightWidth*3, thing.pillarLightY-thing.pillarLightHeight*3 );
          // triangle( pillarLightX, thing.pillarLightY, 
          //   pillarLightX-thing.pillarLightWidth*3, thing.pillarLightY+thing.pillarLightHeight*3,
          //   pillarLightX+thing.pillarLightWidth*3, thing.pillarLightY+thing.pillarLightHeight*3 );
          fill( thing.pillarLightColor );
          stroke(thing.pillarLightIllumColor);
          strokeWeight(thing.pillarLightWidth/5);
          rect( pillarLightX, thing.pillarLightY, thing.pillarLightWidth, thing.pillarLightHeight );
          pop();
        }

      } else if ( thing.type == 'traffic' ) {

        noStroke();

        var trafficLightColor;
        var status = trafficLightStatusInfo; //getTrafficLightStatus();
        if ( status.colorCode == TRAFFIC_LIGHT_COLOR_CODE_GREEN ) {
          trafficLightColor = thing.greenLight;
        } else if ( status.colorCode == TRAFFIC_LIGHT_COLOR_CODE_YELLOW ) {
          trafficLightColor = thing.yellowLight;
        } else if ( status.colorCode == TRAFFIC_LIGHT_COLOR_CODE_RED ) {
          trafficLightColor = thing.redLight;
        } else if ( status.colorCode == TRAFFIC_LIGHT_COLOR_CODE_RED_FLASHING ) {
          //trafficLightStatusInfo.flashState
          if ( trafficLightStatusInfo.flashState ) {
            trafficLightColor = thing.redLight;
          } else {
            trafficLightColor = thing.redLightFlashingOff;
          }
        }

        push();
        rectMode(CENTER);
        fill( thing.lightPostColor );
        noStroke();
        //rect( xPos, thing.y, thing.width+thing.width/5, thing.height+thing.height/5 );
        stroke( thing.lightPostColor );
        strokeWeight( thing.lightPostWidth );
        line( xPos, thing.y, xPos, height+10 );
        fill( trafficLightColor );
        strokeWeight( thing.lightPostLightBorder );
        rect( xPos, thing.y, thing.width, thing.height);
        pop();

      } else if ( thing.type == 'stationLight' ) {
      
        noStroke();
        //
        if ( normalFlickerAt < millis() ) {
          normalFlickerAt = millis() + 50;
          info.normalFlicker = !info.normalFlicker;
        }
        fill( info.normalFlicker ? thing.color2b : thing.color2 );
        //
        //fill( thing.color2 );
        rect( xPos-(thing.width*1.5-thing.width)/2, thing.y-(thing.height*1.5-thing.height)/2, thing.width*1.5, thing.height*1.5 );
        fill( thing.color );
        rect( xPos, thing.y, thing.width, thing.height );
      
      } else if ( thing.type == 'pillarInStation' ) {

        noStroke();

        fill(50);
        var topSupportY = height/5;
        rect(0,0,width,topSupportY);

        fill( thing.color );
        rect( xPos, topSupportY, thing.width, thing.height);

      } else if ( thing.type == 'stationPlatform' ) {

        push();
        rectMode(CORNER);
        noStroke();
        fill( thing.wallColor );
        rect( xPos, 0, thing.width, height*0.8);
        fill( thing.wallDecorColor );
        rect( xPos, height*0.2, thing.width, height*0.25);
        // stroke( thing.wallDecorBorderColor );
        // strokeWeight( height*0.025);
        // rect( xPos+thing.width*0.2, height*0.4, thing.width*0.5, height*0.25 );
        fill( 40 );
        noStroke();
        rect( xPos, height*0.8, thing.width, height*0.2);
        fill( 70 );
        rect( xPos, height*0.8, thing.width, height*0.05);
        pop();

      } else if ( thing.type == 'stationAds' ) {

        stroke( thing.adBorderColor );
        strokeWeight( thing.adBorderThickness );
        fill( thing.adColor );
        rect( xPos, thing.y, thing.width, thing.height);

      }

    };
  }

  var tunnelPos = 0;
  var tunnelPosFactor = width;
  var nextTrainPos = 50;
  var nextStationPos = 1;
  var tunnelResumePos;

  var updateVisibleThings = function( velocity ) {

    if ( tunnelCurrentArr.length > 0 ) {
      for (var i=tunnelCurrentArr.length-1; i>=0; i--) {
        var thing = tunnelCurrentArr[i];
        thing.update();
        if ( thing.isPassed() ) {
          // remove realized thing because it is passed
          tunnelCurrentArr.splice(i,1);
        }
      }
    }
    var thingsAhead = getThingsAhead();
    if ( thingsAhead.length > 0 ) {
      tunnelCurrentArr = tunnelCurrentArr.concat( thingsAhead );
    }

  };

  var realizePeriodicItem = function(periodicItem) {
    var r = new RealizedThing( periodicItem );
    periodicItem.nextTunnelPos += periodicItem.period;
    //tunnelCurrentArr.push( r );
    return r;
  }

  var getThingsAhead = function() {
    var newThingsArr = [];

    if ( isInTunnel ) {

      periodicTunnelArr.forEach(function(periodicItem){
        if ( periodicItem.nextTunnelPos <= tunnelPos+1 ) {
          newThingsArr.push( realizePeriodicItem( periodicItem ) );
        }
      });

    } else {

      periodicStationArr.forEach(function(periodicItem){
        if ( periodicItem.nextTunnelPos <= tunnelPos+1 ) {
          newThingsArr.push( realizePeriodicItem( periodicItem ) );
        }
      });

    }

    return newThingsArr;

    // if ( tunnelAheadArr.length > 0 ) {

      // while ( tunnelAheadArr[0].pos <= tunnelPos ) {
      //   var thing = tunnelAheadArr.shift();

      //   thing.x = width + (thing.pos-tunnelPos)*posFactor;
        
      //   thingsArr.push( thing );
      // }

    // }

    //return thingsArr;
  };

  this.updateThings = function() {

    if ( isInTunnel && tunnelPos >= nextStationPos ) {
      // go into station
      isInTunnel = false;
      var stationStartPos = nextStationPos;
      tunnelResumePos = stationStartPos + 5;
      periodicStationArr.forEach(function(periodicItem){
        var offset = periodicItem.offset;
        if ( !offset ) {
          offset = 0;
        }
        periodicItem.nextTunnelPos = stationStartPos+1.25+offset;
      });

    } else if ( !isInTunnel && tunnelPos >= tunnelResumePos ) {
      isInTunnel = true;
      nextStationPos = tunnelResumePos + 30;
      periodicTunnelArr.forEach(function(periodicItem){
        var offset = periodicItem.offset;
        if ( !offset ) {
          offset = 0;
        }
        periodicItem.nextTunnelPos = tunnelResumePos+1.5+offset;
      });

    }

    updateVisibleThings();

    tunnelPos += velocity * globalSpeed/ tunnelPosFactor;
    if ( tunnelPos > nextTrainPos+10 ) {
      // we've "gone through" the train so reset the nextTrainPos to the next train...
      nextTrainPos = tunnelPos + 50;
    }

    // lightX -= v;

    // if ( lightX < -lightLength && millis() > changeLightAt ) {

    //   changeLightAt = millis() + random(2000,5000);
    //   lightColorX = random(1);
    //   lightColor = lerpColor(lightColor1,lightColor2,lightColorX);
    //   lightLength = random(size/10,size/5);
    //   lightHeight = random(height/20,size/15);
    //   lightDistX = random(size);

    //   lightX = size + lightDistX;
    //   lightY = random(height/5);

    // } else if ( lightX < -lightLength ) {

    //   lightX = size + lightDistX;

    // }

    // pillarX -= v;

    // if ( pillarX < -pillarLength && millis() > changePillarAt ) {
    //   changePillarAt = millis() + random(2000,6000);
    //   pillarLength = random(size/12,size/6);
    //   pillarDist = random(size/25,size/10);
    //   pillarX = size + pillarDist;
    // } else if ( pillarX < -pillarLength ) {
    //   pillarX = size + pillarDist;
    // }

  };

  this.drawThings = function() {

    background(0);

    rectMode(CORNER);
    noStroke();


    var sortedDrawThings = tunnelCurrentArr.sort(function(a,b) {
      return a.order - b.order;
    });
    sortedDrawThings.forEach( function( thing ){
      thing.draw();
    });

    // if ( tunnelCurrentArr.length > 0 ) {
    //   for (var i=tunnelCurrentArr.length-1; i>=0; i--) {
    //     var thing = tunnelCurrentArr[i];
    //     thing.draw();
    //   }
    // }

  };

}

ImgMgr.prototype.update = function() {

  this.updateThings();

};

ImgMgr.prototype.draw = function() {
  this.drawThings();
};


// function setup() {
//   createCanvas(100, 100);
//   // var pg = createGraphics(width,height);
//   // pg.clear();
//   // pg.fill(0,0,255,255);
//   // pg.rect(0,0,width,10);
//   // img.mask(pg);
//   // image( img, 0, 0 );
//   //a = Tom().play( Rndf(80, 160), 1/2 )
// }

var globalSpeed = 0.1;
var newGlobalSpeed = globalSpeed;
var timeBrakesStarted = 0;
var speedWhenBrakesStarted = 0;
var timeToStopMS = 0;

var pointerStartedY;
var globalSpeed0;
var displaySpeedControl = false;
function touchStarted() {
  pointerStarted( touchY );
  return false;
};
function mousePressed() {
  if ( !isFullscreen ) {
    isFullscreen = true;
    try {
      fullscreen(isFullscreen);
    } catch ( ex1 ) {
      console.log('error occurred:'+ex1);
    }
    return;
  }
  console.log('mousePressed');
  pointerStarted( mouseY );
};

var pointerStarted = function(py) {
  displaySpeedControl = true;
  pointerStartedY = py;
  globalSpeed0 = newGlobalSpeed;//globalSpeed
};
var pointerMoved = function(py) {
  if ( !displaySpeedControl ) {
    return;
  }
  newGlobalSpeed = globalSpeed0 + (pointerStartedY - py) / height;
  if (newGlobalSpeed < 0) {
    startBrakes();
  } else if (newGlobalSpeed > 1) {
    newGlobalSpeed = 1;
  }
  //console.log('globalSpeed = '+globalSpeed);
};
function mouseDragged() {
  console.log('mouseDragged');
  pointerMoved(mouseY);
}
function touchMoved() {
  //console.log('touchMoved');
  pointerMoved(touchY);
}
function mouseReleased() {
  displaySpeedControl = false;
  if ( height-pointerStartedY < 0.1*height ) {
    startBrakes();
  }
}
function touchEnded() {
  displaySpeedControl = false;
  if ( height-pointerStartedY < 0.1*height ) {
    startBrakes();
  }
}
var startBrakes = function() {
  newGlobalSpeed = 0;
  timeBrakesStarted = millis();
  speedWhenBrakesStarted = globalSpeed;
  timeToStopMS = max(5000,speedWhenBrakesStarted*15000);
};
var drawSpeedControl = function() {
  showHelpText = false;

  var bottom = height*0.9;
  var top = height/10;
  var controlSize = height - height/10*2;
  var controlStepWidth = controlSize/100;
  fill(0,255,0);
  for (var i = 0; i < floor(100*newGlobalSpeed); i++) {
    rect(width - 10, bottom - i*controlStepWidth,10,-controlStepWidth*0.5);
  }

};

Math.easeOutCubic = function (t, b, c, d) {
  t /= d;
  t--;
  return c*(t*t*t + 1) + b;
};

Math.easeInCubic = function (t, b, c, d) {
  t /= d;
  return c*t*t*t + b;
};
Math.easeInOutCubic = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t + 2) + b;
};

