let objects = []

var pause = false;

function loadObject(objfile, mtlfile, scale, position) {
  let mtlloader = new THREE.MTLLoader();
  mtlloader.load(mtlfile, function(materials) {
    let objloader = new THREE.OBJLoader();
    objloader.setMaterials(materials);
    objloader.load(objfile, function(object) {
      if (!(scale === undefined)) object.scale.set(scale.x, scale.y, scale.z);
      if (!(position === undefined)) object.position.set(position.x, position.y, position.z);
      scene.add(object);
      objects.push(object);
    });
  });
}

let raycaster = new THREE.Raycaster();
let objectPlanets = [];
let selection = null;

document.addEventListener('mousedown', onDocumentMouseDown)

let planetFollow = null;
function onDocumentMouseDown(event) {
  //console.log("yo")
  // Get mouse position
  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  // Get 3D vector from 3D mouse position using 'unproject' function
  var vector = new THREE.Vector3(mouseX, mouseY, 1);
  vector.unproject(camera);
  // Set the raycaster position
  raycaster.set(camera.position, vector.sub(camera.position ).normalize() );
  // Find all intersected objects
  var intersects = raycaster.intersectObjects(objectPlanets);
  if (intersects.length > 0) {
    // Disable the controls
    controls.enabled = false;
    // Set the selection - first intersected object
    selection = intersects[0].object;
    //console.log("hello")

    pause = false;
    sceneObject.pause = false;
    pauseController.setValue(pause);
    if (planetFollow !== selection)
    {
      planetFollow = selection;
    }
    else
    {
      planetFollow = null;
      controls.enabled = true;
    }
  }
    // Calculate the offset
    //console.log(planetFollow)

    //var intersects = raycaster.intersectObject(lesson10.plane);
    //lesson10.offset.copy(intersects[0].point).sub(lesson10.plane.position);
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

var trails = [];
var trailsActivated = false;
function addTrail(planet) {
    // adding the trails
    var trailHeadGeometry = [];
    var circle = new THREE.CircleGeometry( 1, 3 );
    trailHeadGeometry = circle.vertices;

    var trail = new THREE.TrailRenderer( scene, false );

    // create material for the trail renderer
    var trailMaterial = THREE.TrailRenderer.createBaseMaterial();
    trailMaterial.uniforms.headColor.value.set(1,1,1,1);
    trailMaterial.uniforms.tailColor.value.set(1,1,1,1);

    // specify length of trail
    var trailLength = 1000;

    // initialize the trail
    trail.initialize( trailMaterial, trailLength, false ? 1.0 : 0.0, 0, trailHeadGeometry, planet );

    trails.push(trail);
}

function activateTrails() {
  for (var i = 0; i < trails.length; i++) {
    trails[i].reset();
    trails[i].activate();
  }
}
function deactivateTrails() {
  for (var i = 0; i < trails.length; i++) {
    trails[i].deactivate();
  }
}
function advanceTrails() {
  for (var i = 0; i < trails.length; i++) {
    trails[i].advance();
  }
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
let controls = new THREE.OrbitControls(camera);
let dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
dragControls.addEventListener('dragstart', function() {
  controls.enabled = false;
});
dragControls.addEventListener('dragend', function() {
  controls.enabled = true;
});

// create all the planets
let sun = createSun("textures/sunSurfaceMaterial.jpg", 4);
let mercury = createPlanet("textures/mercury.jpg", 2);
let venus = createPlanet("textures/venus_surface.jpg", 2);
let earth = createPlanet("textures/earth.jpg", 2, undefined, "textures/earthspecmap.jpg", "textures/earthnormalmap.jpeg");
let clouds = createClouds("textures/clouds_2.jpg", 2.05);
let moon = createPlanet("textures/moon_texture.jpg", 0.5);
let mars = createPlanet("textures/mars.jpg", 2);
let jupiter = createPlanet("textures/jupiter.jpg", 2);
let saturn = createPlanet("textures/saturn.jpg", 2);
let ring = createRing("textures/saturn_ring.png", 3);
let uranus = createPlanet("textures/uranusmap.jpg", 2);
let neptune = createPlanet("textures/neptune.jpg", 2);

// Controls
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enableKeys = true;
controls.keyPanSpeed = 20;
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
// scene.add(ring);
scene.add(uranus);
scene.add(neptune);

addTrail(venus);
addTrail(earth);
addTrail(mars);
addTrail(mercury);
addTrail(jupiter);
addTrail(saturn);
addTrail(uranus);
addTrail(neptune);

objectPlanets.push(mercury);
objectPlanets.push(venus);
objectPlanets.push(mars);
objectPlanets.push(earth);
objectPlanets.push(jupiter);
objectPlanets.push(saturn);
objectPlanets.push(uranus);
objectPlanets.push(neptune);

const sunMass = 1.989 * Math.pow(10, 30);
const G = 6.67 * Math.pow(10, -11);
const venusDist = 70;

let earthStartingVelocity = new THREE.Vector3(100000.0, 0.0, 9999990.0);
let earthMass = 5.970 * Math.pow(10, 24);

var velocity = new THREE.Vector3(100000.0, 0.0, 9999990.0);


let sunPos = new THREE.Vector3(0, 0, 0);

let system = [];

let planetData = [];

let speedScale = 1;

var mercuryData = {
  mass: 3.370 * Math.pow(10, 21),
  position: new THREE.Vector3(30, 10, 0),
  distance: 65,
  velocity: new THREE.Vector3(19900.0, 0.0, 9900900.0),
  planet: mercury,
  increment: 0.0000001
}

var venusData = {
  mass: 5.970 * Math.pow(10, 24),
  position: new THREE.Vector3(70, -7, 0),
  distance: 90,
  velocity: new THREE.Vector3(100000.0, 0.0, 10000000.0),
  planet: venus,
  increment: 0.0000001 * 0.933
}

var earthData = {
  mass: 6.4190 * Math.pow(10, 23),
  position: new THREE.Vector3(130, 0, 0),
  distance: 130,
  velocity: new THREE.Vector3(100000.0, 0.0, 10000000.0),
  planet: earth,
  increment: 0.0000001 * 0.717
}

var marsData = {
  mass: 4.4190 * Math.pow(10, 22),
  position: new THREE.Vector3(190, 5, 0),
  distance: 200,
  velocity: new THREE.Vector3(1000000.0, 0.0, 10000000.0),
  planet: mars,
  increment: 0.0000001 * 0.7532
}

var jupiterData = {
  mass: 4.4190 * Math.pow(10, 26),
  position: new THREE.Vector3(300, 0, 0),
  distance: 220,
  velocity: new THREE.Vector3(990000.0, 0.0, 9900000.0),
  planet: jupiter,
  increment: 0.0000001 * 0.1355

}

var saturnData = {
  mass: 4.4190 * Math.pow(10, 26),
  position: new THREE.Vector3(400, 0, 0),
  distance: 250,
  velocity: new THREE.Vector3(900000.0, 0.0, 10000000.0),
  planet: saturn,
  increment: 0.0000001 * 0.0662
}

var uranusData = {
  mass: 1.08 * Math.pow(10, 27),
  position: new THREE.Vector3(450, 0, 0),
  distance: 300,
  velocity: new THREE.Vector3(900000.0, 0.0, 9999000.0),
  planet: uranus,
  increment: 0.0000001  * 0.03076
}

var neptuneData = {
  mass: 1.08 * Math.pow(10, 27),
  position: new THREE.Vector3(500, 0, 0),
  distance: 350,
  velocity: new THREE.Vector3(990000.0, 0.0, 9999000.0),
  planet: neptune,
  increment: 0.0000001 * 0.02384
}

var moonData = {
  mass: 7.3 * Math.pow(10, 22),
  position: new THREE.Vector3(131.00011, 0, 0),
  distance: 130,
  velocity: new THREE.Vector3(1000000.0, 0.0, 10000000.0),
  planet: moon,
  increment: 0.0000001 * 0.717
}

system.push("mercury")
system.push("venus")
system.push("earth")
system.push("mars")
system.push("jupiter")
system.push("saturn")
system.push("uranus")
system.push("neptune")
//system.push("moon")

mercury.position.x = 30;
mercury.position.z = -5;
mercury.position.y = 10;
venus.position.x = 70;
venus.position.y = -5;
earth.position.x = 120;
moon.position.x = 120;
mars.position.x = 195;
mars.position.y = 5;
jupiter.position.x = 295;
saturn.position.x = 375;
uranus.position.x = 430;
neptune.position.x = 480;
neptune.position.y = 0;

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


loadObject("obj/astronaut.obj", "mtl/astronaut.mtl", new THREE.Vector3(0.5, 0.5, 0.5), new THREE.Vector3(6, .25, 8));
loadObject("obj/rocket.obj", "mtl/rocket.mtl", new THREE.Vector3(0.01, 0.01, 0.01), new THREE.Vector3(5, 0, 5));
loadObject("obj/asteroid.obj", "mtl/asteroid.mtl", new THREE.Vector3(0.001, 0.001, 0.001), new THREE.Vector3(5.25, 0, 11));

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
venus.geometry.center();
clouds.geometry.center();
moon.geometry.center();
mars.geometry.center();
mercury.geometry.center();
jupiter.geometry.center();
saturn.geometry.center();
uranus.geometry.center();
neptune.geometry.center();

let render = function() {
  requestAnimationFrame(render);

  if (!trailsActivated) {
    sun.rotation.y -= 0.05 * speedScale;
    earth.rotation.y -= 0.05 * speedScale;
    clouds.rotation.y -= 0.0025 * speedScale;
    venus.rotation.y += 0.05 * speedScale;
    clouds.rotation.y -= 0.05 * speedScale;
    moon.rotation.y -= 0.005 * speedScale;
    mars.rotation.y -= 0.05 * speedScale;
    mercury.rotation.y -= 0.05 * speedScale;
    jupiter.rotation.y -= 0.05 * speedScale;
    saturn.rotation.y -= 0.05 * speedScale;
    uranus.rotation.y += 0.05 * speedScale;
    neptune.rotation.y -= 0.05 * speedScale;
  }

  if (!pause) {
    //earth.rotation.y -= 0.05;
    //clouds.rotation.y += 0.0025;
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
      let increment = planetData[i].increment * speedScale;
      //console.log(increment)

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
      //console.log(planetFollow)
      if (planetFollow === planetData[i].planet)
      {
        //console.log(planetFollow)
        //camera.position = new THREE.Vector3(planetData[i].planet.position.x, planetData[i].planet.position.y, planetData[i].planet.position.z - 10);
          let sunToPlanet = new THREE.Vector3(planetData[i].planet.position.x - sun.position.x, planetData[i].planet.position.y - sun.position.y, planetData[i].planet.position.z - sun.position.z);
          sunToPlanet.normalize();
          camera.position.x = planetData[i].planet.position.x + sunToPlanet.x * 10;

          camera.position.z = planetData[i].planet.position.z + sunToPlanet.z * 10;

          //console.log(earth.position.y)


          camera.position.y = 5 + planetData[i].planet.position.y;
            //console.log("yo")

          //camera.position.y = planetData[i].position.y + 5;

      }
    }
  }

  controls.update();
  if (trailsActivated) advanceTrails();
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(backgroundScene, backgroundCamera);
  renderer.render(scene, camera);
};

render();
