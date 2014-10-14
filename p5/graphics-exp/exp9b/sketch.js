var globalSpeed = 1;
var globalSpeedFactor = function() {
  return globalSpeed;
}

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
  //isFullscreen = (typeof window.orientation !== 'undefined') ? true: fullscreen(); // if iphone/ipad/iOS fullscreen(true) doesn't work
	isFullscreen = (window.orientation !== undefined) ? true: fullscreen(); // if iphone/ipad/iOS fullscreen(true) doesn't work
  var displaySize = checkOrientation();
  createCanvas(displaySize.width, displaySize.height);

  angleMode(RADIANS);

  ImgMgr.instance = new ImgMgr();
  //ImgMgr.instance.drawMode = 'lines';


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
    return;
  }
  if ( !ImgMgr.instance.isStarted() ) {
    ImgMgr.instance.start();
  } else if ( ImgMgr.instance.isSourceLoaded() ) {
    ImgMgr.instance.togglePausePlay();
  }

  // if ( ImgMgr.instance.drawMode == 'triangle' ) {
  //   ImgMgr.instance.drawMode = 'lines';
  // } else {
  //   ImgMgr.instance.drawMode = 'triangle';
  // }
};

function draw() {

  // put drawing code here
  background(0);

  if ( !ImgMgr.instance.isStarted() ) {
    stroke(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("touch to start",window.innerWidth/2,window.innerHeight/2);
    return;
  }

  if ( !ImgMgr.instance.isSourceLoaded() ) {

    stroke(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("loading video...",window.innerWidth/2,window.innerHeight/2);
    return;

  }

  ImgMgr.instance.update();
  ImgMgr.instance.draw();

  if ( !isFullscreen ) {
    stroke(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("click to view fullscreen properly",window.innerWidth/2,window.innerHeight/2);
  }

}

function ImgMgr() {

  this.drawMode = 'triangle';

  var iBufSize;
  if ( width > height ) {
    iBufSize = width/8;
  } else {
    iBufSize = height/8;
  }
  iBufSize = floor( iBufSize );

  var gridSize = iBufSize;
  var nCols = floor(width/gridSize);
  var nRows = floor(height/gridSize);
  var xoff = floor((width - nCols*gridSize)/2);
  var yoff = floor((height - nRows*gridSize)/2);
  var numImgInGrid = nCols * nRows;
  var frameDelay = 5;
  var nFrames = numImgInGrid * frameDelay;
  
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

  var drawFrameAtIndexToGrid = function( i, col, row ) {
    var xy = colRowToXY(col,row);
    var imgFrame = iBufArr[i];
    image( imgFrame, xy.x, xy.y );
  };

  this.drawFramesToGrid = function() {
    var col = 0;
    var row = 0;
    var maxCol = 0;
    var maxRow = 0;
    var counter = 0;
    for (var i=0; i<nCols; i++) {
      for (var j=0; j<nRows; j++) {
        var frameIndex = nFrames-1 - counter * frameDelay;
        drawFrameAtIndexToGrid(frameIndex,col,row);
        counter += 1;
        col -= 1;
        row += 1;
        if ( row >= nRows || col < 0 ) {
          maxCol += 1;
          if ( maxCol >= nCols ) {
            maxCol = nCols-1;
            maxRow += 1;
          }
          row = maxRow;
          col = maxCol;
        }
      }
    }
  };

  var sourceImage1 = new SourceImage(gridSize);
  this.createNextFrame = function() {
    sourceImage1.update();
    drawIntoBuf( sourceImage1.getImage() );
  }

  function isMobileDevice() {
    return window.orientation !== undefined;
  };

  var _isStarted = !isMobileDevice();
  this.isStarted = function() {
    return _isStarted;
  };
  this.start = function() {
    console.log('ImgMgr.start called');
    if ( _isStarted ) {
      console.log('already started');
      //sourceImage1.togglePausePlay();
      return;
    }
    _isStarted = true;
    sourceImage1.start();
  };
  this.isSourceLoaded = function() {
    return sourceImage1.isLoaded();
  }
  var _isPaused = false;
  this.togglePausePlay = function() {
    if ( _isPaused ) {
      sourceImage1.unpause();
      _isPaused = false;
    } else {
      sourceImage1.pause();
      _isPaused = true;
    }
  };
  this.isPaused = function() {
    return _isPaused;
  };
};

ImgMgr.prototype.update = function(srcImg) {
  if ( !this.isStarted() ) {
    return;
  }
  if ( this.isPaused() ) {
    return;
  }
  this.createNextFrame();
};
ImgMgr.prototype.draw = function() {
  if ( !this.isStarted() ) {
    return;
  }
  this.drawFramesToGrid();
};

// ===

function SourceImage(sizeIn) {

  var size = sizeIn;
  var g = createGraphics(size,size);
  this.getImage = function() {
    return g;
  }
  var v;
  this.start = function() {
    console.log('SourceImage.start called');
    v.play();
    v.pause();
  };
  this.pause = function() {
    v.pause();
  };
  this.unpause = function() {
    v.play();
  };
  var videoIsLoaded = false;
  var vFile1 = 'IMG_3768.mov';
  var vFile2 = 'MVI_0034c1.mov';
  var vFile3 = 'video1.mp4';
  var vFile4 = 'IMG_3772.MOV';
  var vFile5 = 'IMG_3773.MOV';
  var vFile6 = 'IMG_3774.MOV';

  var vAspect;
  try {
    v = createVideo(vFile3, function() {
      videoIsLoaded = true;
      vAspect = v.width/v.height;
      console.log('video is DONE loading');
      v.play();
    });
    v.loop();
    v.hide();
  } catch (err) {
    console.log('error!!!! '+ err);
  }

  this.isLoaded = function() {
    return videoIsLoaded;
  };

  this.update = function() {
    if ( !videoIsLoaded ) {
      //console.log('video is not yet loaded');
      return;
    }
    //v.volume(0.0);
    //console.log('drawing video frame');
    drawGraphics();
  };

  var drawGraphics = function() {

    //g.image( v,-100,-50 );

    //var dx = (size-v.width)/2-size*0.6;
    //var dy = (size-v.height)/2+size*0.2;
    var dx = -size*0.2;//(size-v.width)/2;
    var dy = -size*0.2;//(size-v.height)/2;
    //var dx = 0;
    //var dy = 0;
    //g.image( v, dx, dy, vAspect*size, size );
    g.image( v, dx, dy, size, size );


  };

}

// function touchStarted() {
//   console.log('touchStarted!!!!');
  
//   return false;
// };
// ===



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
