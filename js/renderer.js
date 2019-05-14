let objects = []

function loadObject(objfile, mtlfile) {
  let mtlloader = new THREE.MTLLoader();
  mtlloader.load(mtlfile, function(materials) {
    let objloader = new THREE.OBJLoader();
    objloader.setMaterials(materials);
    objloader.load(objfile, function(object) {
      scene.add(object);
      objects.push(object);
    });
  });
}

function createPlanet(texture, radius, position, specularTexture, normalTexture) {
  let planetGeometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  let planetTexture = new THREE.TextureLoader().load(texture);
  let planetMaterial = new THREE.MeshPhongMaterial({map: planetTexture});
  if (!(specularTexture === undefined)) {
    let specularMap = new THREE.TextureLoader().load(specularTexture);
    planetMaterial.specularMap = specularMap;
  }
  if (!(normalTexture === undefined)) {
    let normalMap = new THREE.TextureLoader().load(normalTexture);
    planetMaterial.nomralMap = normalMap;
  }
  let planet = new THREE.Mesh(planetGeometry, planetMaterial);
  if (!(position === undefined)) planet.position.set(position.x, position.y, position.z);
  return planet;
}

function createClouds(texture, radius) {
  let cloudGeometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  let cloudMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(texture),
    transparent: true,
    opacity: 0.2
  });
  let clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  return clouds;
}

function createSun(texture, radius, position) {
  let sunGeometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  let sunMaterial = new THREE.MeshBasicMaterial();
  let sunTexture = new THREE.TextureLoader().load(texture);
  sunMaterial.map = sunTexture;
  let sun = new THREE.Mesh(sunGeometry, sunMaterial);
  if (!(position === undefined)) sun.position.set(position.x, position.y, position.z);

  // create light
  let light = new THREE.PointLight( 0xffffff, 1.2, 100000 );
  if (!(position === undefined)) light.position.set(position.x, position.y, position.z);
  light.add(sun);

  return light;
}

function createRing(texture, radius, position) {
  let ringGeometry = new THREE.RingGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  let ringTexture = new THREE.TextureLoader().load(texture);
  let ringMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map:ringTexture});
  let ring = new THREE.Mesh(ringGeometry, ringMaterial);
  if (!(position === undefined)) ring.position.set(position.x, position.y, position.z);
  return ring;
}

let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
let light = new THREE.PointLight(0xEEEEEE);
let lightAmb = new THREE.AmbientLight(0x777777);
let renderer = new THREE.WebGLRenderer({antialias: true});
let controls = new THREE.OrbitControls(camera);

// create all the planets
let sun = createSun("textures/sunSurfaceMaterial.jpg", 4, new THREE.Vector3(0, 4, -5));
let mercury = createPlanet("textures/mercury.jpg", 2, new THREE.Vector3(-15, 0, 0));
let venus = createPlanet("textures/venus_surface.jpg", 2, new THREE.Vector3(-10, 0, 0));
let earth = createPlanet("textures/earth.jpg", 2, undefined, "textures/earthspecmap.jpg", "textures/earthnormalmap.jpeg");
let clouds = createClouds("/textures/clouds_2.jpg", 2.05);
let moon = createPlanet("textures/moon_texture.jpg", 0.5);
let mars = createPlanet("textures/mars.jpg", 2, new THREE.Vector3(-5, 0, 0));
let jupiter = createPlanet("textures/jupiter.jpg", 2, new THREE.Vector3(5, 0, 0));
let saturn = createPlanet("textures/saturn.jpg", 2, new THREE.Vector3(10, 0, 0));
let ring = createRing("textures/saturn_ring.png", 3, new THREE.Vector3(10, 0, 0));
let uranus = createPlanet("textures/uranusmap.jpg", 2, new THREE.Vector3(15, 0, 0));
let neptune = createPlanet("textures/neptune.jpg", 2, new THREE.Vector3(20, 0, 0));

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
// scene.add(light);
scene.add(lightAmb);
scene.add(sun);
scene.add(mercury);
scene.add(venus);
scene.add(earth);
scene.add(clouds);
scene.add(moon);
scene.add(mars);
scene.add(jupiter);
scene.add(saturn);
scene.add(ring);
scene.add(uranus);
scene.add(neptune);

loadObject("obj/astronaut.obj", "mtl/astronaut.mtl");
// loadObject("obj/rocket.obj", "mtl/rocket.mtl");
// loadObject("obj/asteroid.obj", "mtl/asteroid.mtl");

// Load the background texture
let texture = new THREE.TextureLoader().load('textures/stars_milky_way.jpg');
texture.minFilter = THREE.LinearFilter;
let backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
        map: texture
    }));

backgroundMesh.material.depthTest = false;
backgroundMesh.material.depthWrite = false;

// Create your background scene
let backgroundScene = new THREE.Scene();
let backgroundCamera = new THREE.Camera();
backgroundScene.add(backgroundCamera);
backgroundScene.add(backgroundMesh);

// Set the moon's orbital radius, start angle, and angle increment value
let r = 5;
let theta = 0;
let dTheta = 2 * Math.PI / 1000;

let render = function() {
  requestAnimationFrame(render);
  earth.rotation.y += 0.0005;
  clouds.rotation.y -= 0.00025;

  //Increment theta, and update moon x and y
  //position based off new theta value
  theta += dTheta;
  moon.position.x = r * Math.cos(theta);
  moon.position.z = r * Math.sin(theta);

  controls.update();
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(backgroundScene, backgroundCamera);
  renderer.render(scene, camera);
};

render();
