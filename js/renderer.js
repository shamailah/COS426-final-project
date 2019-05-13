let uniforms;

var pause = false;

function loadObject(objfile, mtlfile) {
  var mtlloader = new THREE.MTLLoader();
  mtlloader.load(mtlfile, function(materials) {
    var objloader = new THREE.OBJLoader();
    objloader.setMaterials(materials);
    objloader.load(objfile, function(object) {
      scene.add(object);
    });
  });
}

function createPlanet(texture, radius, d, specTexture, normalTexture) {
  var planetGeometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  if (!(d === undefined)) planetGeometry.translate(d.x, d.y, d.z);
  var planetMaterial = new THREE.MeshPhongMaterial();
  var planetTexture = new THREE.TextureLoader().load(texture);
  planetMaterial.map = planetTexture;
  if (!(specTexture === undefined)) {
    var specMap = new THREE.TextureLoader().load(specTexture);
    planetMaterial.specularMap = specMap;
  }
  if (!(normalTexture === undefined)) {
    var normMap = new THREE.TextureLoader().load(normalTexture);
    planetMaterial.nomralMap = normMap;
  }
  var planet = new THREE.Mesh(planetGeometry, planetMaterial);
  return planet;
}

function createClouds(texture, radius) {
  var cloudGeometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  var cloudMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(texture),
    transparent: true,
    opacity: 0.2
  });
  var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  return clouds;
}

function createSunMaterial() {
  uniforms = {
      time: {
          type: "f",
          value: 1.0
      },
      texture1: {
          type: "t",
          value: 0,
          texture: new THREE.TextureLoader().load("textures/sunAtmosphereMaterial.png")
      },
      texture2: {
          type: "t",
          value: 1,
          texture: new THREE.TextureLoader().load("textures/sunSurfaceMaterial.jpg")
      }
  };
  uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.Repeat;
  uniforms.texture2.texture.wrapS = uniforms.texture2.texture.wrapT = THREE.Repeat;
  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: 'varying vec2 texCoord;\n' +
                    'void main() {\n' +
                    '	texCoord = uv;\n' +
                    '	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n' +
                    '	gl_Position = projectionMatrix * mvPosition;\n' +
                    '}',
    fragmentShader: 'uniform float time;\n' +
                    'uniform sampler2D texture1;\n' +
                    'uniform sampler2D texture2;\n' +
                    'varying vec2 texCoord;\n' +
                    'void main( void ) {\n' +
                    '   vec4 noise = texture2D( texture1, texCoord );\n' +
                    '   vec2 T1 = texCoord + vec2( 1.5, -1.5 ) * time  * 0.01;\n' +
                    '   vec2 T2 = texCoord + vec2( -0.5, 2.0 ) * time *  0.01;\n' +
                    '   T1.x -= noise.r * 2.0;\n' +
                    '   T1.y += noise.g * 4.0;\n' +
                    '   T2.x += noise.g * 0.2;\n' +
                    '   T2.y += noise.b * 0.2;\n' +
                    '   float p = texture2D( texture1, T1 * 2.0 ).a + 0.25;\n' +
                    '   vec4 color = texture2D( texture2, T2 );\n' +
                    '   vec4 temp = color * 2.0 * ( vec4( p, p, p, p ) ) + ( color * color );\n' +
                    '   gl_FragColor = temp;\n' +
                    '}'
  });
}

function createSun(texture, radius, position) {
  var sunGeometry = new THREE.SphereGeometry(radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  if (!(position === undefined)) sunGeometry.translate(position.x, position.y, position.z);
  var sunMaterial = new THREE.MeshBasicMaterial();
  var sunTexture = new THREE.TextureLoader().load(texture);
  sunMaterial.map = sunTexture;
  var sun = new THREE.Mesh(sunGeometry, sunMaterial);

  // create light
  var light = new THREE.PointLight( 0xffffff, 1.2, 100000 );
  if (!(position === undefined)) light.position.set(position.x, position.y, position.z);
  light.add(sun);

  return light;
}

var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var light = new THREE.PointLight(0xEEEEEE);
var lightAmb = new THREE.AmbientLight(0x777777);
var renderer = new THREE.WebGLRenderer({antialias: true});
var controls = new THREE.OrbitControls(camera);

// create all the planets
var sun = createSun("textures/sunSurfaceMaterial.jpg", 4, new THREE.Vector3(0, 4, -5));
var mercury = createPlanet("textures/mercury.jpg", 2, new THREE.Vector3(-15, 0, 0));
var venus = createPlanet("textures/venus_surface.jpg", 2, new THREE.Vector3(-10, 0, 0));
var earth = createPlanet("textures/earth.jpg", 2, undefined, "textures/earthspecmap.jpg", "textures/earthnormalmap.jpeg");
var clouds = createClouds("/textures/clouds_2.jpg", 2.05);
var moon = createPlanet("textures/moon_texture.jpg", 0.5);
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
// scene.add(light);
scene.add(lightAmb);
scene.add(sun);
scene.add(mercury);
scene.add(venus);
scene.add(earth);
scene.add(clouds);
scene.add(moon);
scene.add(mars);
// scene.add(jupiter);
// scene.add(saturn);
// scene.add(uranus);
// scene.add(neptune);

loadObject("obj/astronaut.obj", "mtl/astronaut.mtl");
// loadObject("obj/rocket.obj", "mtl/rocket.mtl");

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
backgroundScene.add(backgroundCamera);
backgroundScene.add(backgroundMesh);                                                
  
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

//Set the moon's orbital radius, start angle, and angle increment value
var r = 5;
var theta = 0;
var dTheta = 2 * Math.PI / 1000;

var render = function() {
  requestAnimationFrame(render);

  if (!pause) {
    theta += dTheta;
    moon.position.x = r * Math.cos(theta);
    moon.position.z = r * Math.sin(theta);
    earth.rotation.y += 0.0005;
    clouds.rotation.y -= 0.00025;

  
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

      var newPosition = new THREE.Vector3(xVel * increment, yVel * increment, zVel * increment);
      planetData[i].planet.position.add(newPosition);
      if (planetData[i].planet === earth) {
        clouds.position.add(earth.position);
        moon.position.add(earth.position);
      }
      planetData[i].position.add(newPosition);
      //console.log(planetData[i].planet.position);
      planetData[i].velocity = new THREE.Vector3(xVel, yVel, zVel);


    }
  }

  // jupiter.rotation.z += 0.015;
  // sun.rotation.y += 0.01;
  controls.update();
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(backgroundScene, backgroundCamera);
  renderer.render(scene, camera);
};

render();
