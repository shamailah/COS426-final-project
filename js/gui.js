this.sceneDatGui = new dat.GUI(); // controls the meshes in the scene
this.sceneObject = new SceneObject(scene);
var inSceneGui = this.sceneDatGui.addFolder('Add or Remove Objects');

var planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'earth'];

for (var i = 0; i < planetNames.length; i++) {
  this.sceneObject[planetNames[i]] = true;
  this.sceneObject.bodies[planetNames[i]] = new PlanetInfo();
  var controller = inSceneGui.add(this.sceneObject, planetNames[i]);
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
moonObject.controller = inSceneGui.add(this.sceneObject, 'moon');


// controlling the pause functionality
var pauseController = this.sceneDatGui.add(this.sceneObject, 'pause');
pauseController.onChange(function(value) { pause = this.sceneObject.pause; });

// controling the speed 
var speedController = this.sceneDatGui.add(this.sceneObject, 'speed', 1, 20);
speedController.onFinishChange(function(value) {
  // Fires when a controller loses focus.
  speedScale = value;
});

// adding in the trails
var addTrailsController = this.sceneDatGui.add(this.sceneObject, 'showTrails');
addTrailsController.onChange (function(value) {
  trailsActivated = value; 
  if (trailsActivated) activateTrails();
  else deactivateTrails();
})

// handling the controller events for the planet visibility
this.sceneObject.bodies.mercury.controller.onChange(function(value) {
  if (value) scene.add(this.object.bodies.mercury.mesh);
  else scene.remove(this.object.bodies.mercury.mesh);
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
  this.speed = speedScale;
  this.showTrails = false;
  this.pause = false;
}

function PlanetInfo() {
  this.inScene = false;
  this.controller = undefined;
  this.mesh = undefined;
}

function Body(name) {
  this.name = name;
  this.mesh = undefined;
}