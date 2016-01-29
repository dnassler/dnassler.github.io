
var scene, camera, renderer;
// var geometry, material, mesh;
var controls, stats;
var controlAttr;
var clock = new THREE.Clock();
var light1;
var ground;

var pArr = [];
var numPlanes = 10;
var planeSeparation = 50;
var lookAtVec = new THREE.Vector3(0,0,-numPlanes*planeSeparation);
var CAMERA_MANUAL = 'manual';
var CAMERA_LIGHT = 'light';
var CAMERA_AUTO = 'auto';
var lineToLight = new THREE.Line3();

init();
animate();

//x=-309.1
//y=25.134
//z=-446.843
//zoom=0.5133420832795047

function init() {

    scene = new THREE.Scene();

    var f = .5;
    //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    //camera = new THREE.OrthographicCamera( window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, -200, 1000 );
    camera = new THREE.OrthographicCamera( window.innerWidth /( - 16*f), window.innerWidth / (16*f), window.innerHeight / (16*f), window.innerHeight / - (16*f), -200, 1000 );


    var w = 100;
    var h = 100;

    var i;
    for ( i=1; i<numPlanes; i++ ) {
      pArr.push( {p:newPlane( w, h, -i*planeSeparation ), rspeed:(Math.random()*0.01-0.005)} );
    }

    var geometry = new THREE.BoxGeometry( 400, 0.15, 600 );
    var material = new THREE.MeshPhongMaterial( {
      color: 0xa0adaf,
      shininess: 150,
      specular: 0xffffff,
      shading: THREE.SmoothShading
    } );

    ground = new THREE.Mesh( geometry, material );
    //ground.scale.multiplyScalar( 1 );
    ground.position.set(0,-100,-i*planeSeparation/2);
    ground.castShadow = false;
    ground.receiveShadow = true;
    scene.add( ground );

    // geometry = new THREE.PlaneGeometry( 200, 200 );
    // material = new THREE.MeshLambertMaterial( { color: 0xff0000, wireframe: false, side: THREE.DoubleSide } );
    //
    // mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );
    //
    // //console.log('plane vertices');
    // var count = 0;
    // geometry.vertices.forEach( function(e) {
    //   //console.log(e);
    //   var nx = e.x + Math.random()*100-50;
    //   var ny = e.y + Math.random()*100-50;
    //   var nz = e.z + Math.random()*100-50;
    //   geometry.vertices[count].set(nx, ny, nz);
    //   count++;
    // });
    // geometry.verticesNeedUpdate = true;


    var sphere = new THREE.SphereGeometry( 10, 16, 8 );

    //light1 = new THREE.DirectionalLight( 0xffffff, 2 );

    var smf = 1;
    light1 = new THREE.PointLight( 0xffffff, 1, 1000 );
    light1.castShadow = true;
    light1.shadowCameraNear = 1;
    light1.shadowCameraFar = 1000;
    light1.shadowMapWidth = 1024*smf;
    light1.shadowMapHeight = 1024*smf;
    light1.target = ground;
    // light1.shadowBias = 0.01;
    // light1.shadowDarkness = 0.5;

    //light1.shadowCameraNear = 2;
    //light1.shadowCameraFar = 1000;
    //light1.shadowCameraLeft = -50;
    //light1.shadowCameraRight = 50;
    //light1.shadowCameraTop = 50;
    //light1.shadowCameraBottom = -50;
    //light1.shadowCameraVisible = true;


    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
    light1.position.set(0,100,50);
    scene.add( light1 );
    //scene.add( new THREE.CameraHelper( light1.shadow.camera ) );

    var light = new THREE.AmbientLight( 0x202020 ); // soft white light
    //var light = new THREE.AmbientLight( 0x000000 ); // soft white light
    scene.add( light );

    //x=-309.1
    //y=25.134
    //z=-446.843
    camera.position.set(-309.1, 25.134, -446.843);
    // camera.zoom = 0.5133420832795047;
    camera.zoom = 0.46767497911552943;
    camera.aspect = 2.7195467422096318;
    //camera.position.z = 100;
    //camera.position.y = 0;

    camera.lookAt( lookAtVec );

    controlAttr = new function () {
        // this.cameraHeight = camera.position.y;
        // this.cameraZ = camera.position.z;
        //this.lightHeight = light1.position.y;
        this.rotateSpeed = 22;
        //this.cameraFromLight = false;
        // this.cameraPerspective = CAMERA_AUTO;
        this.cameraPerspective = CAMERA_MANUAL;

    };

    var gui = new dat.GUI();
    //gui.add( controlAttr, 'lightHeight', 100, 1000);
    gui.add( controlAttr, 'rotateSpeed', 1, 50);
    //gui.add( controlAttr, 'cameraFromLight' );
    gui.add( controlAttr, 'cameraPerspective', [CAMERA_MANUAL, CAMERA_LIGHT, CAMERA_AUTO] );
    // gui.add(controlAttr, 'cameraHeight', -300, 1000);
    // gui.add(controlAttr, 'cameraZ', -400, 1000);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000 );
    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.shadowMap.needsUpdate = true;



    document.body.appendChild( renderer.domElement );

    // the TrackballControls must be after renderer.domElement is added to the HTML
    // controls = new THREE.TrackballControls( camera, renderer.domElement );
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.3;
    // controls.keys = [ 65, 83, 68 ];
    // controls.addEventListener( 'change', render );

    // Mouse control
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, -numPlanes*planeSeparation/2 );
    controls.update();



    clock = new THREE.Clock();

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  // dirLightShadowMapViewer.updateForWindowResize();
  // spotLightShadowMapViewer.updateForWindowResize();

}


