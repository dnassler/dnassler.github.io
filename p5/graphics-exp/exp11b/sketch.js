//var globalSpeed = 0.7;
var globalSpeed = .5;

window.onresize = function() {
  checkOrientation();
};
var checkOrientation = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  if ( typeof window.orientation !== 'undefined' ) {
    return {width:w,height:h};
  }
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

var soundsArr = [];
var speakingSounds = [];

function preload() {

  // soundsArr.push( loadSound('28205__sagetyrtle__long-subway-ride_c01.mp3') );
  // soundsArr.push( loadSound('28205__sagetyrtle__long-subway-ride_c02.mp3') );
  // soundsArr.push( loadSound('28205__sagetyrtle__long-subway-ride_c03.mp3') );
  // soundsArr.push( loadSound('28205__sagetyrtle__long-subway-ride_c04b.mp3') );
  // soundsArr.push( loadSound('28205__sagetyrtle__long-subway-ride_skweaky1.mp3') );
  // soundsArr.push( loadSound('28205__sagetyrtle__long-subway-ride_c05.mp3') ); 

  // speakingSounds.push( loadSound('163141__beman87__subway-ny-inside-speaker-door-o-c_cETRAIN.mp3') );
  // speakingSounds.push( loadSound('163141__beman87__subway-ny-inside-speaker-door-o-c_c02_standclear.mp3') );
  // speakingSounds.push( loadSound('28205__sagetyrtle__long-subway-ride_c05trackcontrol_c01.mp3') );
  // speakingSounds.push( loadSound('160533__swelltoe77__subway-operator-amb-exterior-02_talking.mp3') );
  // speakingSounds.push( loadSound('160533__swelltoe77__subway-operator-amb-exterior-02_talking2.mp3') );

  // speakingSounds.push( loadSound('163141__beman87__subway-ny-inside-speaker-door-o-c_BEEBOO.mp3') );

}

function setup() {
	isFullscreen = (typeof window.orientation !== 'undefined') ? true: fullscreen(); // if iphone/ipad/iOS fullscreen(true) doesn't work
  var displaySize = checkOrientation();
  createCanvas(displaySize.width, displaySize.height);

  angleMode(RADIANS);

  ImgMgr.instance = new ImgMgr();
  //ImgMgr.instance.drawMode = 'lines';

  processSoundFiles();

  SoundControl.instance.playSound(true);
}

function processSoundFiles() {
  SoundControl.instance = new SoundControl();
  var reverb = new p5.Reverb();
  for ( var i=0; i<soundsArr.length; i++ ) {
    var sound = soundsArr[i];
    sound.playMode('sustain');
    reverb.process( sound, 3, 2 );
    SoundControl.instance.add( sound );
    //sound.setRate(0.5);
    //sound.setVolume(5);
  }
}

