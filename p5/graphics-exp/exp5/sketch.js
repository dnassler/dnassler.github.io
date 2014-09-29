
// var img;
var doorOpen;
var doorClose;

var doorSlideOpen1;
var doorSlideClose1;

var doorSqueak1;
var doorSqueak2;
var doorCloseHard1;

var doorSounds = [];
var doorSoundsByType = {};

var doorMgr;

var DOOR_WIDTH = 100;
var DOOR_HEIGHT = 100;

function preload() {

  doorOpen = loadSound("216874__castironcarousel__open-then-close-squeaky-door-Mono-open1.mp3");
  doorClose = loadSound("216874__castironcarousel__open-then-close-squeaky-door-Mono-close1.mp3");

  doorSlideOpen1 = loadSound("Sep_25_2014-010-slideopen1.mp3");
  doorSlideClose1 = loadSound("Sep_25_2014-010-slideclose1.mp3");

  doorSqueak2 = loadSound("Sep_25_2014-007_squeak2.mp3");
  doorSqueak1 = loadSound("Sep_25_2014-009_squeak1.mp3");
  doorCloseHard1 = loadSound("Sep_25_2014-007_doorCloseHard1.mp3");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  console.log("displayWidth="+displayWidth+", displayHeight="+displayHeight+", windowWidth="+windowWidth+", windowHeight="+windowHeight+", window.innerWidth="+window.innerWidth+", window.innerHeight="+window.innerHeight+", width="+width+", height="+height);

  DOOR_WIDTH = min(width/10,100);
  DOOR_HEIGHT = DOOR_WIDTH;

  // var pg = createGraphics(width,height);
  // pg.clear();
  // pg.fill(0,0,255,255);
  // pg.rect(0,0,width,10);
  // img.mask(pg);
  // image( img, 0, 0 );
  // noLoop();

  //a = Tom().play( Rndf(80, 160), 1/2 );
  //a.fx.add(Delay());

  //rectMode(CENTER);

  var reverb = new p5.Reverb();
  reverb.process( doorOpen );
  reverb.process( doorClose );
  reverb.process( doorSlideOpen1 );
  reverb.process( doorSlideClose1 );
  reverb.process( doorSqueak1 );
  reverb.process( doorSqueak2 );
  reverb.process( doorCloseHard1 );

  doorOpen.setVolume(5);
  doorOpen.rate(.5);
  doorClose.setVolume(5);
  doorClose.rate(.5);
  var doorOpenDur = doorOpen.duration() / .5 * .8;
  var doorCloseDur = doorClose.duration() / .5 * .8;

  doorSlideOpen1.setVolume(5);
  doorSlideOpen1.rate(.75);
  doorSlideClose1.setVolume(5);
  doorSlideClose1.rate(.75);
  var doorSlideOpen1Dur = doorSlideOpen1.duration() / .75 * .8;
  var doorSlideClose1Dur = doorSlideClose1.duration() / .75 * .8;

  doorSqueak1.rate(.5);
  doorSqueak1.setVolume(2);

  doorSqueak2.rate(.5);
  doorSqueak2.setVolume(2);

  doorCloseHard1.rate(.5);
  doorCloseHard1.setVolume(.5);

  // doorOpen.play();
  // window.setTimeout( function(){
  //   doorSqueak1.play();
  // }, 5000 );
  // window.setTimeout( function(){
  //   doorSqueak2.play();
  // }, 10000 );
  // window.setTimeout( function(){
  //   doorCloseHard1.play();
  // }, 15000 );


  doorSounds.push({
    doorType: 'horizontal',
    open: {file:doorOpen,duration:doorOpenDur},
    close: {file:doorClose,duration:doorCloseDur}
    });
  doorSounds.push({
    doorType: 'horizontal2',
    //open: {file:doorSqueak2,duration:doorSqueak2.duration()/.3},//Math.easeOutQuint
    open: {file:doorSqueak2,duration:doorSqueak2.duration()/.5},//Math.easeOutQuint
    close: {file:doorCloseHard1,duration:doorCloseHard1.duration()/.5*.7}
    });

  doorSounds.push({
    doorType: 'vertical',
    open: {file:doorSlideOpen1,duration:doorSlideOpen1Dur},
    close: {file:doorSlideClose1,duration:doorSlideClose1Dur}
    });

  // create a map to door sounds by doorType (i.e. horizontal/vertical)
  for (var i=0; i<doorSounds.length; i++) {
    var doorSound = doorSounds[i];
    var doorType = doorSound.doorType;
    if ( !doorSoundsByType[doorType] ) {
      doorSoundsByType[doorType] = [];
    }
    doorSoundsByType[doorType].push( doorSound );
  }

  doorMgr = new DoorMgr();

  // doorOpen.play();
  // window.setTimeout( function(){
  //   doorClose.play();
  // }, 5000 );

  // doorSlideOpen1.play();
  // window.setTimeout( function(){
  //   doorSlideClose1.play();
  // }, 5000 );

  scene0();
}

function draw() {
  background(255);

  doorMgr.update();
  doorMgr.draw();

  // var doors = getActiveDoors();
  // for ( var i=0; i<doors.length; i++ ) {
  //
  // }
  // if ( isOpeningDoor ) {
  //   rect()
  // }
}

