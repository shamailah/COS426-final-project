function createPlanet(texture, radius, d) {
  var planetGeometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  if (!(d === undefined)) planetGeometry.translate(d.x, d.y, d.z);
  var planetMaterial = new THREE.MeshPhongMaterial();
  var planetTexture = new THREE.TextureLoader().load(texture);
  planetMaterial.map = planetTexture;
  var planet = new THREE.Mesh(planetGeometry, planetMaterial);
  return planet;
}

var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var light = new THREE.PointLight(0xEEEEEE);
var lightAmb = new THREE.AmbientLight(0x777777);
var renderer = new THREE.WebGLRenderer({antialias: true});
var controls = new THREE.OrbitControls(camera);

// create all the planets
var sun = createPlanet("textures/sun.jpg", 4, new THREE.Vector3(0, 4, -5));
var mercury = createPlanet("textures/mercury.jpg", 2, new THREE.Vector3(-15, 0, 0));
var venus = createPlanet("textures/venus_surface.jpg", 2, new THREE.Vector3(-10, 0, 0));
var earth = createPlanet("textures/earth.jpg", 2);
var mars = createPlanet("textures/mars.jpg", 2, new THREE.Vector3(-5, 0, 0));
var jupiter = createPlanet("textures/jupiter.jpg", 2, new THREE.Vector3(5, 0, 0));
var saturn = createPlanet("textures/saturn.jpg", 2, new THREE.Vector3(10, 0, 0));
var uranus = createPlanet("textures/uranusmap.jpg", 2, new THREE.Vector3(15, 0, 0));
var neptune = createPlanet("textures/neptune.jpg", 2, new THREE.Vector3(20, 0, 0));
// Controls
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enableKeys = true;
// controls.minDistance
// controls.maxDistance
// controls.minPolarAngle
// controls.maxPolarAngle

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
light.position.set(20, 0, 20);
camera.position.z = 20;
scene.background = texture;
scene.add(light);
scene.add(lightAmb);
scene.add(sun);
scene.add(mercury);
scene.add(venus);
scene.add(earth);
scene.add(mars);
scene.add(jupiter);
scene.add(saturn);
scene.add(uranus);
scene.add(neptune);
console.log(scene);

this.sceneDatGui = new dat.GUI(); // controls the meshes in the scene
this.controlListDatGui = new dat.GUI(); // controls each of the meshes
this.sceneObject = new SceneObject(scene);

var planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'earth'];

for (var i = 0; i < planetNames.length; i++) {
  this.sceneObject[planetNames[i]] = true;
  this.sceneObject.bodies[planetNames[i]] = new PlanetInfo();
  var controller = this.sceneDatGui.add(this.sceneObject, planetNames[i]);
  this.sceneObject.bodies[planetNames[i]].controller = controller;
  this.sceneObject.bodies[planetNames[i]].mesh = window[planetNames[i]];
}

// handling the controller events
this.sceneObject.bodies.mercury.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.mercury.mesh);
  else scene.remove(this.object.bodies.mercury.mesh)
});
this.sceneObject.bodies.venus.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.venus.mesh);
  else scene.remove(this.object.bodies.venus.mesh);
});
this.sceneObject.bodies.mars.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.mars.mesh);
  else scene.remove(this.object.bodies.mars.mesh);
});
this.sceneObject.bodies.jupiter.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.jupiter.mesh);
  else scene.remove(this.object.bodies.jupiter.mesh);
});
this.sceneObject.bodies.saturn.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.saturn.mesh);
  else scene.remove(this.object.bodies.saturn.mesh);
});
this.sceneObject.bodies.uranus.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.uranus.mesh);
  else scene.remove(this.object.bodies.uranus.mesh);
});
this.sceneObject.bodies.neptune.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.neptune.mesh);
  else scene.remove(this.object.bodies.neptune.mesh);
});
this.sceneObject.bodies.earth.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.earth.mesh);
  else scene.remove(this.object.bodies.earth.mesh);
});

function SceneObject(scene) {
  this.scene = scene;
  this.bodies = {};
}

function PlanetInfo() {
  this.radius = 1;
  this.mass = 1;
  this.speed = 10;
  this.location = new THREE.Vector3(0, 4, -5);
  this.inScene = false;
  this.controller = undefined;
  this.mesh = undefined;
}


// Load the background texture
var texture = new THREE.TextureLoader().load('textures/stars_milky_way.jpg');
texture.minFilter = THREE.LinearFilter;
var backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
        map: texture
    }));

backgroundMesh.material.depthTest = false;
backgroundMesh.material.depthWrite = false;

// Create your background scene
var backgroundScene = new THREE.Scene();
var backgroundCamera = new THREE.Camera();
backgroundScene.add(backgroundCamera );
backgroundScene.add(backgroundMesh );                                                

var render = function() {
  requestAnimationFrame(render);
  earth.rotation.y += 0.01;
  controls.update();
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(backgroundScene, backgroundCamera);
  renderer.render(scene, camera);
};

render();
