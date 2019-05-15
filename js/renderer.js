let objects = []

var pause = false;

function loadObject(objfile, mtlfile, scale) {
  let mtlloader = new THREE.MTLLoader();
  mtlloader.load(mtlfile, function(materials) {
    let objloader = new THREE.OBJLoader();
    objloader.setMaterials(materials);
    objloader.load(objfile, function(object) {
      if (!(scale === undefined)) object.scale.set(scale.x, scale.y, scale.z);
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
  let sunTexture = new THREE.TextureLoader().load(texture);
  let sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
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
let raycaster = new THREE.Raycaster();
let controls = new THREE.OrbitControls(camera);
let dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
dragControls.addEventListener('dragstart', function() {
  controls.enabled = false;
});
dragControls.addEventListener('dragend', function() {
  controls.enabled = true;
});

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
scene.add(light);
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
scene.add(uranus);
scene.add(neptune);

const sunMass = 1.989 * Math.pow(10, 30);
const G = 6.67 * Math.pow(10, -11);
const venusDist = 70;
let increment = 0.0000001;

let earthStartingVelocity = new THREE.Vector3(100000.0, 0.0, 9999990.0);
let earthMass = 5.970 * Math.pow(10, 24);

var velocity = new THREE.Vector3(100000.0, 0.0, 9999990.0);


let sunPos = new THREE.Vector3(0, 0, 0);

let system = [];

let planetData = [];

var mercuryData = {
  mass: 3.370 * Math.pow(10, 21),
  position: new THREE.Vector3(30, 25, 0),
  distance: 64,
  velocity: new THREE.Vector3(19900.0, 0.0, 9900900.0),
  planet: mercury
}

var venusData = {
  mass: 5.970 * Math.pow(10, 24),
  position: new THREE.Vector3(70, -20, 0),
  distance: 110,
  velocity: new THREE.Vector3(100000.0, 0.0, 10000000.0),
  planet: venus
}

var earthData = {
  mass: 6.4190 * Math.pow(10, 23),
  position: new THREE.Vector3(130, 0, 0),
  distance: 130,
  velocity: new THREE.Vector3(100000.0, 0.0, 10000000.0),
  planet: earth
}

var marsData = {
  mass: 4.4190 * Math.pow(10, 22),
  position: new THREE.Vector3(190, 45, 0),
  distance: 205,
  velocity: new THREE.Vector3(1000000.0, 0.0, 10000000.0),
  planet: mars
}

var jupiterData = {
  mass: 4.4190 * Math.pow(10, 26),
  position: new THREE.Vector3(300, 0, 0),
  distance: 220,
  velocity: new THREE.Vector3(990000.0, 0.0, 9900000.0),
  planet: jupiter
}

var saturnData = {
  mass: 4.4190 * Math.pow(10, 26),
  position: new THREE.Vector3(400, 0, 0),
  distance: 250,
  velocity: new THREE.Vector3(900000.0, 0.0, 10000000.0),
  planet: saturn
}

var uranusData = {
  mass: 1.08 * Math.pow(10, 27),
  position: new THREE.Vector3(450, 0, 0),
  distance: 300,
  velocity: new THREE.Vector3(900000.0, 0.0, 9999000.0),
  planet: uranus
}

var neptuneData = {
  mass: 1.08 * Math.pow(10, 27),
  position: new THREE.Vector3(500, 70, 0),
  distance: 400,
  velocity: new THREE.Vector3(900000.0, 0.0, 9999000.0),
  planet: neptune
}

system.push("mercury")
system.push("venus")
system.push("earth")
system.push("mars")
system.push("jupiter")
system.push("saturn")
system.push("uranus")
system.push("neptune")

mercury.position.x = 45;
mercury.position.y = 25;
venus.position.x = 100;
venus.position.y = -35;
earth.position.x = 120;
mars.position.x = 195;
mars.position.y = 40;
jupiter.position.x = 295;
saturn.position.x = 375;
uranus.position.x = 430;
neptune.position.x = 470;
neptune.position.y = 50;

for (let i = 0; i < system.length; i++)
{
  if (system[i] === "mercury"){
    planetData.push(mercuryData)
  }
  if (system[i] === "venus"){
    planetData.push(venusData)

  }
  if (system[i] === "earth"){
    planetData.push(earthData)
  }
  if (system[i] === "mars"){
    planetData.push(marsData)
  }
  if (system[i] === "jupiter"){
    planetData.push(jupiterData)
  }
  if (system[i] === "saturn"){
    planetData.push(saturnData)
  }
  if (system[i] === "uranus"){
    planetData.push(uranusData)
  }
  if (system[i] === "neptune"){
    planetData.push(neptuneData)
  }
}


loadObject("obj/astronaut.obj", "mtl/astronaut.mtl", new THREE.Vector3(0.5, 0.5, 0.5));
loadObject("obj/rocket.obj", "mtl/rocket.mtl", new THREE.Vector3(0.01, 0.01, 0.01));
loadObject("obj/asteroid.obj", "mtl/asteroid.mtl", new THREE.Vector3(0.001, 0.001, 0.001));

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

//Set the moon's orbital radius, start angle, and angle increment value
var r = 5;
var theta = 0;
var dTheta = 2 * Math.PI / 300;
earth.geometry.center();
clouds.geometry.center();

let render = function() {
  requestAnimationFrame(render);
  earth.rotation.y += 0.005;
  clouds.rotation.y -= 0.0025;
  if (!pause) {
    let forcesX = [];
    let forcesY = [];
    let forcesZ = [];

    for (let i = 0; i < planetData.length; i++)
    {
      let forcesXTemp = 0;
      let forcesYTemp = 0;
      let forcesZTemp = 0;

      for (let j = 0; j < planetData.length; j++)
      {
        if (i == j)
        {
          continue;
        }
        let diffVec = (new THREE.Vector3()).subVectors(planetData[i].position, planetData[j].position);
        forceCalc = (G * planetData[j].mass * planetData[i].mass) / (diffVec.length() * diffVec.length() * 10000)
        let forceX = forceCalc * (planetData[j].position.x - planetData[i].position.x) / diffVec.length();
        let forceZ = forceCalc * (planetData[j].position.z - planetData[i].position.z) / diffVec.length();
        let forceY = forceCalc * (planetData[j].position.y - planetData[i].position.y) / diffVec.length();
        forcesXTemp += forceX;
        forcesYTemp += forceY;
        forcesZTemp += forceZ;
      }
      let forceCalcSun = (G * sunMass * planetData[i].mass) / (planetData[i].distance * planetData[i].distance * 10000)
      let forceXSun = forceCalcSun * (sunPos.x - planetData[i].position.x) / planetData[i].distance;
      let forceZSun = forceCalcSun * (sunPos.z - planetData[i].position.z) / planetData[i].distance;
      let forceYSun = forceCalcSun * (sunPos.y - planetData[i].position.y) / planetData[i].distance;

      forcesXTemp += forceXSun;
      forcesYTemp += forceYSun;
      forcesZTemp += forceZSun;

      forcesX.push(forcesXTemp);
      forcesY.push(forcesYTemp);
      forcesZ.push(forcesZTemp);
    }

    for (let i = 0; i < planetData.length; i++)
    {

      let accelX = forcesX[i] / planetData[i].mass;
      let accelY = forcesY[i] / planetData[i].mass;
      let accelZ = forcesZ[i] / planetData[i].mass;
      let xVel = planetData[i].velocity.x + accelX * increment;
      let yVel = planetData[i].velocity.y + accelY * increment;
      let zVel = planetData[i].velocity.z + accelZ * increment;


      let newPosition = new THREE.Vector3(xVel * increment, yVel * increment, zVel * increment);
      planetData[i].planet.position.add(newPosition);
      planetData[i].position.add(newPosition);
      if (planetData[i].planet === earth) {
        clouds.position.copy(earth.position);
        theta += dTheta;
        moon.position.y = earth.position.y;
        moon.position.x = earth.position.x + r * Math.cos(theta);
        moon.position.z = earth.position.z + r * Math.sin(theta);
      }
      planetData[i].velocity = new THREE.Vector3(xVel, yVel, zVel);
    }
  }

  controls.update();
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(backgroundScene, backgroundCamera);
  renderer.render(scene, camera);
};

render();
