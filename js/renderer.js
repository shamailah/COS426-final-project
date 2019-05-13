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
var texture = new THREE.TextureLoader().load("textures/stars_milky_way.jpg");
var controls = new THREE.OrbitControls(camera);

// create all the planets
var sun = createPlanet("textures/sun.jpg", 8, new THREE.Vector3(0, 0, 0));
var mercury = createPlanet("textures/mercury.jpg", 2, new THREE.Vector3(-15, 0, 0));
var venus = createPlanet("textures/venus_surface.jpg", 2, new THREE.Vector3(-10, 0, 0));
var earth = createPlanet("textures/earth.jpg", 2, new THREE.Vector3(20, 0, 0));
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
//scene.add(mercury);
scene.add(mercury);
scene.add(venus);
scene.add(earth);
scene.add(mars);
scene.add(mercury);
scene.add(jupiter);
scene.add(saturn);
//scene.add(uranus);
scene.add(neptune);



const sunMass = 1.989 * Math.pow(10, 30);
//const earthMass = 5.970 * Math.pow(10, 24);
const G = 6.67 * Math.pow(10, -11);
const venusDist = 70;
let increment = 0.0000001;
// var startingAccel = new THREEVector3(0.0, 0.0, 0.2);

let earthStartingVelocity = new THREE.Vector3(100000.0, 0.0, 9999990.0);
let earthMass = 5.970 * Math.pow(10, 24);
//let earthStartingPos = new THREE.Vector3(earthDist, 0, 0);
var velocity = new THREE.Vector3(100000.0, 0.0, 9999990.0);

//var earthPos = new THREE.Vector3(earthDist, 0, 0);
let sunPos = new THREE.Vector3(0, 0, 0);

//earth.position.z = 0;



//console.log(earth.position.x);

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
  position: new THREE.Vector3(190, 0, 0),
  distance: 190,
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

var neptuneData = {
  mass: 1.08 * Math.pow(10, 27),
  position: new THREE.Vector3(500, 0, 0),
  distance: 350,
  velocity: new THREE.Vector3(900000.0, 0.0, 9999000.0),
  planet: neptune
}

system.push("mercury")
system.push("venus")
system.push("earth")
system.push("mars")
system.push("jupiter")
system.push("saturn")
system.push("neptune")

mercury.position.x = 45;
mercury.position.y = 25;
venus.position.x = 100;
venus.position.y = -35;
earth.position.x = 120;
mars.position.x = 195;
jupiter.position.x = 295;
saturn.position.x = 375;
neptune.position.x = 470;
//jupiter.position.y = 0;


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
    if (system[i] === "neptune"){
      planetData.push(neptuneData)
    }

  }


var render = function() {
  requestAnimationFrame(render);

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
    console.log("yeet")
  }

  for (let i = 0; i < planetData.length; i++)
  {

    let accelX = forcesX[i] / planetData[i].mass;
    let accelY = forcesY[i] / planetData[i].mass;
    let accelZ = forcesZ[i] / planetData[i].mass;
    let xVel = planetData[i].velocity.x + accelX * increment;
    let yVel = planetData[i].velocity.y + accelY * increment;
    let zVel = planetData[i].velocity.z + accelZ * increment;

    planetData[i].planet.position.add(new THREE.Vector3(xVel * increment, yVel * increment, zVel * increment));
    planetData[i].position.add(new THREE.Vector3(xVel * increment, yVel * increment, zVel * increment));
    //console.log(planetData[i].planet.position);
    planetData[i].velocity = new THREE.Vector3(xVel, yVel, zVel);

  }

  sun.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
};

render();