// TODO (maybe/maybenot):
// add more sounds to project
// for example sounds that might have the sound of pulling a heavy thing
// or sounds of shuffling feet on a smoth hallway
// or sounds of a plate pulling around a table or a glass of water

function mousePressed() {
  //toggleDoor();
  doorMgr.openNewDoor( function( door ) {
    console.log("a new door has finished opening: id="+door.doorId+", x="+door.x+", y="+door.y);
    window.setTimeout(function() {
      console.log("about to close door:"+door.doorId);
      door.close();
    }, 3000);
  }, 'horizontal2');
}

function scene0() {
  //scene7();
  scene6a();
  //scene10();
}

function scene1() {
  var d1 = doorMgr.openNewDoor();
  var d2 = doorMgr.openNewDoor();
  if ( random(10) < 7 ) {
    window.setTimeout(function() {
      var d3 = doorMgr.openNewDoor(
        function() {
          window.setTimeout(function() {
            var d4 = doorMgr.openNewDoor( function() {
              window.setTimeout(function() {d3.close();},random(1000));
              window.setTimeout(function() {d4.close();},random(1000));
            } );
          },random(1000));
        }, 'vertical'
      );
      var d5 = doorMgr.openNewDoor(
        function() {
          window.setTimeout(function() {
            var d6 = doorMgr.openNewDoor( function() {
              window.setTimeout(function() {d5.close();},random(1000));
              window.setTimeout(function() {d6.close();},random(1000));
            });
          },random(1000));
        }, 'vertical'
      );
    }, random(0,4000) );
  }
  window.setTimeout( function() {
    d1.close();
    d2.close( scene1done );
  }, 5000);
}
function scene1done() {
  pickNextScene('scene1');
  // var r = random(7);
  // if ( r < 1 ) {
  //   scene1();
  // } else if ( r < 2 ) {
  //   scene2();
  // } else if ( r < 3 ){
  //   scene3();
  // } else if ( r < 4 ){
  //   scene4();
  // } else if ( r < 5 ){
  //   scene5();
  // } else {
  //   scene6a();
  // }
}

function scene2() {
  var d1 = doorMgr.openNewDoor( function(door) {
    window.setTimeout( function() {
      door.close( scene2done );
    },random(2000));
  });
}
function scene2done() {
  if ( random(2) < 1 ) {
    scene1();
    return;
  }
  pickNextScene('scene2');
  // var r = random(10);
  // if ( r < 1 ) {
  //   scene3();
  // } else if ( r < 2 ) {
  //   scene4();
  // } else if ( r < 3 ) {
  //   scene6();
  // } else {
  //   scene1();
  // }
}

function scene3() {
  var numDoors = random(5,10);
  var dArr = [];
  for ( var i=0; i<numDoors; i++ ) {
    var d = doorMgr.openNewDoor();
    if ( d ) {
      dArr.push( d );
    }
  }
  window.setTimeout( function() {
    for ( var i=0; i<numDoors; i++ ) {
      var d = dArr[i];
      (function(door){
        window.setTimeout( function() {
          door.close();
        }, random(1000,5000) );
      })(d);
    }
  }, 3000);
  // TODO: improve the transition to scene3 by keeping track of when the last door closes (which is random but max 5000ms)
  window.setTimeout( function() {
    scene3done();
  }, random(5000,9000));
}
function scene3done() {
  if ( random(5) < 2 ) {
    scene1();
    return;
  }
  pickNextScene('scene9');
  // var r = random(6);
  // if ( r < 1 ) {
  //   scene4();
  // } else if ( r < 2 ) {
  //   scene5();
  // } else if ( r < 3 ){
  //   scene2();
  // } else if ( r < 4 ){
  //   scene6a();
  // } else {
  //   scene1();
  // }
}

