this.sceneDatGui = new dat.GUI(); // controls the meshes in the scene
this.sceneObject = new SceneObject(scene);
var inSceneGui = this.sceneDatGui.addFolder('Add or Remove Objects');

var planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'earth'];

for (var i = 0; i < planetNames.length; i++) {
  this.sceneObject[planetNames[i]] = true;
  this.sceneObject.bodies[planetNames[i]] = new PlanetInfo();
  var controller = inSceneGui.add(this.sceneObject, planetNames[i]);
  this.sceneObject.bodies[planetNames[i]].controller = controller;
  // debugger;
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
var pauseController = this.sceneDatGui.add(this.sceneObject, 'pause').name('Pause');
pauseController.onChange(function(value) { pause = sceneObject.pause; });

// controling the speed 
var speedController = this.sceneDatGui.add(this.sceneObject, 'speed', 1, 20).name('Speed');
speedController.onFinishChange(function(value) {
  // Fires when a controller loses focus.
  speedScale = value;
});

// adding in the trails
var addTrailsController = this.sceneDatGui.add(this.sceneObject, 'showTrails').name('Display Trails');
addTrailsController.onChange (function(value) {
  trailsActivated = value; 
  if (trailsActivated) activateTrails();
  else deactivateTrails();
})

// handling the controller events for the planet visibility
this.sceneObject.bodies.mercury.controller.name('Mercury').onChange(function(value) {
  if (value) scene.add(mmercury);
  else scene.remove(mercury);
});
this.sceneObject.bodies.venus.controller.name('Venus').onChange(function(value) {
  if (value) scene.add(venus);
  else scene.remove(venus);
});
this.sceneObject.bodies.mars.controller.name('Mars').onChange(function(value) {
  if (value) scene.add(mars);
  else scene.remove(mars);
});
this.sceneObject.bodies.jupiter.controller.name('Jupiter').onChange(function(value) {
  if (value) scene.add(jupiter);
  else scene.remove(jupiter);
});
this.sceneObject.bodies.saturn.controller.name('Saturn').onChange(function(value) {
  if (value) scene.add(saturn);
  else scene.remove(saturn);
});
this.sceneObject.bodies.uranus.controller.name('Uranus').onChange(function(value) {
  if (value) scene.add(uranus);
  else scene.remove(uranus);
});
this.sceneObject.bodies.neptune.controller.name('Neptune').onChange(function(value) {
  if (value) scene.add(neptune);
  else scene.remove(neptune);
});
this.sceneObject.bodies.earth.controller.name('Earth').onChange(function(value) {
  if (value) {
    scene.add(earth);
    scene.add(clouds);
  }
  else {
    scene.remove(earth);
    scene.remove(clouds);
  }
});
this.sceneObject.bodies.moon.controller.name('Moon').onChange(function(value) {
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