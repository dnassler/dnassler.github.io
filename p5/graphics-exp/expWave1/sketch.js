var yoff = 0.0;        // 2nd dimension of perlin noise
var waveColor, waveColor2, waveColor3;
var waveColorArr;

var controlsVisible = false;
var controls, waveSpeed;
var canvas;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.id('mainCanvas');

  waveColor = color(0,50,120,100);
  waveColor2 = color(0,100,150,100);
  waveColor3 = color(0,200,250,100);
  noiseDetail(2,0.2);

  waveColorArr = [waveColor, waveColor, waveColor2, waveColor2, waveColor3, waveColor3];

  controls = createDiv();
  controls.id('controls');
  // controls.class('controls1');
  controls.position(10,10);
  waveSpeed = createSlider(-100,100);
  waveSpeed.value(0);
  waveSpeed.parent('controls');
  waveSpeed.position(10,0);
  var controlText = createDiv('wave speed');
  controlText.class('text');
  controlText.parent('controls');
  controlText.position(150,0);

  controls.hide();

  canvas.elt.onclick = function() {
    console.log('canvas clicked');
    if ( !controlsVisible ) {
      console.log("click show");
      controlsVisible = true;
      controls.show();
    } else {
      console.log("click hide?");
      controlsVisible = false;
      controls.hide();
    }
  };
  controls.elt.onclick = function() {
    console.log('controls clicked');
  }
}

function draw() {

  background(0);

  noStroke();

  var speed = waveSpeed.value();

  for ( var i=0; i<=5; i++ ) {

    // We are going to draw a polygon out of the wave points
    beginShape();

    fill(waveColorArr[i]);

    var xoff = 0;

    for (var x = 0; x <= width+100; x += 100) {

      var y = map(noise(xoff, yoff-0.5*i), 0, 1, height/10*(i+1), height - height/10 + height/10*i);

      vertex(x, y);

      xoff += 0.05;
    }

    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);

  }

  yoff += 0.01 + speed/10000.0;

}


// var mousePressed = touchStarted = function(e) {
//   // if ( e.target.parentElement.id === 'controls' ) {
//   //   console.log('ignore the touchStarted/mousePressed callback');
//   //   return;
//   // }
//   if ( !controlsVisible ) {
//     console.log("click show");
//     controlsVisible = true;
//     controls.show();
//   } else {
//     console.log("click hide?");
//     controlsVisible = false;
//     controls.hide();
//   }
// }