function scene4() {
  var d1,d2,d3,d4,d5;
  d1 = doorMgr.openNewDoor(function() {
    d2 = doorMgr.openNewDoor(function() {
      d3 = doorMgr.openNewDoor(function() {
        d4 = doorMgr.openNewDoor(function() {
          d5 = doorMgr.openNewDoor(
            function() {

              if ( random(2) < 1 ) {
                d1.close( function() {
                  d2.close( function() {
                    d3.close( function() {
                      d4.close( function() {
                        window.setTimeout(function(){
                          d5.close( function() {
                            scene4done();
                          });
                        }, random(1000));
                      });
                    });
                  });
                });
              } else {
                d1.close();
                d2.close( function() {
                  d3.close();
                  d4.close();
                  d5.close( function() {
                    scene4done();
                  });
                });

              }

            }
          );
        });
      });
    });
  });
}
function scene4done() {
  if ( random(5) < 2 ) {
    scene1();
    return;
  }
  pickNextScene('scene4');
  // var r = random(6);
  // if ( r < 1 ) {
  //   scene4();
  // } else if ( r < 2 ) {
  //   scene5();
  // } else if ( r < 3 ){
  //   scene2();
  // } else if ( r < 4 ){
  //   scene3();
  // } else {
  //   scene1();
  // }
}
function scene5() {

  var numDoors = floor(random(10,20)); // TODO: this value MIGHT not match the final number of doors added to dArr (if the doors don't all fit for example)
  var scene5variantCode = floor(random(2));
  var scene5doorType = random(10)<5 ? 'vertical' : 'horizontal2';
  var openCount = 0;
  var closedCount = 0;
  var lastOpenTurnCount = 0;
  //var closeTimeRandom = random(2)<1 ? true:false;
  var dArr = [];
  for ( var i=0; i<numDoors; i++ ) {
    window.setTimeout(function() {
      var keepAlive = floor(random(2,5));
      var d = doorMgr.openNewDoor( scene5doorOpenEvent
        // function() {
        //   openCount += 1;
        //   window.setTimeout(function() {
        //     d.close( scene5doorCloseEvent
        //       // function() {
        //       //   // check if everything is done
        //       //   closedCount += 1;
        //       //   if ( closedCount == numDoors && openCount == closedCount ) {
        //       //     scene5done();
        //       //   }
        //       // }
        //     );
        //   } , random(2000,4000));
        // }
        , scene5doorType, keepAlive);
      if ( d ) {
        dArr.push( d );
      }
    }, random(3000));
  }

  var scene5doorOpenEvent = function ( door ) {

    openCount += 1;

    if ( scene5variantCode == 1 && door.keepAlive <= 1) {

      // this door is open but the next time it closes, it will be dead
      // so do not set a timeout to close it and instead wait until the
      // scene done signal occurs
      lastOpenTurnCount += 1;
      if ( lastOpenTurnCount == numDoors ) {
        window.setTimeout(function() {
          for (var i=0; i<numDoors; i++) {
            var d = dArr[i];
            if ( i == numDoors-1 ) {
              d.close( function() {
                scene5done();
              });
            } else {
              d.close();
            }
          }
        }, random(5000,10000));

      }

    } else {

      window.setTimeout( function() {
        door.close( function() {

          closedCount += 1;

          // check if everything is done
          if ( door.keepAlive ) {
            door.keepAlive -= 1;
            if ( door.keepAlive < 0 ) {
              door.keepAlive = 0;
            } else if ( door.keepAlive > 0 ) {
              // reopen in random time
              openCount -= 1;
              closedCount -= 1;
              window.setTimeout(function(){
                door.open( scene5doorOpenEvent
                  // function() {
                  // openCount += 1;
                  // window.setTimeout(function(){
                  //   door.close( scene5doorCloseEvent );
                  // }, random(2000,4000));
                  // }
                  );
              }, random(500,4000));
            }
          }

          console.log("numDoors = "+numDoors+", openCount = "+openCount+", closedCount = "+closedCount);
          if ( closedCount == numDoors && openCount == closedCount ) {
            console.log("******* all closed *******");
            scene5done();
          }

        });
      }, random(500,4000));

    }


  }

  // window.setTimeout( function() {
  //   for ( var i=0; i<numDoors; i++ ) {
  //     var d = dArr[i];
  //     (function(door){
  //       window.setTimeout( function() {
  //         door.close();
  //       }, random(1000) );
  //     })(d);
  //   }
  // }, random(3000));

  // window.setTimeout( function() {
  //   scene5done();
  // }, random(5000,9000));

}


function scene5done() {
  pickNextScene('scene5');
  // var r = random(4);
  // if ( r < 1 ) {
  //   scene1();
  // } else if ( r < 2 ) {
  //   scene2();
  // } else if ( r < 3 ){
  //   scene3();
  // } else {
  //   scene4();
  // }
}

function scene6a() {
  doorMgr.openNewDoor( function( door ) {
    window.setTimeout(function() {
      door.close( function() {
        window.setTimeout(function(){
          scene6adone();
        },3000);
      });
    }, 3000);
  }, 'horizontal2');
}
function scene6adone() {
  pickNextScene('scene6a');
  // var r = random(6);
  // if ( r < 1 ) {
  //   scene4();
  // } else if ( r < 2 ) {
  //   scene5();
  // } else if ( r < 3 ){
  //   scene2();
  // } else if ( r < 4 ){
  //   scene3();
  // } else {
  //   scene1();
  // }
}

function scene6() {
  var numDoors = random(5,10);
  var dArr = [];
  for ( var i=0; i<numDoors; i++ ) {
    var d = doorMgr.openNewDoor(null,'horizontal2');
    if ( d ) {
      dArr.push( d );
    }
  }
  window.setTimeout( function() {
    for ( var i=0; i<numDoors; i++ ) {
      var d = dArr[i];
      (function(door){
        window.setTimeout( function() {
          door.close();
        }, random(1000,5000) );
      })(d);
    }
  }, 3000);
  // TODO: improve the transition to scene3 by keeping track of when the last door closes (which is random but max 5000ms)
  window.setTimeout( function() {
    scene6done();
  }, random(5000,9000));
}
function scene6done() {
  pickNextScene('scene6');
  // var r = random(6);
  // if ( r < 1 ) {
  //   scene4();
  // } else if ( r < 2 ) {
  //   scene5();
  // } else if ( r < 3 ){
  //   scene2();
  // } else if ( r < 4 ){
  //     scene3();
  // } else {
  //   scene1();
  // }
}

