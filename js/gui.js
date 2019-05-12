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

var cloudsBody = new Body('clouds');
cloudsBody.mesh = window['clouds'];
this.sceneObject.bodies['clouds'] = cloudsBody;

var moonObject = new PlanetInfo();
moonObject.mesh = window['moon'];
this.sceneObject.bodies['moon'] = moonObject;
this.sceneObject['moon'] = true;
moonObject.controller = this.sceneDatGui.add(this.sceneObject, 'moon');

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
  if (value) {
    scene.add(this.object.bodies.earth.mesh);
    scene.add(this.object.bodies.clouds.mesh);
  }
  else {
    scene.remove(this.object.bodies.earth.mesh);
    scene.remove(this.object.bodies.clouds.mesh);
  }
});
this.sceneObject.bodies.moon.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.moon.mesh);
  else scene.remove(this.object.bodies.moon.mesh);
})

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

function Body(name) {
  this.name = name;
  this.mesh = undefined;
}