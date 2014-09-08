var s0, s = 1.0;
var r0, r = 0;
var bx = 0;
var by = 0;
var bxa = 0;
var bxv = 0;
var byv = 0;
var bw;
var bwExtra;
var isPinching = false;
var isRotating = false;

function setup() {
  console.log("HI");
  console.log("displayWidth="+displayWidth);
  console.log("displayHeight="+displayHeight);

  console.log("windowWidth="+windowWidth);
  console.log("windowHeight="+windowHeight);

  console.log("window.innerWidth="+window.innerWidth);
  console.log("window.innerHeight="+window.innerHeight);

  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  rectMode(CENTER);
  ellipseMode(CENTER);

  bw = windowWidth*0.1;

  // set options to prevent default behaviors for swipe, pinch, etc
  var options = {
    preventDefault: true
  };

  //var hammer = new Hammer(document.body, options);
  var hammer = new Hammer.Manager( document.body );
  var pinch = new Hammer.Pinch();
  var rotate = new Hammer.Rotate();
  pinch.recognizeWith(rotate);
  hammer.add( pinch );
  hammer.add( rotate );
  var swipeRecognizer = new Hammer.Swipe();
  hammer.add( swipeRecognizer );
  // swipe.set({direction: DIRECTION_ALL});

  // hammer.get('pinch').set({ enable: true });
  // hammer.get('rotate').set({ enable: true });
  //
  // hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

  hammer.on("pinch", scaleRect);
  hammer.on("pinchstart", function(event) {
    console.log("pinchstart callback: event=",event);
    isPinching = true;
    tx0 = ty0 = bx0 = by0 = undefined;
    s0 = s;
  });
  hammer.on("pinchend", function(event) {
    console.log('pinchend callback: event',event);
    isPinching = false;
    //s = s0 * event.scale;
  });


  hammer.on("rotate", rotateRect);
  hammer.on("rotatestart", function() {
    console.log("rotatestart callback");
    isRotating = true;
    tx0 = ty0 = bx0 = by0 = undefined;
    r0 = r;
  });
  hammer.on("rotateend", function() {
    isRotating = false;
  });

  //--

  hammer.on("swipe", swipe);

  hammer.on("swipeup", swipeUp);
  hammer.on("swipedown", swipeDown);
  hammer.on("swipeleft", swipeLeft);
  hammer.on("swiperight", swipeRight);

  bx = width/2;
  by = height/2;
}


function draw() {
  background(150);

  fill(0);
  ellipse(width/2, height/2, windowWidth*0.5, windowWidth*0.5);

  // if ( abs(bxv) > 0.05 ) {
  //   console.log("box velocity = "+bxv);
  //   bxv *= 0.9;
  // }
  //bxv += bxa;

  if ( bxv == 0 && byv == 0 && !isRotating && !isPinching && touches.length == 1 && tx0 !== undefined ) {


    var txDiff = touchX - tx0;
    var tyDiff = touchY - ty0;
    bx = bx0 + txDiff;
    by = by0 + tyDiff;

  } else {

    bx += bxv;
    by += byv;

    bxv *= 0.99;
    byv *= 0.99;

  }

  bwExtra = bw * s / 2 * 1.41;

  if ( bx < -bwExtra ) {
    bx = width + bwExtra;
  } else if ( bx > width+bwExtra ) {
    bx = -bwExtra;
  } else if ( by < -bwExtra ) {
    by = height + bwExtra;
  } else if ( by > height+bwExtra ) {
    by = -bwExtra;
  }

  translate(bx, by);
  rotate(r);
  scale(s);

  var c = color(255,204,0,150);
  fill(c);

  rect(0, 0, bw, bw);
}


function rotateRect(event) {
  //r = radians(event.gesture.rotation);
  //console.log('rotateRect')
  r = r0 + radians(event.rotation);

}

//var s0=1.0;
function scaleRect(event) {
  //console.log(event);
  // if ( event.isFirst ) {
  //   //s0 = s;
  //   console.log("*** isFirst");
  // }
  // if ( event.isFinal ) {
  //   console.log("**** isFinal");
  // }
  //s = s0 * event.gesture.scale;
  s = s0 * event.scale;
  //console.log("pinch callback");
  // s = event.gesture.scale;
}

// --

function swipe(event) {
  console.log("swipe event:",event);

  //var xDir = event.deltaX / abs(event.deltaX);
  bxv += -5*event.velocityX;

  //var yDir = event.deltaY / abs(event.deltaY);
  byv += -5*event.velocityY;
}

// --

function swipeUp(event) {
  console.log( "you swiped up!" );
}

function swipeDown(event) {
  console.log("you swiped down!");
}

function swipeLeft(event) {
  console.log("you swiped left!");
}

function swipeRight(event) {
  console.log("you swiped right!");
}

// --

var tx0, ty0;
var bx0, by0;

function touchStarted() {
  if ( touches.length == 1 ) {
    if ( isRotating || isPinching ) return;
    console.log("touchStarted (single)");
    console.log("touches.length="+touches.length);
    tx0 = touchX;
    ty0 = touchY;
    bx0 = bx;
    by0 = by;
  } else {
    tx0 = ty0 = bx0 = by0 = undefined;
  }
}
function touchEnded() {
  // if ( touches.length == 0 ) {
  //
  // }
  console.log("touchEnded");
  tx0 = ty0 = bx0 = by0 = undefined;
}
// function touchStarted() {
//   console.log("touchStarted");
//   tx0 = touchX;
//   ty0 = touchY;
//   bx0 = bx;
//   by0 = by;
// }
// function touchMoved() {
//   console.log("touchMove!!!!");
//   var txDiff = touchX - tx0;
//   var tyDiff = touchY - ty0;
//   bx = bx0 + txDiff;
//   by = by0 + tyDiff;
// }
// function touchEnded() {
//   console.log("touchEnded");
//   tx0 = undefined;
//   ty0 = undefined;
// }