function scene7() {
  var doorType = 'all';
  var doorY = height/2 - DOOR_HEIGHT/2;
  var numDoors = 6;
  var dArr = [];
  for ( var i=0; i<numDoors; i++ ) {
    window.setTimeout(function(){
      var d = doorMgr.openNewDoor(null, doorType, null, null, doorY);
      if ( d ) {
        dArr.push( d );
      }
    }, random(5000));
  }
  window.setTimeout( function() {
    for ( var i=0; i<dArr.length; i++ ) {
      var d = dArr[i];
      (function(door){
        window.setTimeout( function() {
          door.close();
        }, random(1000,5000) );
      })(d);
    }
  }, 5500);
  // TODO: improve the transition to scene3 by keeping track of when the last door closes (which is random but max 5000ms)
  window.setTimeout( function() {
    scene7done();
  }, random(8000,10000));

}

function scene7done() {
  pickNextScene('scene7');
}


function scene8() {
  var doorType = null;

  var doorYcenter = height/2 - DOOR_HEIGHT/2;
  var numDoors = 0;
  var numRows = 6;
  var numDoorsPerRow = 6;
  var dArr = [];

  for ( var i=0; i<numRows*numDoorsPerRow; i++ ) {

    var rowNum = floor(i / numDoorsPerRow);
    var colNum = i % numDoorsPerRow;
    var doorX = (colNum * DOOR_WIDTH) - (numDoorsPerRow*DOOR_WIDTH/2) + width/2;
    var doorY = rowNum*DOOR_HEIGHT - numRows*DOOR_HEIGHT/2 + height/2;

    (function(dx,dy){
      window.setTimeout(function(){
          var d = doorMgr.openNewDoor(null, doorType, null, dx, dy);
          if ( d ) {
            dArr.push( d );
          }
        }, random(5000))
    })(doorX,doorY);

  }

  window.setTimeout( function() {
    for ( var i=0; i<dArr.length; i++ ) {
      var d = dArr[i];
      (function(door){
        window.setTimeout( function() {
          door.close();
        }, random(1000,5000) );
      })(d);
    }
  }, 10000);
  // TODO: improve the transition to scene3 by keeping track of when the last door closes (which is random but max 5000ms)
  window.setTimeout( function() {
    scene8done();
  }, random(15000,15000));

}

function scene8done() {
  pickNextScene('scene8');
}

function scene9() {
  var doorType = null;

  var doorYcenter = height/2 - DOOR_HEIGHT/2;
  var numDoors = 0;
  var numRows = 6;
  var numDoorsPerRow = 6;
  var doorSpacingX = DOOR_WIDTH+DOOR_WIDTH/2;
  var doorSpacingY = DOOR_HEIGHT+DOOR_HEIGHT/2;
  var dArr = [];

  for ( var i=0; i<numRows*numDoorsPerRow; i++ ) {

    var rowNum = floor(i / numDoorsPerRow);
    var colNum = i % numDoorsPerRow;
    var doorX = (colNum * doorSpacingX) - (numDoorsPerRow*doorSpacingX/2) + width/2;
    var doorY = rowNum*doorSpacingY - numRows*doorSpacingY/2 + height/2;

    (function(dx,dy){
      window.setTimeout(function(){
          var d = doorMgr.openNewDoor(null, doorType, null, dx, dy);
          if ( d ) {
            dArr.push( d );
          }
        }, random(5000))
    })(doorX,doorY);

  }

  window.setTimeout( function() {
    for ( var i=0; i<dArr.length; i++ ) {
      var d = dArr[i];
      (function(door){
        window.setTimeout( function() {
          door.close();
        }, random(1000,5000) );
      })(d);
    }
  }, 10000);
  // TODO: improve the transition to scene3 by keeping track of when the last door closes (which is random but max 5000ms)
  window.setTimeout( function() {
    scene9done();
  }, random(15000,15000));

}

function scene9done() {
  pickNextScene('scene9');
}