function animate() {

    requestAnimationFrame( animate );

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;

    //renderer.render( scene, camera );
    //controls.update(clock.getDelta());
    var time = clock.getElapsedTime();


    light1.position.z = 300 * Math.sin(time*0.2) - 250;
    light1.position.x = 100 * Math.cos(time*0.1);
    light1.position.y = 300 * (Math.cos(time*0.12)+1) + 100;//controlAttr.lightHeight;

    pArr.forEach(function(mi){
      lineToLight.set(light1.position, mi.p.position);
      var distToLight = lineToLight.distance();
      if ( distToLight < 300 ) {
        var rspeedFactor = distToLight < 0.1 ? 100 : 10*100*100/(distToLight*distToLight);
        rspeedFactor = rspeedFactor > 100 ? 100 : rspeedFactor;
        mi.p.rotation.z += 0.001*rspeedFactor*controlAttr.rotateSpeed;//mi.rspeed*controlAttr.rotateSpeed * rspeedFactor;
      }
    });

    if ( controlAttr.cameraPerspective === CAMERA_LIGHT ) {
      var cameraOffsetX = 200 * Math.sin(time*0.1);
      camera.position.set(light1.position.x+cameraOffsetX, light1.position.y+100, light1.position.z);
      camera.lookAt(controls.target.x, controls.target.y, controls.target.z);
    } else if ( controlAttr.cameraPerspective === CAMERA_AUTO ) {
      var cameraOffsetX = 400 * Math.sin(time*0.25);
      var cameraOffsetY = 150 * (Math.cos(time*0.2)+1) + 100;
      var cameraOffsetZ = 400 * Math.cos(time*0.28);
      camera.position.set( ground.position.x + cameraOffsetX, cameraOffsetY, ground.position.z + cameraOffsetZ );
      camera.lookAt(controls.target.x, controls.target.y, controls.target.z);
    }



    controls.update();


    // camera.position.y = controlAttr.cameraHeight;
    // camera.position.z = controlAttr.cameraZ;
    // camera.lookAt( lookAtVec );

    //camera.lookAt(0,0,-numPlanes*planeSeparation/2);


    render();
}

function render() {
  renderer.render( scene, camera );
  stats.update();
}

// --

function newPlane(w, h, z) {

  var geometry, material, mesh;

  z = z || 0;

  //geometry = new THREE.PlaneGeometry( w, h );
  geometry = new THREE.BoxGeometry(w,h,w/10);
  material = new THREE.MeshPhongMaterial( {
    color: 0xff0000,
    shininess: 50,
    specular: 0x222222,
    side: THREE.DoubleSide,
    // shading: THREE.FlatShading

    // color: 0x156289,
    // emissive: 0x072534,
    // wireframe: false,
    // side: THREE.DoubleSide,
    // shading: THREE.FlatShading,
    // transparent: false,
    // opacity: 0.2
   } );
  //  material = new THREE.MeshLambertMaterial( {
  //    color: Math.random()*0xffffff,
  //    wireframe: false,
  //    side: THREE.DoubleSide,
  //    transparent: false,
  //    opacity: 0.2
  //   } );


  mesh = new THREE.Mesh( geometry, material );
  mesh.position.z = z;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add( mesh );

  //console.log('plane vertices');
  var distortAmt = w/10;
  var count = 0;
  geometry.vertices.forEach( function(e) {
    //console.log(e);
    var nx = e.x + Math.random()*distortAmt-distortAmt/2;
    var ny = e.y + Math.random()*distortAmt-distortAmt/2;
    var nz = e.z;// + Math.random()*distortAmt-distortAmt/2;
    geometry.vertices[count].set(nx, ny, nz);
    count++;
  });
  geometry.verticesNeedUpdate = true;

  return mesh;
}
