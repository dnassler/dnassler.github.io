
var isFullscreen = false;

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

function setup() {
  isFullscreen = (typeof window.orientation !== 'undefined') ? true: fullscreen(); // if iphone/ipad/iOS fullscreen doesn't work
  var displaySize = checkOrientation();
  createCanvas(displaySize.width, displaySize.height);
  angleMode(DEGREES);
}

var mousePressed = touchStarted = function() {
  console.log("touch/mouse");
  if ( !isFullscreen ) {
    isFullscreen = true;
    try {
      fullscreen(isFullscreen);
    } catch ( ex1 ) {
      console.log('error occurred:'+ex1);
    }
  }
};

var t0 = 0;
var tDiff = 0;
var maxLines = 5;
var lineSpacing = 10;
var linesHeight0 = 50;
var xPos = 0;
var yPos = 0;
var xSpeed = 0, ySpeed = 0;
var displayLinesMode = 0;
var linesSettleTimeMS = 1000.0;
var changeBoxesTime = 0;
var changeLinesTime = 0;
var boxesMode = 0;
var boxSpeed = 0;
var boxThreshold = 0;
var boxColor = 255;
var lineLengthMode = 0;

function draw() {

  // put drawing code here
  background(0);

  if ( !isFullscreen ) {
    stroke(255);
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("click to view fullscreen properly",width/2,height/2);
  }

  // if ( t0 + linesSettleTimeMS < millis() ) {
  if ( millis() > changeLinesTime ) {
    t0 = millis();
    var settleTimeMode = random(10);
    if ( settleTimeMode < 5 ) {
      linesSettleTimeMS = random(2000,5000);
    } else {
      linesSettleTimeMS = random(5000,8000);
    }
    changeLinesTime = millis() + random(1000,3000);
    xPos = random(width/2);
    yPos = random(height/2);
    xSpeed = random(-2,2);
    ySpeed = random(-2,2);
    maxLines = floor(random(20,100));
    lineSpacing = floor(random(1,10));
    linesHeight0 = height; //floor(random(height/2,height));
    displayLinesMode = floor(random(6));
    lineLengthMode = floor(random(2));
    lineShake = floor(random(2));
    lineWidthExpandMode = floor(random(2));
  }
  if ( millis() > changeBoxesTime ) {
    changeBoxesTime = millis() + random(100,2000);
    boxesMode = floor(random(4));
    boxSpeed = random(-10,10);
    boxThreshold = 0;
    boxColor = 255;
  }

  if ( millis() > t0 + linesSettleTimeMS ) {
    tDiff = 0;
    lineSpacing += 3;
  } else {
    tDiff = (linesSettleTimeMS - (millis() - t0)) / linesSettleTimeMS;
    lineSpacing += 3;
  }

  // draw boxes

  noStroke();
  fill(boxColor);
  if ( boxesMode == 0 ) {
    rect(0,0,width/2 + boxThreshold,height);
  } else if ( boxesMode == 1 ) {
    rect(0,0,width,height/2 + boxThreshold);
  } else if ( boxesMode == 2 ) {
    rect(width/2 + boxThreshold,0,width,height);
  } else if ( boxesMode == 3 ) {
    rect(0,height/2 + boxThreshold,width,height);
  }
  boxThreshold += boxSpeed;
  boxColor -= 2;
  if ( boxColor < 0 ) {
    boxColor = 0;
  }

  // draw lines

  var xOffset = 0;
  var sw = 1;
  // if ( tDiff > 0 ) {
  //   xOffset = 20 * sin(200*log(0.1*(millis()-t0))) * tDiff/1000.0;
  // }

  xPos += xSpeed;
  yPos += ySpeed;
  var linesHeight;

  if ( displayLinesMode <= 2 ) {
    xPos -= log(lineSpacing);
    linesHeight = height;
  } else {
    yPos -= log(lineSpacing);
    linesHeight = width;
  }

  for(var i = 0; i < maxLines; i += 1) {

    if ( tDiff > 0 ) {
      if ( lineShake == 0 ) {
        xOffset = 20 * sin((tDiff+200)*log(0.1*(millis()-t0))) * tDiff;
      } else {
        xOffset = 20 * sin((random(50)*tDiff+200)*log(0.1*(millis()-t0))) * tDiff;
      }
      if ( lineWidthExpandMode == 0 ) {
        sw = abs(xOffset) < 0 ? 1 : xOffset * 5;
      } else {
        sw = abs(20-xOffset) * 5;
      }
      //xOffset2 = 5 * sin((random(40)*tDiff+200)*log(0.2*(millis()-t0))) * tDiff;
    }

    var x = xPos + i * lineSpacing + xOffset;
    var y = yPos;
    var a = 50;

    if ( displayLinesMode == 0 ) {
      stroke(255,0,0, a);
      sw *= 4;
    } else if ( displayLinesMode == 1 ) {
      stroke(255,0,128, a);
      sw *= 2;
    } else if ( displayLinesMode == 2 ) {
      stroke(0,128,128, a);
    } else if ( displayLinesMode == 3 ) {
      stroke(0,70,255, a);
      sw *= 2;
    } else if ( displayLinesMode == 4 ) {
      stroke(0,128,100, a);
    } else if ( displayLinesMode == 5 ) {
      stroke(0,40,160, a);
    }

    strokeWeight(sw);
    if ( displayLinesMode <= 2 ) {
      if ( lineLengthMode == 0 ) {
        line(x, y, x, y+linesHeight);
      } else {
        line(x, 0, x, height);
      }
    } else {
      x = xPos;
      y = yPos + i * lineSpacing + xOffset;
      if ( lineLengthMode == 0 ) {
        line(x, y, x + linesHeight, y);
      } else {
        line(0, y, width, y);
      }
      //yPos -= log(lineSpacing);
    }

    // if ( fullscreen() == false ) {
      //textSize(100);
      // fill(255);
      // text("Click to View Properly",100,100);
    // }


  }




}