function scene10() {
  console.log("scene10: in");

  var doorType = null;

  var doorYcenter = height/2 - DOOR_HEIGHT/2;
  var numDoors = 0;
  var doorSpacingX;
  var doorSpacingY;
  var r = random(2);
  if ( r < 1 ) {
    doorSpacingX = DOOR_WIDTH+DOOR_WIDTH/2;
    doorSpacingY = DOOR_HEIGHT+DOOR_HEIGHT/2;
  } else if ( r < 2 ) {
    doorSpacingX = DOOR_WIDTH;
    doorSpacingY = DOOR_HEIGHT;
  // } else if ( r < 3 ) {
  //   doorSpacingX = DOOR_WIDTH+DOOR_WIDTH/2;
  //   doorSpacingY = DOOR_HEIGHT*2;
  // } else {
  //   doorSpacingX = DOOR_WIDTH*2;
  //   doorSpacingY = DOOR_HEIGHT+DOOR_HEIGHT/2;
  }

  var maxDoorsPerRow = width * .9 / doorSpacingX;
  var maxDoorsPerCol = height * .9 / doorSpacingY;

  var numRows;
  var numDoorsPerRow;
  if ( random(2) < 1 ) {
    numRows = floor(random(2,floor(maxDoorsPerRow/2)));
    numDoorsPerRow = floor(random(4,maxDoorsPerRow));
  } else {
    numRows = floor(random(4,maxDoorsPerCol));
    numDoorsPerRow = floor(random(2,floor(maxDoorsPerCol/2)));
  }

  var skipColNum;
  var skipRowNum;
  var doorConfigMode = 0;
  var doorConfigPicker = floor(random(4));
  // numRows=5;
  // numDoorsPerRow=10;

  if ( (numDoorsPerRow >= 3 || numRows >= 3) && doorConfigPicker == 0 ) {

    // skips either columns or rows
    doorConfigMode = 1;
    var skipColumns = false;

    if ( numDoorsPerRow >= 3 && numRows >= 3 ) {
      // pick either rows or columns to skip
      if ( random(2) < 1 ) {
        skipColumns = true;
      }
    } else {
      if ( numDoorsPerRow >= 3 ) {
        skipColumns = true;
      }
    }

    if ( skipColumns ) {
      skipColNum = floor(random(1,numDoorsPerRow-1));
    } else {
      skipRowNum = floor(random(1,numRows-1));
    }

  } else if ((numDoorsPerRow >= 3 && numRows >= 3) && doorConfigPicker == 1) {

    // skip inner doors leaving only perimeter
    doorConfigMode = 2;
    doorType = "horizontal2";

  } else if (doorConfigPicker == 2) {
    // skip a random door
    doorConfigMode = 3;
    skipColNum = floor(random(0,numDoorsPerRow));
    skipRowNum = floor(random(0,numRows));
  }

  console.log("doorConfigMode="+doorConfigMode);
  console.log("numRows="+numRows+", numDoorsPerRow="+numDoorsPerRow+", skipRowNum="+skipRowNum+", skipColNum="+skipColNum);

  // var numRows = 2;
  // var numDoorsPerRow = 5;
  var dArr = [];

  for ( var rowNum=0; rowNum<numRows; rowNum++ ) {

    if ( doorConfigMode == 1 ) {
      if ( skipRowNum && rowNum == skipRowNum ) {
        continue; // skip this row
      }
    }

    for ( var colNum=0; colNum<numDoorsPerRow; colNum++ ) {

      if ( doorConfigMode == 1 ) {
        if ( skipColNum && colNum == skipColNum ) {
          continue; // skip this column
        }
      } else if ( doorConfigMode == 2 ) {
        // skip inner
        if ( !(rowNum == 0 || rowNum == numRows-1 || colNum == 0 || colNum == numDoorsPerRow-1) ) {
          continue;
        }
      } else if ( doorConfigMode == 3 ) {
        if ( rowNum == skipRowNum && colNum == skipColNum ) {
          continue;
        }
      }

      // var rowNum = floor(i / numDoorsPerRow);
      // var colNum = i % numDoorsPerRow;
      var doorX = (colNum * doorSpacingX) - ((numDoorsPerRow*doorSpacingX-(doorSpacingX-DOOR_WIDTH))/2) + width/2;
      var doorY = rowNum*doorSpacingY - ((numRows*doorSpacingY-(doorSpacingY-DOOR_HEIGHT))/2) + height/2;

      (function(dx,dy){
        window.setTimeout(function(){
            var d = doorMgr.openNewDoor(null, doorType, null, dx, dy);
            if ( d ) {
              dArr.push( d );
            }
          }, random(5000))
      })(doorX,doorY);

    }

  }

  //doorConfigMode = 3;
  //skipColNum = floor(random(0,numDoorsPerRow));
  //skipRowNum = floor(random(0,numRows));

  var closeUp = function(delayTime) {
    window.setTimeout( function() {
      for ( var i=0; i<dArr.length; i++ ) {
        var d = dArr[i];
        (function(door){
          window.setTimeout( function() {
            door.close();
          }, random(1000,5000) );
        })(d);
      }

      window.setTimeout( function() {
        scene10done();
      }, random(5500,6000)); // need to fix this (i.e. change time based on if there was a missing column or single door which increases the time before the end)

    }, delayTime);
  }

  var openDoorWithRandomDelay = function(rowNum,colNum,doorType,timeDelayLimit) {
    var doorX = (colNum * doorSpacingX) - ((numDoorsPerRow*doorSpacingX-(doorSpacingX-DOOR_WIDTH))/2) + width/2;
    var doorY = rowNum*doorSpacingY - ((numRows*doorSpacingY-(doorSpacingY-DOOR_HEIGHT))/2) + height/2;
    window.setTimeout(function(){
        var d = doorMgr.openNewDoor(null, doorType, null, doorX, doorY);
        if ( d ) {
          dArr.push( d );
        }
      }, random(timeDelayLimit));
  }

  if ( doorConfigMode == 1 ) {
    // open up the missing row/col
    window.setTimeout(function() {
      var colNum = skipColNum;
      var rowNum = skipRowNum;
      if ( skipColNum ) {
        // loop through the rows of the missing column
        for (var rowNum=0; rowNum<numRows; rowNum++) {
          openDoorWithRandomDelay(rowNum,skipColNum,'horizontal2',0);
        }
      } else {
        // loop through the columns of the missing row
        for (var colNum=0; colNum<numDoorsPerRow; colNum++) {
          openDoorWithRandomDelay(skipRowNum,colNum,'horizontal2',0);
        }
      }
      closeUp(3000);
    }, 9000);

  } else if ( doorConfigMode == 3 ) {
    // open up the final missing space
    window.setTimeout(function() {
      openDoorWithRandomDelay(skipRowNum,skipColNum,'horizontal2',0);
      closeUp(3000);
    }, 9000);
    // window.setTimeout(function() {
    //   var colNum = skipColNum;
    //   var rowNum = skipRowNum;
    //   var doorX = (colNum * doorSpacingX) - ((numDoorsPerRow*doorSpacingX-(doorSpacingX-DOOR_WIDTH))/2) + width/2;
    //   var doorY = rowNum*doorSpacingY - ((numRows*doorSpacingY-(doorSpacingY-DOOR_HEIGHT))/2) + height/2;
    //   var d = doorMgr.openNewDoor(null,'horizontal2',null,doorX,doorY);
    //   dArr.push(d);
    // }, 10000);
    //closeUp(13000);
  } else {
    closeUp(10000);
  }


}

