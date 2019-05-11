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
//scene.add(jupiter);
//scene.add(saturn);
//scene.add(uranus);
//scene.add(neptune);



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
  position: new THREE.Vector3(30, 0, 0),
  distance: 60,
  velocity: new THREE.Vector3(19900.0, 0.0, 9900900.0),
  planet: mercury
}


var venusData = {
  mass: 5.970 * Math.pow(10, 24),
  position: new THREE.Vector3(venusDist, 0, 0),
  distance: 100,
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

system.push("venus")
system.push("earth")
system.push("mars")
system.push("mercury")

mercury.position.x = 45;
//mercury.position.y = 45;
venus.position.x = 90;
earth.position.x = 120;
mars.position.x = 195;


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

  }


var render = function() {
  requestAnimationFrame(render);

  

  for (let i = 0; i < planetData.length; i++)
  {
    let forceCalc = (G * sunMass * planetData[i].mass) / (planetData[i].distance * planetData[i].distance * 10000)
    let forceX = forceCalc * (sunPos.x - planetData[i].position.x) / planetData[i].distance;
    let forceZ = forceCalc * (sunPos.z - planetData[i].position.z) / planetData[i].distance;
    let forceY = forceCalc * (sunPos.y - planetData[i].position.y) / planetData[i].distance;
    let accelX = forceX / planetData[i].mass;
    let accelY = forceY / planetData[i].mass;
    let accelZ = forceZ / planetData[i].mass;
    let xVel = planetData[i].velocity.x + accelX * increment;
    let yVel = planetData[i].velocity.y + accelY * increment;
    let zVel = planetData[i].velocity.z + accelZ * increment;

    planetData[i].planet.position.add(new THREE.Vector3(xVel * increment, yVel * increment, zVel * increment));
    planetData[i].position.add(new THREE.Vector3(xVel * increment, yVel * increment, zVel * increment));
    //console.log(planetData[i].planet.position);
    planetData[i].velocity = new THREE.Vector3(xVel, yVel, zVel);


  }
  //var axis = new THREE.Vector3(5, 5, 5);
  //let earthPos = new THREE.Vector3(earth.vertex.x, earth.vertex.y, earth.vertex.z);
  //let sunPos = new THREE.Vector3(sun.vertex.x, sun.vertex.y, sun.vertex.z);
  //console.log(sunPos);
 

  //console.log("xVel: " + xVel * increment);
  //console.log("zVel: " + zVel * increment);

  // earth.translateOnAxis(new THREE.Vector3(1, 0, 0), xVel * increment);

  //let totalAccel = accelX + accelZ;
  //let totalV = Math.sqrt(zVel * zVel + xVel * xVel)
  //earth.translateOnAxis(new THREE.Vector3(accelX / totalAccel, 0, accelZ / totalAccel), totalV);

  //earth.translateOnAxis(new THREE.Vector3(1, 0, 0), xVel * increment);
  //earth.translateOnAxis(new THREE.Vector3(0, 0, 1), zVel * increment);
  //earth.translateOnAxis(new THREE.Vector3(1, 0, 0), xVel * increment);
  //earth.translateOnAxis(new THREE.Vector3(0, 1, 0));
  //earth.translateOnAxis(new THREE.Vector3(1, 0, 0), xVel * increment);

  //earth.geometry.x = earth.geometry.x + xVel * increment;
  //earth.geometry.z = earth.geometry.z + zVel * increment;
  //earth.geometry.translate(new THREE.Vector3(0.01, 0.011, 0.01));

  /* let forceCalc = (G * sunMass * earthMass) / (earthDist * earthDist * 10000);
  let forceX = forceCalc * (sunPos.x - earthPos.x) / earthDist;
  let forceZ = forceCalc * (sunPos.z - earthPos.z) / earthDist;

  let accelX = forceX / earthMass;
  let accelZ = forceZ / earthMass;
  let xVel = velocity.x + accelX * increment;
  let zVel = velocity.z + accelZ * increment;

 
  earth.position.add(new THREE.Vector3(xVel * increment, 0, zVel * increment));
  //console.log(earth.position.z)
  earthPos.add(new THREE.Vector3(xVel * increment, 0, zVel * increment));
  //console.log(earthPos);

  velocity = new THREE.Vector3(xVel, 0, zVel);*/



  //earth.position.x += 0.01;


  //earth.rotation.y += 0.01;
  //earth.rotation.z += 0.01;
  //earth.rotateOnAxis(axis, 0.4);
  // earth.position.x += 0.01;

  // jupiter.rotation.z += 0.015;
  sun.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
};

render();
