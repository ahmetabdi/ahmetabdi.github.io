var camera, scene, renderer;
var cameraOrtho, sceneOrtho;

var spriteTL, spriteTR, spriteBL, spriteBR, spriteC;

var mapC;

var group;

init();
animate();

function init() {

  var width = window.innerWidth;
  var height = 100;//window.innerHeight;

  camera = new THREE.PerspectiveCamera( 20, width / height, 1, 2100 );
  camera.position.z = 500;

  cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
  cameraOrtho.position.z = 10;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x000000, 1500, 2100 );

  sceneOrtho = new THREE.Scene();

  // create sprites

  var amount = 200;
  var radius = 500;

  var mapA = THREE.ImageUtils.loadTexture( "/ruby.png", undefined, createHUDSprites );
  var mapB = THREE.ImageUtils.loadTexture( "/ruby.png" );
  mapC = THREE.ImageUtils.loadTexture( "/ruby.png" );

  group = new THREE.Group();

  var materialC = new THREE.SpriteMaterial( { map: mapC, color: 0xffffff, fog: true } );
  var materialB = new THREE.SpriteMaterial( { map: mapB, color: 0xAA0F00, fog: true } );

  for ( var a = 0; a < amount; a ++ ) {

    var x = Math.random() - 0.5;
    var y = Math.random() - 0.5;
    var z = Math.random() - 0.5;

    if ( z < 0 ) {

      material = materialB.clone();

    } else {

      material = materialC.clone();
      material.color.setHSL( 0.5 * Math.random(), 0.75, 0.5 );
      material.map.offset.set( -0.5, -0.5 );
      material.map.repeat.set( 2, 2 );

    }

    var sprite = new THREE.Sprite( material );

    sprite.position.set( x, y, z );
    sprite.position.normalize();
    sprite.position.multiplyScalar( radius );

    group.add( sprite );

  }

  scene.add( group );

  // renderer

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, 100);//window.innerWidth, window.innerHeight );
  renderer.autoClear = false; // To allow render overlay on top of sprited sphere

  document.body.appendChild( renderer.domElement );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function createHUDSprites ( texture ) {


};

function onWindowResize() {

  var width = window.innerWidth;
  var height = 100;//window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  cameraOrtho.left = - width / 2;
  cameraOrtho.right = width / 2;
  cameraOrtho.top = height / 2;
  cameraOrtho.bottom = - height / 2;
  cameraOrtho.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, 100);

}

function animate() {

  requestAnimationFrame( animate );
  render();

}

function render() {

  var time = Date.now() / 1000;

  for ( var i = 0, l = group.children.length; i < l; i ++ ) {

    var sprite = group.children[ i ];
    var material = sprite.material;
    var scale = Math.sin( time + sprite.position.x * 0.01 ) * 0.3 + 1.0;

    var imageWidth = 1;
    var imageHeight = 1;

    if ( material.map && material.map.image && material.map.image.width ) {

      imageWidth = material.map.image.width;
      imageHeight = material.map.image.height;

    }

    sprite.material.rotation += 0.1 * ( i / l );
    sprite.scale.set( scale * imageWidth, scale * imageHeight, 1.0 );

    if ( material.map !== mapC ) {

      material.opacity = Math.sin( time + sprite.position.x * 0.01 ) * 0.4 + 0.6;

    }

  }

  group.rotation.x = time * 0.5;
  group.rotation.y = time * 0.75;
  group.rotation.z = time * 1.0;

  renderer.clear();
  renderer.render( scene, camera );
  renderer.clearDepth();
  renderer.setClearColor( 0xffffff, 0);
  renderer.render( sceneOrtho, cameraOrtho );

}