function scene10done() {
  pickNextScene('scene10');
  //scene10();
}

function pickNextScene( fromSceneId ) {
  var sceneArr = ['scene1','scene2','scene3','scene4','scene5','scene6a','scene6','scene7','scene8','scene9','scene10'];
  var nextSceneId;
  while ( !nextSceneId ) {
    var i = floor(random(sceneArr.length));
    if ( sceneArr[i] != fromSceneId ) {
      nextSceneId = sceneArr[i];
      break;
    }
  }
  gotoScene( nextSceneId );
}
function gotoScene( sceneId ) {
  if ( sceneId == 'scene1') {
    scene1();
  } else if (sceneId == 'scene2') {
    scene2();
  } else if (sceneId == 'scene3') {
    scene3();
  } else if (sceneId == 'scene4') {
    scene4();
  } else if (sceneId == 'scene5') {
    scene5();
  } else if (sceneId == 'scene6') {
    scene6();
  } else if (sceneId == 'scene6a') {
    scene6a();
  } else if (sceneId == 'scene7') {
    scene7();
  } else if (sceneId == 'scene8') {
    scene8();
  } else if (sceneId == 'scene9') {
    scene9();
  } else if (sceneId == 'scene10') {
    scene10();
  } else if (sceneId == 'scene11') {
    scene11();
  } else if (sceneId == 'scene12') {
    scene12();
  } else if (sceneId == 'scene13') {
    scene13();
  } else if (sceneId == 'scene14') {
    scene14();
  } else if (sceneId == 'scene15') {
    scene15();
  }
}

function DoorMgr() {

  this.doorsActive = {};

  this.lastDoorId = -1;

}

DoorMgr.prototype = {
  findEmptySpace: function(doorSpaceReq) {
    var rxIn = doorSpaceReq.x;
    var ryIn = doorSpaceReq.y;
    var rx = rxIn;
    var ry = ryIn;
    if ( !rx || !ry ) {
      var maxLoops = 1000;
      var loopCount = 0;
      while ( loopCount == 0 || !this.isSpaceEmpty( rx, ry, doorSpaceReq ) ) {
        rx = rxIn || random(width/100, width*0.9);
        ry = ryIn || random(height/100, height*0.9);
        loopCount += 1;
        if ( loopCount > maxLoops ) break; // give up looking for empty space and just use whatever
      }
      if ( loopCount > maxLoops ) {
        console.log("maxloops!!!!");
        return {noEmptySpace:true};
      }
    }
    return {x:rx,y:ry};
  },
  isSpaceEmpty: function( rx, ry, doorSpaceReq ) {
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      if ( dist(rx,ry,door.x,door.y) < 1.5* max(doorSpaceReq.width,doorSpaceReq.height,door.doorWidth,door.doorHeight) ) {
        return false;
      }
    }
    return true;
  },
  getNextDoorId: function() {
    this.lastDoorId += 1;
    return this.lastDoorId;
  },
  openNewDoor: function( doorOpenedCallback, doorType, keepAlive, x, y ) {
    var xy;
    if ( !x || !y ) {
      var emptySpaceXY = this.findEmptySpace({width:DOOR_WIDTH,height:DOOR_HEIGHT,x:x,y:y});
      if ( emptySpaceXY.noEmptySpace ) {
        // no room for a new door
        return false;
      }
      xy = emptySpaceXY;
    } else {
      xy = {x:x,y:y};
    }
    var door = new Door(doorType);
    door.doorId = this.getNextDoorId();
    door.keepAlive = keepAlive;
    door.setPos( xy.x, xy.y );
    this.doorsActive[door.doorId] = door;
    door.open( doorOpenedCallback );
    return door;
  },
  closeDoorById: function( doorId ) {
    var door = this.getDoorById( doorId );
    if ( door ) {
      door.close();
    }
  },
  getRandomOpenDoor: function() {
    return this.getRandomDoor(true);
  },
  getRandomClosedDoor: function() {
    return this.getRandomDoor(false);
  },
  getRandomDoor: function( onlyOpen ) {
    var doorIdKeysToPickFrom = [];
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      if ( onlyOpen && door.isOpen() ) {
        doorIdKeysToPickFrom.push( doorId );
      } else if ( door.isClosed() ) {
        doorIdKeysToPickFrom.push( doorId );
      }
    }
    if ( doorIdKeysToPickFrom.length == 0 ) {
      return undefined;
    }
    var randomKeyIndex = floor(random(doorIdKeysToPickFrom.length));
    var randomKey = doorIdKeysToPickFrom[randomKeyIndex];
    var randomDoor = this.doorsActive[randomKey];
    return randomDoor;
  },
  getDoorById: function( doorId ) {
    var door = this.doorsActive[doorId];
    return door;
  },
  closeAllDoors: function() {
    for (var i=0; i<this.doorsActive.length; i++) {
      var door = this.doorsActive[i];
      if ( door.isOpen() || door.isOpening() ) {
        door.close();
      }
    }
  },
  removeClosedDoor: function( door ) {
    if ( !door.isClosed() ) {
      return;
    }
    delete this.doorsActive[door.doorId];
  },
  update: function() {
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      door.update();
      if ( door.isClosed() && !door.keepAlive ) {
        this.removeClosedDoor( door );
      }
    }
  },
  draw: function() {
    var doorIdKeys = Object.keys(this.doorsActive);
    for (var i=0; i<doorIdKeys.length; i++) {
      var doorId = doorIdKeys[i];
      var door = this.doorsActive[doorId];
      door.draw();
    }
  }

};

