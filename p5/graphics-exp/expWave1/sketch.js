var yoff = 0.0;        // 2nd dimension of perlin noise
var c;
var waveColor, waveColor2, waveColor3;
var waveColorArr;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  c = color(50,100,150,10);
  waveColor = color(0,50,120,100);
  waveColor2 = color(0,100,150,100);
  waveColor3 = color(0,200,250,100);
  noiseDetail(2,0.2);

  waveColorArr = [waveColor, waveColor, waveColor2, waveColor2, waveColor3, waveColor3];

}

function draw() {

  background(0);

  noStroke();

  for ( var i=0; i<=5; i++ ) {

    // We are going to draw a polygon out of the wave points
    beginShape();

    fill(waveColorArr[i]);

    var xoff = 0;       // Option #1: 2D Noise
    // float xoff = yoff; // Option #2: 1D Noise

    // Iterate over horizontal pixels
    for (var x = 0; x <= width+100; x += 100) {
      // Calculate a y value according to noise, map to

      // Option #1: 2D Noise
      var y = map(noise(xoff, yoff-0.5*i), 0, 1, height/10*(i+1), height - height/10 + height/10*i);

      // Option #2: 1D Noise
      // float y = map(noise(xoff), 0, 1, 200,300);

      // Set the vertex
      vertex(x, y);
      // Increment x dimension for noise
      xoff += 0.05;
    }
    // increment y dimension for noise
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);

  }

  yoff += 0.01;

}
