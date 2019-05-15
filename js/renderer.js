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

    if (planetFollow !== selection)
    {
      planetFollow = selection
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

scene.add(light);
scene.add(lightAmb);
scene.add(sun);
scene.add(venus);
scene.add(earth);
scene.add(clouds);
scene.add(moon);
scene.add(mars);
scene.add(mercury);
scene.add(jupiter);
scene.add(saturn);
scene.add(uranus);
scene.add(neptune);

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
  position: new THREE.Vector3(30, 25, 0),
  distance: 64,
  velocity: new THREE.Vector3(19900.0, 0.0, 9900900.0),
  planet: mercury,
  increment: 0.0000001
}

var venusData = {
  mass: 5.970 * Math.pow(10, 24),
  position: new THREE.Vector3(70, -20, 0),
  distance: 110,
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
  position: new THREE.Vector3(190, 45, 0),
  distance: 205,
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
  position: new THREE.Vector3(500, 70, 0),
  distance: 400,
  velocity: new THREE.Vector3(900000.0, 0.0, 9999000.0),
  planet: neptune, 
  increment: 0.0000001 * 0.02384
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

//Set the moon's orbital radius, start angle, and angle increment value
var r = 5;
var theta = 0;
var dTheta = 2 * Math.PI / 300;
earth.geometry.center();
clouds.geometry.center();

var render = function() {
  requestAnimationFrame(render);

  if (!pause) {
    earth.rotation.y -= 0.05;
    clouds.rotation.y += 0.0025;
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

          if (planetData[i].planet == earth)
          {
            camera.position.y = 5;
            //console.log("yo")
          }
          else
          {
            camera.position.y = planetData[i].planet.position.y + sunToPlanet.y * 10;
          }
      
      }
    }
  }

  controls.update();
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(backgroundScene, backgroundCamera);
  renderer.render(scene, camera);
};

render();