function Door( doorType ) {

  this.doorId = -1;
  this.state = 'closed';
  this.x = 0;
  this.y = 0;

  this.openStartTime = 0;
  this.closeStartTime = 0;

  // if ( !this.x ) {
  //   resetXPos();
  // }
  // if ( !this.y ) {
  //   resetYPos();
  // }
  //
  // var resetXPos = function() {
  //   this.x = random(width/10,width*0.9);
  // };
  // var resetYPos = function() {
  //   this.y = random(height/10,height*0.9);
  // };
  // var resetPosition = function() {
  //   resetXPos();
  //   resetYPos();
  // };

  // this.isOpen = false;
  // this.isOpening = false;
  // this.isClosing = false;
  // this.isClosed = true;

  var pickDoorSound = function(doorType) {
    var doorSoundsArr;
    if ( !doorType ) {
      doorSoundsArr = doorSoundsByType['horizontal'].concat(doorSoundsByType['vertical']);//doorSounds; //all door sounds
    } else if ( doorType instanceof Array ) {
      // not supported yet
    } else {
      if (doorType == 'all') {
        doorSoundsArr = doorSounds;
      } else {
        doorSoundsArr = doorSoundsByType[doorType];
      }
    }
    var rndIndex = floor(random(doorSoundsArr.length));
    var doorSound = doorSoundsArr[rndIndex];
    return doorSound;
  };
  this.doorSound = pickDoorSound(doorType);

  this.doorWidth = DOOR_WIDTH; //random(100,100);
  this.doorHeight = DOOR_HEIGHT; //random(100,200);

  //this.openingDuration = this.doorSound.open.duration * 1000 * 0.8;
  //this.closingDuration = this.doorSound.close.duration * 1000 * 0.8;
  this.openingDuration = this.doorSound.open.duration * 1000;
  this.closingDuration = this.doorSound.close.duration * 1000;

  this.STATE_OPEN = 'open';
  this.STATE_CLOSED = 'closed';
  this.STATE_OPENING = 'opening';
  this.STATE_CLOSING = 'closing';

  this.doorOpenedCallback = null;
  this.doorClosedCallback = null;
}

