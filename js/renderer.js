var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var light = new THREE.PointLight(0xEEEEEE);
var lightAmb = new THREE.AmbientLight(0x777777);
var renderer = new THREE.WebGLRenderer({antialias: true});
var geometry = new THREE.SphereGeometry(2, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
var material = new THREE.MeshPhongMaterial();
var texture = new THREE.TextureLoader().load("textures/starry_bg.jpg");
var earthTexture = new THREE.TextureLoader().load("textures/earthmap.jpg");
material.map = earthTexture;
var sphere = new THREE.Mesh(geometry, material);
var controls = new THREE.OrbitControls(camera);

// Controls
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enableKeys = true;
// controls.minDistance
// controls.maxDistance
// controls.minPolarAngle
// controls.maxPolarAngle

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
light.position.set(20, 0, 20);
scene.add(light);
scene.add(lightAmb);
scene.add(sphere);
scene.background = texture;
camera.position.z = 5;

var render = function() {
  requestAnimationFrame(render);
  sphere.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
};

render();