function SoundControl() {
  var sounds = [];
  var isPlayingSpeakingSound = false;
  this.add = function(sound) {
    sounds.push( sound );
  };
  // var donePlayingSound( sound ) {
  // };
  this.playSound = function( keepPlayingSounds ) {
    if ( sounds.length === 0 ) {
      return;
    }
    var that = this;
    var r = floor(random(sounds.length));
    var s = sounds[r];
    var dur = s.duration();
    window.setTimeout( function() {
      s.play();
    },0);
    if ( keepPlayingSounds ) {
      window.setTimeout(function() {
        console.log('sound finished, starting new random sound');
        window.setTimeout( function() {
          that.playSound(true);
        },0);
        if ( random(10)<10 && isPlayingSpeakingSound == false ) {
          console.log('about to play speaking sound');
          that.playSpeakingSound();
        }
        //donePlayingSound(s);
      }, dur*1000);
    }
  }
  this.playSpeakingSound = function() {
    var r = floor(random(speakingSounds.length));
    var s = speakingSounds[r];
    var dur = s.duration();
    isPlayingSpeakingSound = true;
    s.play();
    window.setTimeout(function() {
      isPlayingSpeakingSound = false;
    },dur*1000);
  };
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
//     return;
//   }

//   // if ( ImgMgr.instance.drawMode == 'triangle' ) {
//   //   ImgMgr.instance.drawMode = 'lines';
//   // } else {
//   //   ImgMgr.instance.drawMode = 'triangle';
//   // }
// };
var showSpeedControl = true;
var showSpeedControlTimer;

function draw() {

  // put drawing code here
  background(0);

  if ( window.innerWidth < window.innerHeight ) {
    noLoop();
    stroke(0);
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("this sketch requires LANDSCAPE orientation",window.innerWidth/2,window.innerHeight/2);
    return;
  }
  if ( !ImgMgr.instance.isStarted() ) {
    stroke(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("touch to start",window.innerWidth/2,window.innerHeight/2);
    return;
  }

  ImgMgr.instance.update();
  ImgMgr.instance.draw();

  if ( displaySpeedControl ) {
    drawSpeedControl();
  }

  if ( !isFullscreen ) {
    stroke(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("click to view fullscreen properly",window.innerWidth/2,window.innerHeight/2);
  } else {
    if ( showSpeedControl ) {
      if ( !showSpeedControlTimer ) {
        showSpeedControlTimer = millis();
      }
      stroke(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("control speed by touch/click and swipe up/down",window.innerWidth/2,window.innerHeight/2);
      if ( millis() - showSpeedControlTimer > 5000 ) {
        showSpeedControl = false;
      }
    }
  }


}

function ImgMgr() {

  var isMobileDevice = function() {
    return typeof window.orientation !== 'undefined';
  }
  var _isStarted = !isMobileDevice();

  var iBufSize;
  if ( width > height ) {
    iBufSize = width/8;
  } else {
    iBufSize = height/8;
  }
  iBufSize = floor( iBufSize );

  var i;
  var gridSize = iBufSize;
  var nCols = floor(width/gridSize);
  var nRows = floor(height/gridSize);
  var xoff = floor((width - nCols*gridSize)/2);
  var yoff = floor((height - nRows*gridSize)/2);
  var numImgInGrid = nCols * nRows;
  var frameDelay = 10;
  var nFrames = 1; //4 * frameDelay; //numImgInGrid * frameDelay;
  var rFrameOffset = [];
  for (i=0;i<5;i++){
    rFrameOffset.push( 0 );
  }

  var iBufArr = [];
  
  for ( i=0; i<nFrames; i++ ) {
    iBufArr.push( createImage(gridSize,gridSize) );
  }

  var getGridSize = function() {
    return gridSize;
  };

  var colRowToXY = function( col, row ) {
    var x = xoff + col*gridSize;
    var y = yoff + row*gridSize;
    return {x:x,y:y};
  };

  var drawIntoBuf = function(srcImg) {
    var imgFrame = iBufArr.shift();
    imgFrame.copy( srcImg, 0, 0, srcImg.width, srcImg.height, 0, 0, imgFrame.width, imgFrame.height );
    iBufArr.push( imgFrame );
  };

  var gFinal = createGraphics(width,height);

  var drawFrameAtIndexToGrid = function( i, col, row, rotateFrameAngle, scaleFactor ) {
    var xy = colRowToXY(col,row);
    var imgFrame = iBufArr[i];
    gFinal.push();
    if ( rotateFrameAngle ) {
      var fw = imgFrame.width;
      var fh = imgFrame.height;
      var frameCenterX = xy.x+fw/2;
      var frameCenterY = xy.y+fh/2;
      gFinal.translate(frameCenterX,frameCenterY);
      gFinal.rotate(rotateFrameAngle);
      gFinal.scale(scaleFactor)
      gFinal.translate(-frameCenterX,-frameCenterY);
    }
    gFinal.image( imgFrame, xy.x, xy.y );
    gFinal.pop();
  };

  // this.drawFramesToGrid = function() {
  //   var col = 0;
  //   var row = 0;
  //   var maxCol = 0;
  //   var maxRow = 0;
  //   var counter = 0;
  //   for (var i=0; i<nCols; i++) {
  //     for (var j=0; j<nRows; j++) {
  //       var frameIndex = nFrames-1 - counter * frameDelay;
  //       drawFrameAtIndexToGrid(frameIndex,col,row);
  //       counter += 1;
  //       col -= 1;
  //       row += 1;
  //       if ( row >= nRows || col < 0 ) {
  //         maxCol += 1;
  //         if ( maxCol >= nCols ) {
  //           maxCol = nCols-1;
  //           maxRow += 1;
  //         }
  //         row = maxRow;
  //         col = maxCol;
  //       }
  //     }
  //   }
  // };

  var nextGridRotationAt = millis();
  var startGridRotationAt;
  var durationGridRotation;
  var fromGridRotation;
  var toGridRotation;
  var currentGridRotation = 0;
  var isGridRotating = false;

  this.updateGridRotation = function() {
    var currentTime = millis();
    if ( !isGridRotating && currentTime > nextGridRotationAt ) {
      isGridRotating = true;
      startGridRotationAt = currentTime;
      durationGridRotation = random(500,1000);
      fromGridRotation = currentGridRotation;
      toGridRotation = random(-TWO_PI,TWO_PI);
    }
    if ( isGridRotating ) {
      if ( currentTime > startGridRotationAt + durationGridRotation ) {
        isGridRotating = false;
        nextGridRotationAt = currentTime + random(1000,2000);
      } else if ( currentTime > startGridRotationAt ) {
        currentGridRotation = Math.easeInOutCubic( currentTime - startGridRotationAt, fromGridRotation, toGridRotation, durationGridRotation );
      }
    }
  };

  var gridPointAngle = [];
  var gridPointScale = [];

  this.resetGridEffects = function() {
    gridPointScale = [];
    gridPointAngle = [];
  };

  this.drawFramesToGrid2 = function() {

    var fi = 0;
    var gridIndex = 0;
    for ( gx = 0; gx<width/gridSize; gx+=1 ) {
      for ( gy = 0; gy<height/gridSize; gy+=1 ) {
        if ( !gridPointAngle[gridIndex] ) {
          var randomAngle = PI/4 * floor(random(16));
          gridPointAngle[gridIndex] = randomAngle;
          gridPointScale[gridIndex] = random(1,3);
        }
        drawFrameAtIndexToGrid(fi, gx, gy, gridPointAngle[gridIndex], gridPointScale[gridIndex] );
        gridIndex += 1;
      }
    }

    var stretchHeightFactor = 1;
    push();
    if ( window.devicePixelRatio !== 1 ) {
      translate( width/2, height/2 );
      //rotate(TWO_PI*mouseX/width);
      rotate( currentGridRotation );
      translate( -width/2, -(height*stretchHeightFactor/2) );
      scale( window.devicePixelRatio );
      image( gFinal, 0, 0, gFinal.width, gFinal.height*stretchHeightFactor );
    } else {
      translate( width/2, height/2 );
      //rotate(TWO_PI*mouseX/width);
      rotate( currentGridRotation );
      translate( -width/2, -(height*stretchHeightFactor/2) );
      image( gFinal, 0, 0, gFinal.width, gFinal.height*stretchHeightFactor );
    }
    // translate( width/2, height/2 );
    // rotate(TWO_PI*mouseX/width);
    // translate( -width/2, -(height*stretchHeightFactor/2) );
    // image( gFinal, 0, 0, gFinal.width, gFinal.height*stretchHeightFactor );
    pop();

  };

  var sourceImage1 = new SourceImage(gridSize);
  this.createNextFrame = function() {
    sourceImage1.update();
    drawIntoBuf( sourceImage1.getImage() );
  };

  this.isStarted = function() {
    return _isStarted;
  };
  this.start = function() {
    _isStarted = true;
  };

};
ImgMgr.prototype.update = function(srcImg) {
  if ( !this.isStarted() ) {
    return;
  }
  this.createNextFrame();
  this.updateGridRotation();
};
ImgMgr.prototype.draw = function() {
  if ( !this.isStarted() ) {
    return;
  }
  this.drawFramesToGrid2();
};

// ===

function SourceImage(sizeIn) {

  var size = sizeIn;
  var g = createGraphics(size,size);

  this.getImage = function() {
    return g;
  }

  var changeLightAttrs = function() {

    // lightLength = random(size/10,size/2);
    // lightHeight = random(size/10,size*0.8);
    lightLength = random(size/25,size/5);
    lightHeight = random(size/25,size/5);

    // lightColor1 = color(255,100,0);
    // lightColor2 = color(0,100,255);
    // lightColorX = random(1);
    lightColor = color(random(255),random(255),random(255));//lerpColor(lightColor1,lightColor2,lightColorX);

    // lightX = size*2;
    // lightDistX = random(size);
    // lightY = random(size);
    // lightXvel = random(10,60);

    nextLightAttrStart = millis();

  };

  var changeLightDir = function() {

  };

  var changePillarAttrs = function() {

    pillarX = random(size,size*2);
    pillarLength = random(size/5,size*2);
    pillarDist = random(size);
    pillarV = random(5,20);

    nextPillarAttrStart = millis();

  };


  var lightLength;
  var lightHeight;
  var lightColor1;
  var lightColor2;
  var lightColorX;
  var lightColor;
  var lightX;
  var lightY;
  var lightDistX;
  var lightXvel;
  var lightYvel;
  var pillarX;
  var pillarV;
  var pillarLength;
  var pillarDist;
  var nextLightAttrStart;
  var changeLightAttrsDur = 1100;
  var nextPillarAttrStart;
  var changePillarAttrsDur = 1200;


  changeLightAttrs();
  changePillarAttrs();

  var countLights = 0;

  var lightMovedOffscreen = function() {
    if ( lightX < -lightLength || lightX > size+lightLength || lightY < -lightLength || lightY > size+lightLength ) {
      return true;
    }
    return false;
  };

  var resetLight = function() {
    numDirChanges = 0;
    var newStart = floor(random(4));
    var newStartPoint;
    if ( newStart === 0 ) {
      lightX = size;//+lightLength;
      lightY = random(size);
      lightXvel = -10;
      lightYvel = 0;
    } else if ( newStart === 1 ) {
      lightX = 0;//-lightLength;
      lightY = random(size);
      lightXvel = 10;
      lightYvel = 0;
    } else if ( newStart === 2 ) {
      lightX = random(size);
      lightY = 0;//-lightLength;
      lightXvel = 0;
      lightYvel = 10;
    } else {
      lightX = random(size);
      lightY = size;//+lightLength;
      lightXvel = 0;
      lightYvel = -10;
    }
  }

  resetLight();

  var numDirChanges = 0;
  var changeLightDirection = function() {
    var newDir = floor(random(4));
    if ( lightXvel !== 0 ) {
      lightXvel = 0;
      lightYvel = newDir < 2 ? -10 : 10;
    } else {
      lightYvel = 0;
      lightXvel = newDir < 2 ? -10 : 10;
    }
    numDirChanges += 1;
  };

  this.update = function() {

    //console.log('lightXvel='+lightXvel+', globalSpeed='+globalSpeed);
    lightX += lightXvel * globalSpeed * 2;
    lightY += lightYvel * globalSpeed * 2;

    if ( lightMovedOffscreen() ) {
      
      resetLight();

      if ( millis() > nextLightAttrStart + changeLightAttrsDur ) {
        changeLightAttrs();
      }

      countLights += 1;
      if ( countLights % 5 === 0 ) {
        g.background(0);
        ImgMgr.instance.resetGridEffects();
      }

    } else if ( numDirChanges < 1 && random(10) < 0.5 ) {

      changeLightDirection();

    }

    drawGraphics();
  };

  var drawGraphics = function() {
    //g.background(0);
    g.rectMode(CENTER);
    g.noStroke();
    //g.fill(lightColor);

    // g.fill(255,50);
    // g.rect(pillarX,0,pillarLength,size*2);

    g.fill(lightColor);
    g.rect(lightX,lightY,lightLength,lightHeight);

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

// ==

var globalSpeed;
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
  if ( !ImgMgr.instance.isStarted() ) {
    ImgMgr.instance.start();
    return;
  }
  displaySpeedControl = true;
  pointerStartedY = py;
  globalSpeed0 = globalSpeed;
};
var pointerMoved = function(py) {
  if ( !displaySpeedControl ) {
    return;
  }
  globalSpeed = globalSpeed0 + (pointerStartedY - py) / height;
  if (globalSpeed < 0) {
    globalSpeed = 0;
  } else if (globalSpeed > 1) {
    globalSpeed = 1;
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
}
function touchEnded() {
  displaySpeedControl = false;
}
var drawSpeedControl = function() {
  showHelpText = false;

  var bottom = height*0.9;
  var top = height/10;
  var controlSize = height - height/10*2;
  var controlStepWidth = controlSize/100;
  fill(0,255,0);
  for (var i = 0; i < floor(100*globalSpeed); i++) {
    rect(width - 10, bottom - i*controlStepWidth,10,-controlStepWidth*0.5);
  }

};