Door.prototype = {
  setPos: function( xIn, yIn ) {
    this.x = xIn;
    this.y = yIn;
  },

  setStateToOpen: function() {
    this.state = this.STATE_OPEN;
    if ( this.doorOpenedCallback ) {
      this.doorOpenedCallback( this );
    }
  },
  setStateToClosed: function() {
    this.state = this.STATE_CLOSED;
    if ( this.doorClosedCallback ) {
      this.doorClosedCallback( this );
    }
  },
  setStateToOpening: function() {
    this.state = this.STATE_OPENING;
  },
  setStateToClosing: function() {
    this.state = this.STATE_CLOSING;
  },

  isOpen: function() {
    if ( this.state === this.STATE_OPEN ) {
      return true;
    }
    return false;
  },
  isClosed: function() {
    if ( this.state === this.STATE_CLOSED ) {
      return true;
    }
    return false;
  },
  isOpening: function() {
    return (this.state === this.STATE_OPENING);
  },
  isClosing: function() {
    return (this.state === this.STATE_CLOSING);
  },
  open: function( doorOpenedCallbackIn ) {
    if ( !this.isClosed() ) {
      return;
    }
    if ( doorOpenedCallbackIn ) {
      this.doorOpenedCallback = doorOpenedCallbackIn;
    }
    this.setStateToOpening();
    this.openStartTime = millis();
    this.doorSound.open.file.play();
  },
  close: function( doorClosedCallbackIn ) {
    if ( !this.isOpen() ) {
      return;
    }
    if ( doorClosedCallbackIn ) {
      this.doorClosedCallback = doorClosedCallbackIn;
    }
    this.setStateToClosing();
    this.closeStartTime = millis(); // maybe modify this if close() was called while door was opening
    this.doorSound.close.file.play();
  },
  fractionOpen: function() {
    var openingTimeDelta = millis() - this.openStartTime;
    var frac = openingTimeDelta / this.openingDuration;
    if ( frac > 1 ) {
      frac = 1;
    }
    return frac;
  },
  fractionClosed: function() {
    var closingTimeDelta = millis() - this.closeStartTime;
    var frac = closingTimeDelta / this.closingDuration;
    if ( frac > 1 ) {
      frac = 1;
    }
    return frac;
  },
  update: function() {
    // update state
    if ( this.isOpening() ) {
      if ( this.fractionOpen() >= 1 ) {
        this.setStateToOpen();
      }
    } else if ( this.isClosing() ) {
      if ( this.fractionClosed() >= 1 ) {
        this.setStateToClosed();
      }
    }
  },
  draw: function() {
    if ( this.isClosed() ) {
      // draw should not be called when it is closed but if it is then do nothing
      return;
    }

    var dw = this.doorWidth;
    var dh = this.doorHeight;

    if ( this.isOpening() ) {

      if ( this.doorSound.doorType === 'vertical' ) {

        dh = Math.easeInOutCubic( this.fractionOpen(), 0, this.doorHeight, 1 );

      } else if ( this.doorSound.doorType === 'horizontal' ) {

        dw = Math.easeInOutCubic( this.fractionOpen(), 0, this.doorWidth, 1 );

      } else if ( this.doorSound.doorType === 'horizontal2' ) {

        dw = Math.easeOutQuad( this.fractionOpen(), 0, this.doorWidth, 1 );

      }

    } else if ( this.isClosing() ) {

      if ( this.doorSound.doorType === 'vertical' ) {

        dh = Math.easeOutCubic( this.fractionClosed(), this.doorHeight, -this.doorHeight, 1 );

      } else if ( this.doorSound.doorType === 'horizontal' ) {

        dw = Math.easeOutCubic( this.fractionClosed(), this.doorWidth, -this.doorWidth, 1 );

      } else if ( this.doorSound.doorType === 'horizontal2' ) {

        dw = Math.easeOutBounce( this.fractionClosed(), this.doorWidth, -this.doorWidth, 1 );

      }

    }

    rectMode(CORNER);
    noStroke();
    fill(0);
    rect(this.x, this.y, dw, dh);

    // if ( this.doorSound.doorType === 'vertical' ) {
    //   rectMode(CORNER);
    //   //var h = Math.easeInOutCubic( millis() - this.openStartTime, 0, this.doorHeight, this.openingDuration );
    //   //rect(this.x,this.y,this.doorWidth, this.doorHeight * fractionOpen);
    // } else if ( this.doorSound.doorType === 'horizontal' ) {
    //   rectMode(CORNER);
    //   rect(this.x,this.y,this.doorWidth * fractionOpen, this.doorHeight);
    // }

  }
};

//----

// var doorIsOpen = false;
// var doorSound;
//
// function toggleDoor() {
//   if ( !doorIsOpen ) {
//     openDoor();
//   } else {
//     closeDoor();
//   }
// }
//
// // function pickDoorSound() {
// //   var rndIndex = floor(random(doorSounds.length));
// //   var doorSound = doorSounds[rndIndex];
// //   return doorSound;
// // }
// function openDoor() {
//   doorSound = pickDoorSound();
//   doorIsOpen = true;
//   doorSound.open.play();
// }
// function closeDoor() {
//   doorIsOpen = false;
//   doorSound.close.play();
// }

// t = current time
// b = start value
// c = change in value
// d = duration
Math.easeInOutCubic = function (t, b, c, d) {
	//var t = tin / (d/2);
  t /= d/2;
  // if ( t>.8 ) {
  //   console.log("t="+t+", c/2*t*t*t="+c/2*t*t*t);
  // }
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
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

Math.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};

Math.easeOutBounce = function (t, b, c, d) {
  if ((t/=d) < (1/2.75)) {
   return c*(7.5625*t*t) + b;
  } else if (t < (2/2.75)) {
   return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  } else if (t < (2.5/2.75)) {
   return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  } else {
   return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  }
};

Math.easeOutQuint = function (t, b, c, d) {
	t /= d;
	t--;
	return c*(t*t*t*t*t + 1) + b;
};

Math.easeInOutQuint = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t*t*t + 2) + b;
};

Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeOutQuad = function (t, b, c, d) {
	t /= d;
	return -c * t*(t-2) + b;
};
